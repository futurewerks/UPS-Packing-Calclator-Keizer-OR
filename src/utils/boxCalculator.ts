import { boxes as boxDatabase } from '../boxDatabase';
import { packingTypes } from '../boxDatabase';

interface ItemData {
  length: number;
  width: number;
  height: number;
  weight?: number;
  packingType: string;
  customBuffer?: number;
  includeSpecialty?: boolean;
  includeWardrobe?: boolean;
}

interface Box {
  l: number;
  w: number;
  h: number;
  tag: string;
  burst: number;
  wall: string;
  maxWeight?: number;
  sizeSum?: number;
}

interface BoxRecommendation {
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
  calculations?: {
    originalDimensions: string;
    bufferApplied: string;
    requiredDimensions: string;
    rejectedBoxes: Box[];
  };
}

const OVERLAP = 4; // Standard telescoping overlap in inches

function getBuffer(packingType: string, customBuffer?: number): number {
  if (packingType === 'custom' && customBuffer !== undefined) {
    return customBuffer;
  }
  return packingTypes[packingType as keyof typeof packingTypes]?.buffer || 2;
}

function tryBoxFit(itemL: number, itemW: number, itemH: number, box: Box): boolean {
  // Try all possible orientations of the item in the box
  const orientations = [
    [itemL, itemW, itemH],
    [itemL, itemH, itemW],
    [itemW, itemL, itemH],
    [itemW, itemH, itemL],
    [itemH, itemL, itemW],
    [itemH, itemW, itemL]
  ];
  
  return orientations.some(([l, w, h]) => 
    l <= box.l && w <= box.w && h <= box.h
  );
}

function findSingleBox(requiredL: number, requiredW: number, requiredH: number, weight?: number): Box | null {
  // Filter boxes based on type preferences - include all by default
  let availableBoxes = boxDatabase;
  
  // For now, include all box types in recommendations
  // Future enhancement: could add toggles for specialty/wardrobe boxes
  
  const candidates = availableBoxes.filter(box => {
    const fitsSize = tryBoxFit(requiredL, requiredW, requiredH, box);
    const fitsWeight = !weight || !box.maxWeight || weight <= box.maxWeight;
    return fitsSize && fitsWeight;
  });

  if (candidates.length === 0) return null;

  // Sort by efficiency (least waste), with preference for regular boxes
  candidates.sort((a, b) => {
    // Prefer regular boxes over specialty boxes for general use
    if (a.tag === 'regular' && b.tag !== 'regular') return -1;
    if (b.tag === 'regular' && a.tag !== 'regular') return 1;
    
    // Then sort by least waste
    const wasteA = (a.l * a.w * a.h) - (requiredL * requiredW * requiredH);
    const wasteB = (b.l * b.w * b.h) - (requiredL * requiredW * requiredH);
    return wasteA - wasteB;
  });

  return candidates[0];
}

function findTelescopingBox(requiredL: number, requiredW: number, requiredH: number, weight?: number): BoxRecommendation['telescopedBox'] | null {
  // Find boxes that can accommodate the footprint - prioritize regular boxes for telescoping
  const footprintCandidates = boxDatabase.filter(box => {
    // Prefer regular boxes for telescoping (more reliable structure)
    if (box.tag !== 'regular' && box.tag !== 'specialty') return false;
    
    const fitsFootprint = (box.l >= requiredL && box.w >= requiredW) ||
                         (box.l >= requiredW && box.w >= requiredL);
    const fitsWeight = !weight || !box.maxWeight || weight <= (box.maxWeight * 2); // Two boxes
    return fitsFootprint && fitsWeight;
  });

  if (footprintCandidates.length === 0) return null;

  // Check which ones can provide enough combined height
  const viableCandidates = footprintCandidates
    .map(box => {
      const combinedHeight = (box.h * 2) - OVERLAP;
      if (combinedHeight < requiredH) return null;

      // Determine if rotation is needed
      const rotated = !(box.l >= requiredL && box.w >= requiredW);
      
      return {
        box1: box,
        combinedHeight,
        combinedDimensions: `${box.l}" × ${box.w}" × ${combinedHeight}"`,
        overlap: OVERLAP,
        rotated
      };
    })
    .filter(Boolean) as NonNullable<BoxRecommendation['telescopedBox']>[];

  if (viableCandidates.length === 0) return null;

  // Sort by smallest footprint, then by efficiency
  viableCandidates.sort((a, b) => {
    const footprintA = a.box1.l * a.box1.w;
    const footprintB = b.box1.l * b.box1.w;
    if (footprintA !== footprintB) return footprintA - footprintB;
    
    // If footprints are equal, prefer less waste
    const wasteA = a.combinedHeight - requiredH;
    const wasteB = b.combinedHeight - requiredH;
    return wasteA - wasteB;
  });

  return viableCandidates[0];
}

export function findBestBox(data: ItemData): BoxRecommendation {
  const { length, width, height, weight, packingType, customBuffer } = data;
  const buffer = getBuffer(packingType, customBuffer);
  
  const requiredL = length + (buffer * 2);
  const requiredW = width + (buffer * 2);
  const requiredH = height + (buffer * 2);
  
  const warnings: string[] = [];
  
  // Find boxes that were too small (for educational purposes)
  const rejectedBoxes = boxDatabase
    .filter(box => {
      // Include all box types in rejected analysis for educational purposes
      // Only show boxes that don't fit and are reasonably close in size
      const fitsSize = tryBoxFit(requiredL, requiredW, requiredH, box);
      const fitsWeight = !weight || !box.maxWeight || weight <= box.maxWeight;
      
      if (fitsSize && fitsWeight) return false; // This box works, don't show as rejected
      
      // Show as rejected if it's close in size (within 4 inches in any dimension)
      const maxBoxDim = Math.max(box.l, box.w, box.h);
      const maxRequiredDim = Math.max(requiredL, requiredW, requiredH);
      const minBoxDim = Math.min(box.l, box.w, box.h);
      const minRequiredDim = Math.min(requiredL, requiredW, requiredH);
      
      return (Math.abs(maxBoxDim - maxRequiredDim) <= 4) || 
             (Math.abs(minBoxDim - minRequiredDim) <= 4);
    })
    .sort((a, b) => {
      // Sort by box type preference first, then by size difference
      if (a.tag === 'regular' && b.tag !== 'regular') return -1;
      if (b.tag === 'regular' && a.tag !== 'regular') return 1;
      
      // Sort by how close they are (largest dimension difference)
      const maxReq = Math.max(requiredL, requiredW, requiredH);
      const diffA = Math.abs(Math.max(a.l, a.w, a.h) - maxReq);
      const diffB = Math.abs(Math.max(b.l, b.w, b.h) - maxReq);
      return diffA - diffB;
    })
    .slice(0, 5); // Show up to 5 rejected boxes from expanded inventory
  
  // Try single box first
  const singleBox = findSingleBox(requiredL, requiredW, requiredH, weight);
  if (singleBox) {
    // Add warnings based on item characteristics
    if (weight && weight > 50) {
      warnings.push("Heavy item - ensure proper handling during shipping");
    }
    if (packingType === 'fragile') {
      warnings.push("Consider double-boxing for extra protection");
    }
    
    // Add box-type specific warnings
    if (singleBox.tag === 'specialty') {
      warnings.push("Using specialty box - verify dimensions with store staff");
    }
    if (singleBox.tag === 'wardrobe') {
      warnings.push("Large wardrobe box - may require special handling");
    }
    if (singleBox.tag === 'art') {
      warnings.push("Art box - ideal for flat items and artwork");
    }
    
    return { 
      box: singleBox, 
      warnings,
      calculations: {
        originalDimensions: `${length}" × ${width}" × ${height}"`,
        bufferApplied: `+${buffer}" per side`,
        requiredDimensions: `${requiredL}" × ${requiredW}" × ${requiredH}"`,
        rejectedBoxes
      }
    };
  }
  
  // Try telescoping
  const telescopedBox = findTelescopingBox(requiredL, requiredW, requiredH, weight);
  if (telescopedBox) {
    warnings.push("Telescoping required - use heavy-duty packing tape on all joints");
    warnings.push("Reinforce the telescoped seam with extra tape for structural integrity");
    
    return { 
      telescopedBox, 
      warnings,
      calculations: {
        originalDimensions: `${length}" × ${width}" × ${height}"`,
        bufferApplied: `+${buffer}" per side`,
        requiredDimensions: `${requiredL}" × ${requiredW}" × ${requiredH}"`,
        rejectedBoxes
      }
    };
  }
  
  // No solution found - provide detailed error
  const maxAvailableL = Math.max(...boxDatabase.map(b => b.l));
  const maxAvailableW = Math.max(...boxDatabase.map(b => b.w));
  const maxAvailableH = Math.max(...boxDatabase.map(b => b.h));
  const maxTelescopingH = Math.max(...boxDatabase.map(b => (b.h * 2) - OVERLAP));
  
  return {
    warnings: [],
    error: `Item dimensions exceed available box capacities.\n\nRequired: ${requiredL}" × ${requiredW}" × ${requiredH}"\nLargest available footprint: ${maxAvailableL}" × ${maxAvailableW}"\nMax single box height: ${maxAvailableH}"\nMax telescoping height: ${maxTelescopingH}"`
  };
}

export function formatBoxSize(box: Box): string {
  return `${box.l}" × ${box.w}" × ${box.h}"`;
}

export function getBoxDescription(box: Box): string {
  let description = '';
  
  // Add box type description
  switch (box.tag) {
    case 'regular':
      description = 'Regular box - ';
      break;
    case 'specialty':
      description = 'Specialty box - ';
      break;
    case 'wardrobe':
      description = 'Wardrobe box - ';
      break;
    case 'art':
      description = 'Art box - ';
      break;
    default:
      description = '';
  }
  
  description += `${box.burst} PSI burst strength, ${box.wall} wall`;
  
  if (box.maxWeight) {
    description += `, max ${box.maxWeight} lbs`;
  }
  
  return description;
}