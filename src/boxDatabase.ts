// UPS Store Box Database - TUPSS 5374 Keizer, OR
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

// Box inventory sorted by volume ascending
export const boxes: Box[] = [
  // Regular corrugated boxes (sorted by volume)
  { l: 6, w: 6, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },            // 216
  { l: 12, w: 9, h: 3, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 324
  { l: 11, w: 9, h: 4, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 396
  { l: 12, w: 9, h: 4, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 432
  { l: 8, w: 8, h: 8, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },           // 512
  { l: 12, w: 9, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 648
  { l: 14, w: 14, h: 4, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 784
  { l: 12, w: 12, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 864
  { l: 10, w: 10, h: 10, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 1000
  { l: 16, w: 16, h: 4, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 1024
  { l: 18, w: 12, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 1296
  { l: 17, w: 11, h: 8, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 1496
  { l: 24, w: 8, h: 8, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 1536
  { l: 16, w: 16, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 1536
  { l: 16, w: 10, h: 10, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 1600
  { l: 20, w: 14, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 1680
  { l: 12, w: 12, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 1728
  { l: 15, w: 12, h: 10, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 1800
  { l: 20, w: 16, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 1920
  { l: 14, w: 12, h: 14, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 2352
  { l: 16, w: 16, h: 10, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 2560
  { l: 18, w: 12, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 2592
  
  // Art boxes (flat packs)
  { l: 23, w: 4.5, h: 27.25, tag: "art", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 },        // 2820
  
  { l: 24, w: 12, h: 10, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 2880
  { l: 24, w: 12, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 3456
  { l: 30, w: 20, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 3600
  { l: 18, w: 18, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 3888
  { l: 20, w: 14, h: 14, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 3920
  { l: 16, w: 16, h: 16, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 4096
  { l: 30, w: 24, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 4320
  { l: 36, w: 21, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 4536
  { l: 24, w: 16, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 4608
  { l: 36, w: 12, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 5184
  
  // Art boxes continued
  { l: 27, w: 5.5, h: 35, tag: "art", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 },           // 5198
  
  { l: 24, w: 16, h: 16, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 6144
  { l: 18, w: 18, h: 18, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 5832
  { l: 20, w: 20, h: 16, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 6400
  { l: 19, w: 19, h: 19, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 6859
  { l: 24, w: 18, h: 18, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 7776
  { l: 20, w: 20, h: 20, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 8000
  
  // Art boxes continued
  { l: 32, w: 6, h: 42, tag: "art", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 },             // 8064
  { l: 35.75, w: 5.5, h: 45.25, tag: "art", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 },    // 8909
  
  { l: 24, w: 24, h: 16, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 9216
  { l: 24, w: 20, h: 20, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 9600
  
  // Specialty long/odd boxes
  { l: 15, w: 15, h: 48, tag: "specialty", burst: 275, wall: "single", maxWeight: 65, sizeSum: 95 },      // 10800 (golf)
  { l: 46, w: 20, h: 12, tag: "specialty", burst: 275, wall: "single", maxWeight: 65, sizeSum: 95 },      // 11040 (guitar)
  
  { l: 30, w: 20, h: 20, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 12000
  
  { l: 54, w: 8.5, h: 29, tag: "specialty", burst: 275, wall: "single", maxWeight: 65, sizeSum: 95 },     // 13311 (bike)
  
  { l: 24, w: 24, h: 24, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },        // 13824
  
  // Wardrobe boxes (not for small-parcel calc unless explicitly enabled)
  { l: 36, w: 24, h: 21, tag: "wardrobe", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 },       // 18144 (S. Ward)
  { l: 45, w: 24, h: 20, tag: "wardrobe", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 },       // 21600 (Ward)
  
  { l: 30, w: 30, h: 30, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 }         // 27000
];

// Non-box packaging (keep separate; not used for box recommendation)
export const mailers = {
  bubble: [
    { name: "#000", l: 4, w: 8 },
    { name: "#0", l: 6, w: 10 },
    { name: "#1", l: 7.25, w: 12 },
    { name: "#2", l: 8.5, w: 12 },
    { name: "#3", l: 8.5, w: 14.5 },
    { name: "#4", l: 9.5, w: 14.5 },
    { name: "#5", l: 10.5, w: 16 },
    { name: "#6", l: 12.5, w: 19 },
    { name: "#7", l: 14.25, w: 20 }
  ],
  triangular: [
    { l: 2, w: 18 }, { l: 2, w: 24 }, { l: 2, w: 30 },
    { l: 3, w: 36 }, { l: 3, w: 48 }
  ]
};

export interface PackingRequirements {
  minPadding: number;
  weightMultiplier: number;
  description: string;
}

export const packingTypes: Record<string, PackingRequirements> = {
  basic: {
    minPadding: 1,
    weightMultiplier: 1.0,
    description: '+1 inch per side - Minimal protection'
  },
  standard: {
    minPadding: 2,
    weightMultiplier: 1.0,
    description: '+2 inches per side - Standard protection'
  },
  fragile: {
    minPadding: 4,
    weightMultiplier: 1.0,
    description: '+4 inches per side - Extra protection'
  },
  custom: {
    minPadding: 2,
    weightMultiplier: 1.0,
    description: 'User-defined buffer - Custom protection'
  }
};