// Shared types and interfaces for the packing calculator

export interface Box {
  l: number;
  w: number;
  h: number;
  tag: string;
  burst?: number | string;
  wall?: string;
  maxWeight?: number | null;
  sizeSum?: number | null;
  note?: string;
}

export interface PackingRequirements {
  buffer: number;
  weightMultiplier: number;
  description: string;
}

export interface ItemData {
  length: number;
  width: number;
  height: number;
  weight?: number;
  packingType: string;
  customBuffer?: number;
}

export interface RejectedBox extends Box {
  rejectionReason: string;
}

export interface BoxRecommendation {
  box?: Box;
  telescopedBox?: {
    box1: Box;
    combinedHeight: number;
    combinedDimensions: string;
    overlap: number;
    rotated?: boolean;
  };
  warnings: string[];
  error?: string;
  errorDetails?: {
    requiredDimensions: string;
    largestAvailableFootprint: string;
    issue: string;
  };
  calculations?: {
    originalDimensions: string;
    bufferApplied: string;
    requiredDimensions: string;
    rejectedBoxes: RejectedBox[];
  };
}

// Constants
export const TELESCOPING_WEIGHT_MULTIPLIER = 1.6;

// Box type configurations
export const BOX_TYPE_CONFIG = {
  regular: {
    telescopingOverlap: 4,
    displayName: 'Regular',
    icon: '📦',
    description: 'Standard shipping boxes',
    warningThreshold: 50 // weight threshold for warnings
  },
  specialty: {
    telescopingOverlap: 5,
    displayName: 'Specialty',
    icon: '⚡',
    description: 'Long/odd shapes (golf, guitar, bike)',
    warningThreshold: 40
  },
  wardrobe: {
    telescopingOverlap: 6,
    displayName: 'Wardrobe',
    icon: '👔',
    description: 'Large clothing boxes',
    warningThreshold: 30
  },
  art: {
    telescopingOverlap: 3,
    displayName: 'Art',
    icon: '🎨',
    description: 'Flat items, artwork, frames',
    warningThreshold: 25
  }
} as const;

export type BoxTag = keyof typeof BOX_TYPE_CONFIG;