// UPS Store Box Database - TUPSS 5374 Keizer, OR
import { Box, PackingRequirements } from './types';

// Box inventory sorted by volume ascending
export const boxes: Box[] = [
  // Regular corrugated boxes (sorted by volume)
  { l: 6, w: 6, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },            // 216
  { l: 8, w: 5, h: 3, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },            // 120
  { l: 10, w: 6, h: 4, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },           // 240
  { l: 12, w: 9, h: 3, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },           // 324
  { l: 12, w: 9, h: 4, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },           // 432
  { l: 8, w: 8, h: 8, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },            // 512
  { l: 6, w: 6, h: 48, tag: "specialty", burst: 275, wall: "single", maxWeight: 65, sizeSum: 95 },         // 1728
  { l: 15, w: 11, h: 3, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 495
  { l: 12, w: 9, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },           // 648
  { l: 12, w: 12, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 864
  { l: 12, w: 12, h: 9, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 1296
  { l: 10, w: 10, h: 10, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 1000
  { l: 14, w: 14, h: 14, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 2744
  { l: 15, w: 12, h: 4, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 720
  { l: 15, w: 12, h: 10, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 1800
  { l: 15, w: 15, h: 48, tag: "specialty", burst: 275, wall: "single", maxWeight: 65, sizeSum: 95 },       // 10800
  { l: 16, w: 10, h: 4, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 640
  { l: 16, w: 12, h: 4, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 768
  { l: 16, w: 16, h: 4, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 1024
  { l: 16, w: 16, h: 10, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 2560
  { l: 16, w: 16, h: 16, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 4096
  { l: 17, w: 11, h: 8, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 1496
  { l: 17, w: 13, h: 13, tag: "moving", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 2873 (Moving S)
  { l: 18, w: 12, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 2592
  { l: 18, w: 18, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 3888
  { l: 18, w: 18, h: 16, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 5184
  { l: 18, w: 18, h: 17, tag: "moving", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 5508 (Moving M)
  { l: 18, w: 18, h: 18, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 5832
  { l: 18, w: 18, h: 24, tag: "moving", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 7776 (Moving L)
  { l: 18, w: 18, h: 28, tag: "dishpak", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 },         // 9072 (DishPak)
  { l: 20, w: 14, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 1680
  { l: 20, w: 15, h: 15, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 4500
  { l: 20, w: 20, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 4800
  { l: 20, w: 20, h: 20, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 8000
  { l: 22, w: 22, h: 22, tag: "moving", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 10648 (Moving XL)
  { l: 24, w: 8, h: 8, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },           // 1536
  { l: 24, w: 12, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 3456
  { l: 24, w: 12, h: 18, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 5184
  { l: 24, w: 14, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 4032
  { l: 24, w: 14, h: 16, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 5376
  { l: 24, w: 18, h: 18, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 7776
  { l: 24, w: 18, h: 21, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 9072
  { l: 24, w: 18, h: 24, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 10368
  { l: 24, w: 24, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 6912
  { l: 24, w: 24, h: 16, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 9216
  { l: 24, w: 24, h: 18, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 10368
  { l: 24, w: 24, h: 24, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 13824
  { l: 30, w: 20, h: 6, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },          // 3600
  { l: 30, w: 20, h: 10, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 6000
  { l: 30, w: 20, h: 12, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 7200
  { l: 30, w: 20, h: 15, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 9000
  { l: 30, w: 20, h: 18, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 10800
  { l: 30, w: 24, h: 36, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 25920
  { l: 36, w: 21, h: 20, tag: "regular", burst: 200, wall: "single", maxWeight: 40, sizeSum: 75 },         // 15120

  // Art boxes
  { l: 23, w: 15, h: 27, tag: "art", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 },             // 9315
  { l: 28, w: 35, h: 38, tag: "art", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 },             // 37240
  { l: 30, w: 6, h: 42, tag: "art", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 },              // 7560
  { l: 36, w: 35, h: 45, tag: "art", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 },             // 56700

  // Specialty boxes
  { l: 46, w: 20, h: 12, tag: "specialty", burst: 275, wall: "single", maxWeight: 65, sizeSum: 95 },       // 11040 (Guitar)
  { l: 54, w: 8, h: 25.99, tag: "specialty", burst: 275, wall: "single", maxWeight: 65, sizeSum: 95 },     // 11227 (Bike)

  // Wardrobe boxes
  { l: 36, w: 24, h: 21, tag: "wardrobe", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 },        // 18144 (Wardrobe)
  { l: 45, w: 24, h: 20, tag: "wardrobe", burst: 200, wall: "single", maxWeight: 40, sizeSum: 95 }         // 21600 (Wardrobe)
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

export const packingTypes: Record<string, PackingRequirements> = {
  basic: {
    buffer: 0,
    weightMultiplier: 1.0,
    description: '+0 inches per side - Minimal protection'
  },
  standard: {
    buffer: 1,
    weightMultiplier: 1.0,
    description: '+1 inch per side - Standard protection'
  },
  fragile: {
    buffer: 2,
    weightMultiplier: 1.0,
    description: '+2 inches per side - Extra protection'
  },
  custom: {
    buffer: 2,
    weightMultiplier: 1.0,
    description: 'User-defined buffer - Custom protection'
  }
};