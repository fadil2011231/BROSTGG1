export interface SeedItem {
  id: string;
  name: string;
  category: 'speedrun' | 'survival' | 'trial';
  badge1: string;
  badge2: string;
  description: string;
  seed: string;
  coordLabel: string;
  coordValue: string;
  imageUrl: string;
  version: string;
  biome: string;
  netherCoords?: string;
  features: string[];
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
