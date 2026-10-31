import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCinematicState,
  evaluateActiveImpact,
  formatTimecode,
  getNavBoxFragmentSpecs,
  ImpactTriggerTracker,
} from './timelineEngine';

test('All navigation boxes are fully visible and intact from frame 0.0s (no delayed entrance)', () => {
  const state0 = computeCinematicState(0.0);
  assert.equal(state0.navigation.visible, true);
  assert.equal(state0.navigation.revealProgress, 1);
  assert.equal(state0.navigation.destructionStage, 'intact');
  assert.equal(state0.navigation.boxes.length, 5);
  for (const box of state0.navigation.boxes) {
    assert.equal(box.stage, 'intact');
    assert.equal(box.intactBoxOpacity, 1);
    assert.equal(box.crackProgress, 0);
    assert.equal(box.fragmentsVisible, false);
  }
});

test('Stage A (37.0s - 40.3s): Cracks spread across intact navigation boxes with subtle tremor', () => {
  const stateEarlyCrack = computeCinematicState(37.6);
  const stateLateCrack = computeCinematicState(40.1);
  const boxEarly = stateEarlyCrack.navigation.boxes[0];
  const boxLate = stateLateCrack.navigation.boxes[0];

  assert.equal(boxEarly.stage, 'cracking');
  assert.equal(boxEarly.intactBoxOpacity, 1);
  assert.ok(boxEarly.crackProgress > 0.1);
  assert.ok(boxLate.crackProgress > boxEarly.crackProgress);
  assert.equal(boxLate.intactBoxOpacity, 1);
});

test('Stage B (41.5s): Boxes physically break into 14 irregular fragments and original box disappears', () => {
  const stateBreak = computeCinematicState(41.5);
  for (const box of stateBreak.navigation.boxes) {
    assert.equal(box.intactBoxOpacity, 0, 'Original box must disappear during fragmentation');
    assert.equal(box.fragmentsVisible, true);
    assert.equal(box.fragments.length, 14);
    const activeCount = box.fragments.filter((f) => f.opacity > 0).length;
    assert.equal(activeCount, 14);
  }
});

test('Stage C & D: Smaller fragments disappear before larger fragments, and all fragments vanish before 84.4s', () => {
  const specs = getNavBoxFragmentSpecs(0);
  const tinyIdx = specs.findIndex((s) => s.sizeTier === 'tiny');
  const largeIdx = specs.findIndex((s) => s.sizeTier === 'large');
  assert.ok(tinyIdx >= 0 && largeIdx >= 0);

  // At 45.0s, fragments are falling downward under gravity with rotation
  const stateFalling = computeCinematicState(45.0);
  const fragLarge45 = stateFalling.navigation.boxes[0].fragments[largeIdx];
  assert.ok(fragLarge45.dy > 50, 'Fragments must fall downward under gravity');
  assert.ok(fragLarge45.rotZ !== 0, 'Fragments must rotate while falling');

  // At 56.0s, tiny fragments have already disappeared while large fragments are still falling/fading
  const state56 = computeCinematicState(56.0);
  const fragTiny56 = state56.navigation.boxes[0].fragments[tinyIdx];
  const fragLarge56 = state56.navigation.boxes[0].fragments[largeIdx];
  assert.equal(fragTiny56.opacity, 0, 'Tiny fragments must disappear first');
  assert.ok(fragLarge56.opacity > 0, 'Larger fragments remain visible longer');

  // By 81.0s (before video ends at 84.4s), all fragments across all 5 boxes are 100% gone
  const state81 = computeCinematicState(81.0);
  for (const box of state81.navigation.boxes) {
    assert.equal(box.stage, 'dissolved');
    assert.equal(box.fragmentsVisible, false);
    for (const f of box.fragments) {
      assert.equal(f.opacity, 0);
    }
  }
});

test('Seeking or replaying to 0.0s resets navigation boxes to intact state', () => {
  const destroyedState = computeCinematicState(50.0);
  assert.equal(destroyedState.navigation.boxes[0].intactBoxOpacity, 0);

  const replayedState = computeCinematicState(0.0);
  for (const box of replayedState.navigation.boxes) {
    assert.equal(box.stage, 'intact');
    assert.equal(box.intactBoxOpacity, 1);
    assert.equal(box.fragmentsVisible, false);
  }
});

test('Seeking directly to 30.0s immediately displays Phase 2 Golden Lightning strike state', () => {
  const state = computeCinematicState(30.0);
  assert.equal(state.phaseId, 'phase-2');
  assert.equal(state.phaseNumber, 2);
  assert.equal(state.lightning.active, true);
  assert.equal(state.lightning.intensity, 1.0);
  assert.equal(state.navigation.visible, true);
  assert.equal(state.navigation.borderGlow, 'gold');
});

test('Screen shake is strictly impact-based and settles to zero between impacts', () => {
  const impactMoment = evaluateActiveImpact(29.05, false);
  assert.ok(impactMoment.impact !== null);
  assert.equal(impactMoment.impact?.id, 'impact-main-lightning-29');

  const calmMoment = evaluateActiveImpact(33.0, false);
  assert.equal(calmMoment.impact, null);
  assert.equal(calmMoment.shakeOffset.x, 0);
  assert.equal(calmMoment.shakeOffset.y, 0);
});

test('Reduced motion zeroes out screen shake, flash opacity, and camera zoom', () => {
  const state = computeCinematicState(29.05, true);
  assert.equal(state.shakeOffset.x, 0);
  assert.equal(state.shakeOffset.y, 0);
  assert.equal(state.flashOpacity, 0);
  assert.equal(state.lighting.cameraZoom, 1.0);
});

test('ImpactTriggerTracker prevents duplicate triggers during playback and resets on seek', () => {
  const tracker = new ImpactTriggerTracker();
  const firstHit = tracker.checkTrigger(29.05);
  assert.equal(firstHit?.id, 'impact-main-lightning-29');

  const duplicateHit = tracker.checkTrigger(29.08);
  assert.equal(duplicateHit, null);

  tracker.resetForSeek(28.0);
  const retriggeredHit = tracker.checkTrigger(29.05);
  assert.equal(retriggeredHit?.id, 'impact-main-lightning-29');
});

test('formatTimecode formats seconds into MM:SS.d tabular strings', () => {
  assert.equal(formatTimecode(0), '00:00.0');
  assert.equal(formatTimecode(29.5), '00:29.5');
  assert.equal(formatTimecode(84.4), '01:24.4');
});
