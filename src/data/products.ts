export type ProductCategory =
  | 'All Concepts'
  | 'Apparel'
  | 'Collectibles'
  | 'Editorial Editions'
  | 'Wall Art';

export interface ConceptProduct {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  category: Exclude<ProductCategory, 'All Concepts'>;
  conceptNote: string;
  description: string;
  materialsAndSpecs: string[];
  dimensions: string;
  image: string;
  accentColor: string;
  videoPhaseRef: string;
  svgMotif: 'coat' | 'monolith' | 'vinyl' | 'triptych' | 'watch' | 'compendium';
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'All Concepts',
  'Apparel',
  'Collectibles',
  'Editorial Editions',
  'Wall Art',
];

/**
 * Portfolio Demonstration Concept Products
 * Explicitly presented as non-commercial design/frontend showcase concepts.
 */
export const CONCEPT_PRODUCTS: ConceptProduct[] = [
  {
    id: 'concept-survey-trench',
    code: 'CONCEPT-01',
    name: 'Shiganshina Obsidian Field Coat',
    subtitle: 'Heavyweight Technical Wool & Weathered Brass Hardware Concept',
    category: 'Apparel',
    conceptNote: 'Concept Showcase — Non-Commercial Design Study',
    description:
      'An architectural outerwear design study inspired by Phase 1 & Phase 3 of the SHŌT reel. Features a storm-flapped asymmetrical collar, matte obsidian Virgin wool weave, and subtle tonal embroidery of the Three Concentric Walls along the interior lining.',
    materialsAndSpecs: [
      '620gsm Italian brushed Virgin wool shell in stark obsidian (#0B0B0E)',
      'Custom oxidized brass clasp hardware with engraved coordinate grid',
      'Interior satin-jacquard map of Shiganshina District',
      'Articulated gusseted shoulders engineered for kinetic drape',
    ],
    dimensions: 'Tailored Unisex Silhouette · Sizes S–XL (Design Spec)',
    image: '/assets/frames/frame_25_eren.jpg',
    accentColor: '#d4af37',
    videoPhaseRef: 'Synchronized with Phase 1 (00:25.0)',
    svgMotif: 'coat',
  },
  {
    id: 'concept-founding-monolith',
    code: 'CONCEPT-02',
    name: 'Sovereign Ribcage Architectural Sculpture',
    subtitle: '1:400 Scale Cold-Cast Bronze & Translucent Amber Resin',
    category: 'Collectibles',
    conceptNote: 'Concept Showcase — Portfolio 3D/Industrial Study',
    description:
      'A museum-grade desk monolith study capturing the dramatic skeletal perspective from 01:12.0–01:16.5 of the video. Built around a warm integrated LED base that illuminates the translucent amber steam tendrils beneath the arched vertebrae.',
    materialsAndSpecs: [
      'Hand-patinated cold-cast bronze skeletal rib arches',
      'Optical-grade cast resin base with diffused 2200K ember illumination',
      'Machined black anodized aluminum plinth with chamfered edges',
      'USB-C low-voltage dimmer controller (Design Prototype Spec)',
    ],
    dimensions: '420mm × 180mm × 240mm · 3.8 kg',
    image: '/assets/frames/frame_73_ribs.jpg',
    accentColor: '#ea580c',
    videoPhaseRef: 'Synchronized with Phase 5 (01:13.5)',
    svgMotif: 'monolith',
  },
  {
    id: 'concept-paths-compendium',
    code: 'CONCEPT-03',
    name: 'SHŌT — The 84.4 Second Frame Monograph',
    subtitle: 'Hardcover Linen-Bound Cinematography & Motion Breakdown Book',
    category: 'Editorial Editions',
    conceptNote: 'Concept Showcase — Editorial Print Direction',
    description:
      'A 240-page large-format monograph documenting the frame-by-frame color script, timecode synchronization blueprint, and typography system of the SHŌT web experience. Bound in raw charcoal linen with gold-foil stamped Paths geometry.',
    materialsAndSpecs: [
      '170gsm Munken Polar rough matte art paper with high-density archival ink',
      'Swiss-bound lay-flat spine exposing crimson linen stitching',
      '24K gold-foil debossed cover motif inspired by 00:17.0 Paths energy',
      'Includes fold-out 100cm timecode waveform & lighting chart',
    ],
    dimensions: '310mm × 240mm × 28mm · 240 Pages',
    image: '/assets/frames/frame_17_paths.jpg',
    accentColor: '#fbbf24',
    videoPhaseRef: 'Synchronized with Phase 1 (00:17.5)',
    svgMotif: 'compendium',
  },
  {
    id: 'concept-wall-breach-triptych',
    code: 'CONCEPT-04',
    name: 'Fracture of Wall Maria — Anodized Metal Triptych',
    subtitle: 'Three-Panel Brushed Aluminum & Crimson Enamel Relief',
    category: 'Wall Art',
    conceptNote: 'Concept Showcase — Spatial Wall Installation',
    description:
      'A three-panel architectural wall installation translating the crimson fissure textures from Phase 3 (00:37.0–00:42.5) into laser-etched brushed dark titanium aluminum with recessed crimson lacquer veins.',
    materialsAndSpecs: [
      '3mm aircraft-grade brushed dark-anodized aluminum panels',
      'Multi-depth CNC fracture engraving filled with matte crimson enamel',
      'Concealed French-cleat floating wall mount (18mm shadow gap)',
      'Individually numbered studio concept plate on reverse',
    ],
    dimensions: '1200mm × 600mm (Three 400mm × 600mm Panels)',
    image: '/assets/frames/frame_40_wall_crack.jpg',
    accentColor: '#dc2626',
    videoPhaseRef: 'Synchronized with Phase 3 (00:40.5)',
    svgMotif: 'triptych',
  },
  {
    id: 'concept-lightning-vinyl',
    code: 'CONCEPT-05',
    name: '00:29.0 — Golden Ignition Double Vinyl Concept',
    subtitle: '180g Translucent Amber & Black Smoke Marbled Gatefold LP',
    category: 'Editorial Editions',
    conceptNote: 'Concept Showcase — Packaging & Visual Identity',
    description:
      'A bespoke vinyl packaging concept celebrating the acoustic and visual climax of Phase 2. The gatefold interior unfolds into a panoramic view of the lightning column striking behind Shiganshina’s rooftops.',
    materialsAndSpecs: [
      'Dual 180-gram heavyweight translucent gold & obsidian smoke vinyl',
      '400gsm matte soft-touch gatefold sleeve with spot-UV lightning arcs',
      '16-page booklet featuring sound design and motion trigger notation',
      'Anti-static Japanese rice-paper inner sleeves',
    ],
    dimensions: '314mm × 314mm × 12mm · Gatefold Edition',
    image: '/assets/frames/frame_31_lightning.jpg',
    accentColor: '#f59e0b',
    videoPhaseRef: 'Synchronized with Phase 2 (00:31.5)',
    svgMotif: 'vinyl',
  },
  {
    id: 'concept-coordinate-chronograph',
    code: 'CONCEPT-06',
    name: 'Coordinate 84.4 Mechanical Chronograph Study',
    subtitle: 'Bead-Blasted Grade 5 Titanium & Meteorite Dial Concept',
    category: 'Collectibles',
    conceptNote: 'Concept Showcase — Horological Industrial Design',
    description:
      'A conceptual timepiece engineered around the 84.4-second master clock of the SHŌT experience. The chapter ring is calibrated with the five phase boundaries, while the sub-dial tracks impact intervals in luminous gold.',
    materialsAndSpecs: [
      '40mm Grade 5 bead-blasted titanium case with fractured stone bezel texture',
      'Dark Muonionalusta meteorite dial with gilded Paths indices',
      'Domed sapphire crystal with dual-sided anti-reflective coating',
      'Exhibition caseback etched with the Three Concentric Walls',
    ],
    dimensions: '40mm Diameter · 11.2mm Thickness · 47mm Lug-to-Lug',
    image: '/assets/frames/frame_08_eye.jpg',
    accentColor: '#d4af37',
    videoPhaseRef: 'Synchronized with Phase 1 (00:08.5)',
    svgMotif: 'watch',
  },
];
