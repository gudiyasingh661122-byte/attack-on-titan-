export interface StoryChapter {
  index: string;
  year: string;
  title: string;
  subtitle: string;
  summary: string;
  detail: string;
  image: string;
  videoTimestamp: number;
}

export interface WallRing {
  id: string;
  name: string;
  outerRadiusKm: number;
  distanceBetweenKm: number;
  heightMeters: number;
  districtHighlight: string;
  statusInFootage: string;
  description: string;
  accentColor: string;
}

export interface CharacterDossier {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  titanClassification: string;
  firstAppearanceTimestamp: string;
  videoTimestamp: number;
  quote: string;
  biography: string;
  keyAttributes: string[];
  image: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    index: '01. The Caged Century',
    year: 'Year 845 — Shiganshina',
    title: 'A Century Behind Fifty-Meter Stone',
    subtitle: 'Humanity’s Remnant Within the Three Concentric Walls',
    summary:
      'For over one hundred years, the surviving population of Paradis lived inside three colossal concentric fortifications—Wall Maria, Wall Rose, and Wall Sheena—believing themselves the final remnant of humankind.',
    detail:
      'That fragile peace shattered in the Year 845 when the Colossal and Armored Titans breached the outer gate of Shiganshina District, forcing a retreat behind Wall Rose and setting Eren Yeager on a relentless trajectory toward the truth of the world.',
    image: '/assets/frames/frame_01_awakening.jpg',
    videoTimestamp: 1.0,
  },
  {
    index: '02. The Coordinate & The Paths',
    year: 'Transcending Linear Time',
    title: 'Where All Subjects of Ymir Converge',
    subtitle: 'The Unseen Dimension of Memory and Bone',
    summary:
      'Beyond physical space lies the Coordinate—an endless horizon where luminous branches of light connect every Eldian across past, present, and future.',
    detail:
      'In the footage between 00:08 and 00:21.5, time dilates to near-stillness after the rifle impact. Consciousness passes into the Paths as the primordial spinal entity bridges across the sky to initiate the Founding transformation.',
    image: '/assets/frames/frame_17_paths.jpg',
    videoTimestamp: 17.5,
  },
  {
    index: '03. The Lightning of Shiganshina',
    year: 'Year 854 — The Second Battle',
    title: 'Golden Ignition Over the Rooftops',
    subtitle: 'The Founding Transformation at 00:29.0',
    summary:
      'A blinding column of golden-white electrical energy descends from the heavens, sending concentric shockwaves across the sky of Shiganshina.',
    detail:
      'Unlike standard Titan transformations, the awakening of the Founding Titan’s full authority unleashes a sustained pillar of golden light (00:29.0–00:36.5) that fractures the hardened stone of the Walls from within.',
    image: '/assets/frames/frame_31_lightning.jpg',
    videoTimestamp: 31.5,
  },
  {
    index: '04. The Unmaking of the Walls',
    year: 'Year 854 — The Rumbling Begins',
    title: 'When the Shield Becomes the March',
    subtitle: 'Collapse of the Hardened Fortifications',
    summary:
      'The fifty-meter fortifications that sheltered Paradis were never mere masonry—they were constructed from tens of millions of dormant Colossal Titans hardened into stone.',
    detail:
      'From 00:37.0 onward, crimson fissures tear through the vertical rock faces. Massive slabs shear away into burning streets as rows of skinless Colossal Titans step out from the dust and steam.',
    image: '/assets/frames/frame_40_wall_crack.jpg',
    videoTimestamp: 40.5,
  },
];

export const THREE_WALLS_DATA: WallRing[] = [
  {
    id: 'wall-maria',
    name: 'Wall Maria',
    outerRadiusKm: 480,
    distanceBetweenKm: 100,
    heightMeters: 50,
    districtHighlight: 'Shiganshina District (Southern Edge)',
    statusInFootage: 'Shattered at 00:37.0 — Dormant Colossal Titans Awakened',
    description:
      'The outermost barrier enclosing roughly one-third of Paradis Island’s territory. Shiganshina District serves as both the site of the original tragedy in Year 845 and the epicenter of the Founding transformation in Year 854.',
    accentColor: '#dc2626',
  },
  {
    id: 'wall-rose',
    name: 'Wall Rose',
    outerRadiusKm: 380,
    distanceBetweenKm: 130,
    heightMeters: 50,
    districtHighlight: 'Trost, Karanes, Utopia & Krolva Districts',
    statusInFootage: 'Unhardened Simultaneously Across All Districts',
    description:
      'Positioned 100 kilometers inward from Wall Maria, Wall Rose served as humanity’s primary defensive perimeter for five years before the reclamation of Shiganshina.',
    accentColor: '#ea580c',
  },
  {
    id: 'wall-sheena',
    name: 'Wall Sheena',
    outerRadiusKm: 250,
    distanceBetweenKm: 250,
    heightMeters: 50,
    districtHighlight: 'Stohess, Ehrmich, Yarckel & Mitras (Royal Capital)',
    statusInFootage: 'Innermost Ring Unsealed During the Rumbling',
    description:
      'Protecting the royal capital of Mitras and the interior estates, Wall Sheena’s hardened shell also dissolved when the Founding Titan’s command echoed through the Paths.',
    accentColor: '#d4af37',
  },
];

export const CHARACTER_DOSSIERS: CharacterDossier[] = [
  {
    id: 'eren-yeager',
    name: 'Eren Yeager',
    role: 'Protagonist · Survey Corps',
    affiliation: 'Paradis Island / Eldia',
    titanClassification: 'Attack Titan · Founding Titan · War Hammer Titan',
    firstAppearanceTimestamp: '00:08.0 & 00:22.0',
    videoTimestamp: 25.5,
    quote: 'I will keep moving forward—until every boundary that cages this world is undone.',
    biography:
      'Born in Shiganshina District, Eren witnessed the fall of Wall Maria as a child. Driven by an uncompromising pursuit of freedom, his journey culminates in the Paths convergence and the awakening of the Founding Titan.',
    keyAttributes: ['Coordinate Authority', 'Unshakable Resolve', 'Shiganshina Native'],
    image: '/assets/frames/frame_25_eren.jpg',
  },
  {
    id: 'founding-titan',
    name: 'The Founding Titan (Doomsday Form)',
    role: 'Apex Manifestation',
    affiliation: 'The Coordinate',
    titanClassification: 'Progenitor / Founding Titan',
    firstAppearanceTimestamp: '01:04.0 – 01:24.4',
    videoTimestamp: 73.5,
    quote: 'A sovereign cathedral of bone and steam towering above the marching ranks.',
    biography:
      'Manifested after the luminous spinal entity reconnects at 00:17.0, the Founding Titan rises as an immense skeletal superstructure hundreds of meters high, shrouded in superheated crimson steam.',
    keyAttributes: ['Cathedral Ribcage Architecture', 'Telepathic Paths Broadcast', 'Wall Unhardening'],
    image: '/assets/frames/frame_73_ribs.jpg',
  },
  {
    id: 'wall-colossal-titans',
    name: 'The Wall Titans',
    role: 'Dormant Pillars of the Three Walls',
    affiliation: 'First King Karl Fritz / The Coordinate',
    titanClassification: 'Colossal Class (50-Meter Scale)',
    firstAppearanceTimestamp: '00:53.0 – 01:24.4',
    videoTimestamp: 81.0,
    quote: 'Out of the falling masonry of Shiganshina, the stone shield begins to walk.',
    biography:
      'Encased within the hardened stone of Walls Maria, Rose, and Sheena for over a century, these skinless fifty-meter Colossal Titans emerge in unison through clouds of ash and boiling vapor.',
    keyAttributes: ['50-Meter Stature', 'Superheated Steam Emission', 'Synchronized Phalanx'],
    image: '/assets/frames/frame_81_colossal.jpg',
  },
  {
    id: 'zeke-yeager',
    name: 'Zeke Yeager',
    role: 'Royal Bloodline Catalyst',
    affiliation: 'Warriors / Yeagerists',
    titanClassification: 'Beast Titan',
    firstAppearanceTimestamp: '00:11.0 (Iris Reflection)',
    videoTimestamp: 8.5,
    quote: 'At the threshold between life and death, the royal key unlocks the Coordinate.',
    biography:
      'Half-brother to Eren Yeager and bearer of royal Eldian blood. His contact with Eren in the heat of the Shiganshina battle bridges the mortal battlefield to the timeless expanse of the Paths.',
    keyAttributes: ['Royal Lineage', 'Paths Catalyst', 'Strategic Tactician'],
    image: '/assets/frames/frame_08_eye.jpg',
  },
  {
    id: 'hallucigenia-paths',
    name: 'The Luminous Spine (Source of Living Matter)',
    role: 'Primordial Entity',
    affiliation: 'Origin of Titan Power',
    titanClassification: 'Progenitor Conduit',
    firstAppearanceTimestamp: '00:12.0 – 00:24.5',
    videoTimestamp: 17.5,
    quote: 'An ancient, radiant filament bridging severed mortality into colossal rebirth.',
    biography:
      'First encountered beneath the great tree two millennia ago, this luminous centipede-like entity erupts in blinding white-gold light at 00:12.0 to fuse the Founding power back together.',
    keyAttributes: ['White-Gold Bioluminescence', 'Instantaneous Regeneration', 'Ancient Origin'],
    image: '/assets/frames/frame_17_paths.jpg',
  },
  {
    id: 'shiganshina-vanguard',
    name: 'Shiganshina Witness & Vanguard',
    role: 'Ground Zero Perspective',
    affiliation: 'Marley & Paradis Combatants',
    titanClassification: 'Human Perspective',
    firstAppearanceTimestamp: '00:00.0 – 00:02.5',
    videoTimestamp: 1.0,
    quote: 'In the span of a single breath, terror turns into awe as the sky splits open.',
    biography:
      'Caught at the base of the fracturing Walls, soldiers and witnesses on the ground experience the blinding golden flash and the deafening collapse of the century-old stone barrier.',
    keyAttributes: ['Ground-Level Scale', 'Shockwave Survival', 'Witness to History'],
    image: '/assets/frames/frame_61_aerial.jpg',
  },
];
