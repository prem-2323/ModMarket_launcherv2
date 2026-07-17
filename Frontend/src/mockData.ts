import { Mod, Achievement } from './types';

export const MOCK_MODS: Mod[] = [
  {
    id: 'mod-1',
    title: 'Scania S Next-Gen Custom V2.5',
    tagline: 'Fully customized Scania S Series with custom chassis, cabin options, and dynamic glowing LEDs.',
    category: 'truck',
    isPremium: true,
    price: 14.99,
    downloads: 12450,
    rating: 4.9,
    author: 'Zeus3D Mods',
    version: '2.5.1',
    fileSize: '450 MB',
    releaseDate: '2026-06-12',
    thumbnail: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Transform your Euro Truck Simulator 2 experience with the ultimate Scania S Next-Gen Custom modification. This mod replaces and expands the default Scania S with an incredibly detailed exterior, custom performance tuning, custom exhaust smoke, custom dashboard lights, and support for the latest Cabin Accessories DLC.',
    features: [
      'Extreme high-resolution 4K exterior textures',
      'Custom glowing neon dynamic LED light bars (cyan, amber, red)',
      '12 distinct chassis configurations including heavy-haul 8x4/4',
      'Custom realistic V8 engine sound recordings with exhaust valves',
      'Fully animated interior components and digital tablet GPS integration',
      'Custom steering wheel animations and gear lever physics'
    ],
    compatibility: 'ETS2 v1.50 - v1.52.x',
    requiredDLC: ['Cabin Accessories DLC', 'Mighty Griffin Tuning Pack'],
    dependencies: ['ModMarket Core Assets v1.4'],
    reviewsCount: 382,
    ratingBreakdown: {
      5: 320,
      4: 45,
      3: 12,
      2: 4,
      1: 1
    }
  },
  {
    id: 'mod-2',
    title: 'Project Balkans Map Expansion',
    tagline: 'Explore the beautiful Adriatic coast, winding mountain roads, and narrow villages across the Balkans.',
    category: 'map',
    isPremium: false,
    price: 0,
    downloads: 84320,
    rating: 4.7,
    author: 'MapCreators Co.',
    version: '1.9.4',
    fileSize: '1.2 GB',
    releaseDate: '2026-05-30',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Project Balkans introduces hundreds of kilometers of beautiful, meticulously crafted scenery. Cruise down coastal highways overlooking the sea, navigate steep alpine climbs in Bosnia, and experience custom checkpoints, dynamic border delays, local traffic styles, and unique landmarks.',
    features: [
      '14 new custom-modeled cities across 4 Balkan countries',
      'Highly challenging, narrow mountain gravel roads with real physical bumps',
      'Custom border patrol crossings with functional queues',
      'Unique regional highway signage and local AI traffic assets',
      'Handcrafted landmarks, historical monuments, and scenic overlooks'
    ],
    compatibility: 'ETS2 v1.51 - v1.52',
    requiredDLC: ['Going East DLC', 'Italia DLC', 'Road to the Black Sea DLC'],
    dependencies: [],
    reviewsCount: 1540,
    ratingBreakdown: {
      5: 1240,
      4: 210,
      3: 65,
      2: 15,
      1: 10
    }
  },
  {
    id: 'mod-3',
    title: 'Next-Gen Graphics Overhaul V5',
    tagline: 'Stunning real-world skies, volumetric fog, high-res asphalt, and custom lighting profiles.',
    category: 'graphics',
    isPremium: true,
    price: 9.99,
    downloads: 32800,
    rating: 4.95,
    author: 'VisualArt3D',
    version: '5.0.0',
    fileSize: '2.8 GB',
    releaseDate: '2026-07-01',
    thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The definitive graphics modification for Euro Truck Simulator 2. Version 5 brings fully volumetric clouds, high-dynamic-range lighting maps, realistic wet road reflections with individual water droplets, re-textured tree models, photorealistic asphalt, and custom color grading templates optimized for high performance.',
    features: [
      'Over 120 custom 8K real-sky HDR maps (sunny, overcast, stormy, twilight)',
      'Volumetric dynamic fog that crawls into valley basins at dawn',
      'Completely rebuilt weather cycle featuring true seasonal variations',
      'Re-engineered water physics with splash feedback and window raindrop effects',
      'Pre-configured color grading curves (Cinematic, Realistic, Vibrant, and Classic)'
    ],
    compatibility: 'ETS2 v1.50 - v1.52',
    requiredDLC: [],
    dependencies: [],
    reviewsCount: 894,
    ratingBreakdown: {
      5: 820,
      4: 55,
      3: 15,
      2: 3,
      1: 1
    }
  },
  {
    id: 'mod-4',
    title: 'Krone Premium MegaLiner Pack',
    tagline: 'Incredibly detailed Krone MegaLiner trailers with multi-wheel options, custom skin editor support.',
    category: 'trailers',
    isPremium: false,
    price: 0,
    downloads: 18450,
    rating: 4.5,
    author: 'TrailerSkins Pro',
    version: '1.2.0',
    fileSize: '150 MB',
    releaseDate: '2026-04-15',
    thumbnail: 'https://images.unsplash.com/photo-1590496793993-376579a3e16a?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1590496793993-376579a3e16a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'This trailer modification features full 1:1 scale replicas of Krone MegaLiner trailers. Packed with customizable mudflaps, reflection stickers, custom license plates, side markers, and paintable canvases, it represents the premium hauling standard in Europe.',
    features: [
      'Standalone container and box-trailer models',
      'Tuning parts: custom bumpers, side skirts, and toolbox storage units',
      '15 pre-configured logistics company skins (DHL, Maersk, DB Schenker, etc.)',
      'Fully paintable tarpaulin with layered shading templates'
    ],
    compatibility: 'ETS2 v1.51 - v1.52',
    requiredDLC: ['Krone Trailer Pack DLC'],
    dependencies: [],
    reviewsCount: 112,
    ratingBreakdown: {
      5: 80,
      4: 20,
      3: 8,
      2: 3,
      1: 1
    }
  },
  {
    id: 'mod-5',
    title: 'Sound Environment Redefined v3.1',
    tagline: 'True-to-life ambient noises, squeaking brakes, dynamic tire hum, and roaring rain storms.',
    category: 'sounds',
    isPremium: true,
    price: 4.99,
    downloads: 14200,
    rating: 4.8,
    author: 'AudioEngine',
    version: '3.1.2',
    fileSize: '780 MB',
    releaseDate: '2026-06-25',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484755560693-a4074577af3a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Throw away the default flat ambient soundscapes. Sound Environment Redefined replaces all background, engine cabin, and external noises with high-fidelity binaural recordings. Features dynamic tire whine on wet asphalt, squeaking cabin suspension, customized horns, and realistic rain pattering on glass.',
    features: [
      'Completely replaced wind, rain, and storm ambient sounds',
      'Binaural 3D passenger cabin sound mapping',
      'Realistic engine cabin insulation based on vehicle model speed',
      'Individually recorded high-fidelity suspension and metal squeak sounds',
      'Unique railway, ferry, and city traffic ambient sound profiles'
    ],
    compatibility: 'ETS2 v1.50 - v1.52',
    requiredDLC: [],
    dependencies: [],
    reviewsCount: 224,
    ratingBreakdown: {
      5: 190,
      4: 25,
      3: 6,
      2: 2,
      1: 1
    }
  },
  {
    id: 'mod-6',
    title: 'Real-Physics Suspension Overhaul',
    tagline: 'Accurate cabin tilt, dynamic fifth-wheel friction, and real-feel heavy cargo inertia.',
    category: 'physics',
    isPremium: false,
    price: 0,
    downloads: 51000,
    rating: 4.65,
    author: 'PhysicsEng',
    version: '4.2',
    fileSize: '45 MB',
    releaseDate: '2026-03-10',
    thumbnail: 'https://images.unsplash.com/photo-1518659276927-5da44177455e?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1518659276927-5da44177455e?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Bring realism back to truck handling. This physics override alters truck and trailer suspension rates, tires adhesion coefficient, cabin rolling behavior, and dynamic cargo shifting. Perfect for steering wheel users seeking heavy haul immersion.',
    features: [
      'Re-engineered cabin air-suspension physics curves',
      'Realistic high-speed roll and heavy brake weight transferring',
      'Adjusted wet-asphalt braking distance factors',
      'Optimized wheel slip modeling for standard and custom tire mods'
    ],
    compatibility: 'ETS2 v1.50 - v1.52.x',
    requiredDLC: [],
    dependencies: [],
    reviewsCount: 310,
    ratingBreakdown: {
      5: 240,
      4: 50,
      3: 15,
      2: 3,
      1: 2
    }
  }
];



export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Million Mile Driver',
    description: 'Accumulate a total driving distance of 1,000,000 km across Europe.',
    unlocked: true,
    unlockedDate: '2026-04-12',
    iconName: 'Truck',
    maxProgress: 1000000,
    currentProgress: 1000000
  },
  {
    id: 'ach-2',
    title: 'Mod Collector',
    description: 'Download and activate 25 or more mods simultaneously.',
    unlocked: false,
    iconName: 'FolderPlus',
    maxProgress: 25,
    currentProgress: 12
  },
  {
    id: 'ach-3',
    title: 'Premium Supporter',
    description: 'Acquire your first premium high-fidelity modification from ModMarket.',
    unlocked: true,
    unlockedDate: '2026-07-02',
    iconName: 'Crown',
    maxProgress: 1,
    currentProgress: 1
  },
  {
    id: 'ach-4',
    title: 'Heavy Hauler King',
    description: 'Complete 50 deliveries exceeding 50 tons payload without single collision.',
    unlocked: false,
    iconName: 'ShieldAlert',
    maxProgress: 50,
    currentProgress: 37
  }
];

export const MOCK_NEWS = [
  {
    id: 'news-1',
    title: 'ModMarket Launcher v2.2 Released!',
    summary: 'Introducing lightning-fast download queues, automatic conflict check diagnostics, and fully offline gameplay backup options.',
    date: '2026-07-14',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'news-2',
    title: 'ETS2 Version 1.52 Preview & Mod Compatibility',
    summary: 'Our engineering team is actively tracking the latest SCS Software beta. We are happy to announce over 92% compatibility already.',
    date: '2026-07-10',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'news-3',
    title: 'Top 5 Graphic Mods of the Summer Season',
    summary: 'Check out the highest rated visual modifications, lighting configs, and high-res foliage overhaul releases for realistic trucking.',
    date: '2026-06-28',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80'
  }
];

export const MOCK_RECENT_ACTIVITY = [
  {
    id: 'act-1',
    text: 'Updated "Scania S Next-Gen Custom" to v2.5.1',
    time: '2 hours ago',
    type: 'download'
  },
  {
    id: 'act-2',
    text: 'Purchased "Next-Gen Graphics Overhaul V5"',
    time: '1 day ago',
    type: 'payment'
  },
  {
    id: 'act-3',
    text: 'Completed conflict resolution check on 12 mods',
    time: '2 days ago',
    type: 'success'
  },
  {
    id: 'act-4',
    text: 'Optimized ETS2 game cache (cleared 320MB temp files)',
    time: '3 days ago',
    type: 'info'
  }
];
