export interface MockAchievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  iconName: string;
  maxProgress?: number;
  currentProgress?: number;
}

export const MOCK_ACHIEVEMENTS: MockAchievement[] = [
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
