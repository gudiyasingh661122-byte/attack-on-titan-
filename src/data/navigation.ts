export interface NavItem {
  id: string;
  label: string;
  shortCode: string;
  sectionId: string;
  videoPhaseTime: number;
  subtitle: string;
}

export const MAIN_NAVIGATION_ITEMS: NavItem[] = [
  {
    id: 'nav-overview',
    label: 'Overview',
    shortCode: 'I',
    sectionId: 'overview',
    videoPhaseTime: 0.0,
    subtitle: 'The Awakening',
  },
  {
    id: 'nav-story',
    label: 'Story & World',
    shortCode: 'II',
    sectionId: 'story-world',
    videoPhaseTime: 29.0,
    subtitle: 'Three Walls & Paths',
  },
  {
    id: 'nav-characters',
    label: 'Characters',
    shortCode: 'III',
    sectionId: 'characters',
    videoPhaseTime: 40.5,
    subtitle: 'Key Figures & Nine Titans',
  },
  {
    id: 'nav-chronicle',
    label: 'Chronicle',
    shortCode: 'IV',
    sectionId: 'chronicle',
    videoPhaseTime: 68.0,
    subtitle: '84.4s Master Timeline',
  },
  {
    id: 'nav-store',
    label: 'Concept Store',
    shortCode: 'V',
    sectionId: 'concept-store',
    videoPhaseTime: 80.0,
    subtitle: 'Demonstration Showcase',
  },
];
