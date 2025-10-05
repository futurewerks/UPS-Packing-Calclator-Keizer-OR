import { boxes as boxDatabase, packingTypes } from '../boxDatabase';
import { 
  Box, 
  ItemData, 
  BoxRecommendation, 
  RejectedBox,
  TELESCOPING_WEIGHT_MULTIPLIER,
  BOX_TYPE_CONFIG,
  BoxTag
} from '../types';

// Configurable telescoping overlap by box type
function getTelescopingOverlap(box: Box): number {
  const boxTag = box.tag as BoxTag;
  return BOX_TYPE_CONFIG[boxTag]?.telescopingOverlap || 4; // Default fallback
}

function getBuffer(packingType: string, customBuffer?: number): number {
  if (packingType === 'custom' && customBuffer !== undefined) {
    return customBuffer;
  }
  return packingTypes[packingType as keyof typeof packingTypes]?.buffer ?? 2;
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

function getBoxRejectionReason(requiredL: number, requiredW: number, requiredH: number, box: Box, weight?: number): string {
  const reasons: string[] = [];
  
  // Check dimensional shortfalls
  const orientations = [
    { dims: [requiredL, requiredW, requiredH], labels: ['L', 'W', 'H'] },
    { dims: [requiredL, requiredH, requiredW], labels: ['L', 'H', 'W'] },
    { dims: [requiredW, requiredL, requiredH], labels: ['W', 'L', 'H'] },
    { dims: [requiredW, requiredH, requiredL], labels: ['W', 'H', 'L'] },
    { dims: [requiredH, requiredL, requiredW], labels: ['H', 'L', 'W'] },
    { dims: [requiredH, requiredW, requiredL], labels: ['H', 'W', 'L'] }
  ];
  
  // Find the orientation with the smallest shortfall
  let minShortfall = Infinity;
  let bestReason = '';
  
  orientations.forEach(({ dims, labels }) => {
    const [reqL, reqW, reqH] = dims;
    const shortfalls: string[] = [];
    let totalShortfall = 0;
    
    if (reqL > box.l) {
      const shortage = reqL - box.l;
      shortfalls.push(`length short by ${shortage.toFixed(1)}"`);
      totalShortfall += shortage;
    }
    if (reqW > box.w) {
      const shortage = reqW - box.w;
      shortfalls.push(`width short by ${shortage.toFixed(1)}"`);
      totalShortfall += shortage;
    }
    if (reqH > box.h) {
      const shortage = reqH - box.h;
      shortfalls.push(`height short by ${shortage.toFixed(1)}"`);
      totalShortfall += shortage;
    }
    
    if (shortfalls.length > 0 && totalShortfall < minShortfall) {
      minShortfall = totalShortfall;
      bestReason = shortfalls.join(', ');
    }
  });
  
  if (bestReason) reasons.push(bestReason);
  
  // Check weight constraint
  if (weight && box.maxWeight && weight > box.maxWeight) {
    const overage = weight - box.maxWeight;
    reasons.push(`weight over by ${overage.toFixed(1)} lbs`);
  }
  
  return reasons.length > 0 ? reasons.join(' & ') : 'dimensions or weight constraint';
}

function findSingleBox(
  requiredL: number, 
  requiredW: number, 
  requiredH: number, 
  weight?: number
): Box | null {
  const candidates = boxDatabase.filter(box => {
    const fitsSize = tryBoxFit(requiredL, requiredW, requiredH, box);
    const fitsWeight = !weight || !box.maxWeight || weight <= box.maxWeight;
    return fitsSize && fitsWeight;
  });

  if (candidates.length === 0) return null;

  // Sort by efficiency (least waste), with preference for regular boxes
  candidates.sort((a, b) => {
    // First priority: Prefer regular boxes over specialty boxes for general use
    if (a.tag === 'regular' && b.tag !== 'regular') return -1;
    if (b.tag === 'regular' && a.tag !== 'regular') return 1;
    
    // Second priority: Sort by least waste (volume efficiency)
    const wasteA = (a.l * a.w * a.h) - (requiredL * requiredW * requiredH);
    const wasteB = (b.l * b.w * b.h) - (requiredL * requiredW * requiredH);
    if (Math.abs(wasteA - wasteB) > 50) { // Only use volume if difference is significant
      return wasteA - wasteB;
    }
    
    // Third priority: Tighter height fit (safer for stacking/handling)
    const heightWasteA = a.h - requiredH;
    const heightWasteB = b.h - requiredH;
    if (Math.abs(heightWasteA - heightWasteB) > 1) {
      return heightWasteA - heightWasteB;
    }
    
    // Fourth priority: Closest to longest dimension (better fit)
    const maxRequired = Math.max(requiredL, requiredW, requiredH);
    const maxDiffA = Math.abs(Math.max(a.l, a.w, a.h) - maxRequired);
    const maxDiffB = Math.abs(Math.max(b.l, b.w, b.h) - maxRequired);
    return maxDiffA - maxDiffB;
  });

  return candidates[0];
}

function findTelescopingBox(
  requiredL: number, 
  requiredW: number, 
  requiredH: number, 
  weight?: number,
  includeSpecialty: boolean = true,
  includeWardrobe: boolean = true
): BoxRecommendation['telescopedBox'] | null {
  // Filter available boxes based on preferences
  const availableBoxes = boxDatabase.filter(box => {
    if (box.tag === 'specialty' && !includeSpecialty) return false;
    if (box.tag === 'wardrobe' && !includeWardrobe) return false;
    // Prefer regular and specialty boxes for telescoping (more reliable structure)
    return box.tag === 'regular' || box.tag === 'specialty' || (box.tag === 'wardrobe' && includeWardrobe);
  });
  
  const footprintCandidates = availableBoxes.filter(box => {
    
    const fitsFootprint = (box.l >= requiredL && box.w >= requiredW) ||
                         (box.l >= requiredW && box.w >= requiredL);
    // Conservative weight limit for telescoping safety
    const fitsWeight = !weight || !box.maxWeight || weight <= (box.maxWeight * TELESCOPING_WEIGHT_MULTIPLIER);
    return fitsFootprint && fitsWeight;
  });

  if (footprintCandidates.length === 0) return null;

  // Check which ones can provide enough combined height
  const viableCandidates = footprintCandidates
    .map(box => {
      const overlap = getTelescopingOverlap(box);
      const combinedHeight = (box.h * 2) - overlap;
      if (combinedHeight < requiredH) return null;

      // Determine if rotation is needed
      const rotated = !(box.l >= requiredL && box.w >= requiredW);
      
      return {
        box1: box,
        combinedHeight,
        combinedDimensions: `${box.l}" × ${box.w}" × ${combinedHeight}"`,
        overlap,
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
  const { 
    length, 
    width, 
    height, 
    weight, 
    packingType, 
    customBuffer
  } = data;
  const buffer = getBuffer(packingType, customBuffer);
  
  const requiredL = length + (buffer * 2);
  const requiredW = width + (buffer * 2);
  const requiredH = height + (buffer * 2);
  
  const warnings: string[] = [];
  
  // Find boxes that were too small (for educational purposes)
  const rejectedBoxes: RejectedBox[] = boxDatabase
    .filter(box => {
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
    .map(box => ({
      ...box,
      rejectionReason: getBoxRejectionReason(requiredL, requiredW, requiredH, box, weight)
    }))
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
    
    // Add box-specific weight warnings
    const boxConfig = BOX_TYPE_CONFIG[singleBox.tag as BoxTag];
    if (weight && boxConfig && weight > boxConfig.warningThreshold) {
      warnings.push(`Heavy load for ${boxConfig.displayName.toLowerCase()} box - verify structural integrity`);
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
    
    // Add weight-based safety warnings for telescoping
    if (weight && weight > (telescopedBox.box1.maxWeight || 0)) {
      warnings.push(`Heavy load (${weight} lbs) - verify structural integrity with store staff before shipping`);
    }
    if (weight && telescopedBox.box1.maxWeight && weight > (telescopedBox.box1.maxWeight * 1.2)) {
      warnings.push("Weight approaches telescoping safety limit - consider alternative packaging");
    }
    
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
  const maxTelescopingH = Math.max(...boxDatabase.map(b => (b.h * 2) - getTelescopingOverlap(b)));
  
  return {
    warnings: [],
    error: 'OVERSIZED_ITEM',
    errorDetails: {
      requiredDimensions: `${requiredL}" × ${requiredW}" × ${requiredH}"`,
      largestAvailableFootprint: `${maxAvailableL}" × ${maxAvailableW}"`,
      issue: `Item requires ${requiredL}" × ${requiredW}" footprint but largest available is ${maxAvailableL}" × ${maxAvailableW}"`
    }
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