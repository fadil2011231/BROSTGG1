import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Grid,
  Layers,
  Download,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Sliders,
  Eye,
  Info,
  ChevronRight,
  Maximize2,
  Trash2,
} from 'lucide-react';

interface PixelArtGeneratorProps {
  onNotify?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export type ResolutionOption = 32 | 64 | 128;

export interface MinecraftBlock {
  id: string;
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
  category: 'stone' | 'wood' | 'wool' | 'concrete' | 'nature' | 'ore' | 'nether';
}

// 22 Predefined classic Minecraft blocks for accurate color matching
export const MINECRAFT_BLOCK_PALETTE: MinecraftBlock[] = [
  // Wool & Concrete Basics
  { id: 'white_concrete', name: 'White Concrete', hex: '#EAEAEB', r: 234, g: 234, b: 235, category: 'concrete' },
  { id: 'light_gray_concrete', name: 'Light Gray Concrete', hex: '#7D7D73', r: 125, g: 125, b: 115, category: 'concrete' },
  { id: 'gray_concrete', name: 'Gray Concrete', hex: '#36393D', r: 54, g: 57, b: 61, category: 'concrete' },
  { id: 'black_concrete', name: 'Black Concrete', hex: '#080A0F', r: 8, g: 10, b: 15, category: 'concrete' },
  { id: 'brown_concrete', name: 'Brown Concrete', hex: '#603B1F', r: 96, g: 59, b: 31, category: 'concrete' },
  { id: 'red_concrete', name: 'Red Concrete', hex: '#8E2020', r: 142, g: 32, b: 32, category: 'concrete' },
  { id: 'orange_concrete', name: 'Orange Concrete', hex: '#E06100', r: 224, g: 97, b: 0, category: 'concrete' },
  { id: 'yellow_concrete', name: 'Yellow Concrete', hex: '#F1AF15', r: 241, g: 175, b: 21, category: 'concrete' },
  { id: 'lime_concrete', name: 'Lime Concrete', hex: '#5EA918', r: 94, g: 169, b: 24, category: 'concrete' },
  { id: 'green_concrete', name: 'Green Concrete', hex: '#495B24', r: 73, g: 91, b: 36, category: 'concrete' },
  { id: 'cyan_concrete', name: 'Cyan Concrete', hex: '#157788', r: 21, g: 119, b: 136, category: 'concrete' },
  { id: 'light_blue_concrete', name: 'Light Blue Concrete', hex: '#2389C7', r: 35, g: 137, b: 199, category: 'concrete' },
  { id: 'blue_concrete', name: 'Blue Concrete', hex: '#2C2E8F', r: 44, g: 46, b: 143, category: 'concrete' },
  { id: 'purple_concrete', name: 'Purple Concrete', hex: '#641F9C', r: 100, g: 31, b: 156, category: 'concrete' },
  { id: 'magenta_concrete', name: 'Magenta Concrete', hex: '#A9309F', r: 169, g: 48, b: 159, category: 'concrete' },
  { id: 'pink_concrete', name: 'Pink Concrete', hex: '#D5658E', r: 213, g: 101, b: 142, category: 'concrete' },

  // Woods & Natural Terrains
  { id: 'oak_planks', name: 'Oak Planks', hex: '#A2824E', r: 162, g: 130, b: 78, category: 'wood' },
  { id: 'dark_oak_planks', name: 'Dark Oak Planks', hex: '#3C2712', r: 60, g: 39, b: 18, category: 'wood' },
  { id: 'stone', name: 'Stone', hex: '#7D7D7D', r: 125, g: 125, b: 125, category: 'stone' },
  { id: 'deepslate', name: 'Deepslate', hex: '#39393E', r: 57, g: 57, b: 62, category: 'stone' },
  { id: 'grass_block', name: 'Grass Block', hex: '#5B7C28', r: 91, g: 124, b: 40, category: 'nature' },
  { id: 'gold_block', name: 'Gold Block', hex: '#F6D03D', r: 246, g: 208, b: 61, category: 'ore' },
  { id: 'diamond_block', name: 'Diamond Block', hex: '#5CE7D7', r: 92, g: 231, b: 215, category: 'ore' },
  { id: 'netherrack', name: 'Netherrack', hex: '#682424', r: 104, g: 36, b: 36, category: 'nether' },
  { id: 'obsidian', name: 'Obsidian', hex: '#100C1C', r: 16, g: 12, b: 28, category: 'stone' },
];

export interface MaterialCount {
  block: MinecraftBlock;
  count: number;
  percentage: number;
  stacks: number;
  remainder: number;
}

export interface CellData {
  block: MinecraftBlock | null; // null represents transparent / air
  x: number;
  y: number;
}

// Preset samples for fast testing without needing to find an image
interface PresetSample {
  id: string;
  name: string;
  category: string;
  generateCanvas: () => string; // returns base64 data url
}

// Helper to draw clean pixelated icon presets
function createPresetDataUrl(type: 'creeper' | 'pickaxe' | 'golden_apple' | 'redstone'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  if (type === 'creeper') {
    // Fill Green gradient
    ctx.fillStyle = '#49a826';
    ctx.fillRect(0, 0, 16, 16);
    // Dark green blotches
    ctx.fillStyle = '#2f7514';
    ctx.fillRect(1, 1, 2, 2);
    ctx.fillRect(13, 2, 2, 2);
    ctx.fillRect(2, 13, 2, 2);
    ctx.fillRect(12, 12, 2, 2);
    ctx.fillStyle = '#65d137';
    ctx.fillRect(5, 1, 3, 2);
    ctx.fillRect(9, 13, 3, 2);

    // Creeper Face Black
    ctx.fillStyle = '#080a0f';
    // Eyes
    ctx.fillRect(3, 4, 3, 3);
    ctx.fillRect(10, 4, 3, 3);
    // Nose bridge
    ctx.fillRect(6, 7, 4, 4);
    // Mouth branches
    ctx.fillRect(4, 9, 2, 5);
    ctx.fillRect(10, 9, 2, 5);
  } else if (type === 'pickaxe') {
    // Transparent BG
    ctx.clearRect(0, 0, 16, 16);
    // Diamond Pickaxe head
    ctx.fillStyle = '#5ce7d7';
    ctx.fillRect(6, 2, 8, 2);
    ctx.fillRect(13, 4, 2, 4);
    ctx.fillRect(4, 3, 3, 2);
    ctx.fillRect(3, 4, 2, 3);
    // Inner cyan
    ctx.fillStyle = '#229e92';
    ctx.fillRect(7, 4, 3, 2);
    // Handle sticks
    ctx.fillStyle = '#7a5a30';
    ctx.fillRect(9, 6, 2, 2);
    ctx.fillRect(7, 8, 2, 2);
    ctx.fillRect(5, 10, 2, 2);
    ctx.fillRect(3, 12, 2, 2);
    ctx.fillRect(1, 14, 2, 2);
  } else if (type === 'golden_apple') {
    ctx.clearRect(0, 0, 16, 16);
    // Apple leaf
    ctx.fillStyle = '#495b24';
    ctx.fillRect(8, 2, 2, 2);
    ctx.fillRect(9, 1, 3, 2);
    // Stem
    ctx.fillStyle = '#603b1f';
    ctx.fillRect(7, 3, 2, 2);
    // Gold body
    ctx.fillStyle = '#f6d03d';
    ctx.fillRect(4, 5, 8, 8);
    ctx.fillRect(3, 6, 10, 6);
    ctx.fillRect(5, 4, 6, 10);
    // Highlights
    ctx.fillStyle = '#fffa9e';
    ctx.fillRect(5, 6, 2, 2);
    ctx.fillRect(5, 8, 1, 2);
    // Shading
    ctx.fillStyle = '#e08500';
    ctx.fillRect(4, 12, 8, 1);
    ctx.fillRect(11, 7, 2, 4);
  } else {
    // Redstone Lamp / Core
    ctx.fillStyle = '#603b1f';
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = '#f1af15';
    ctx.fillRect(3, 3, 10, 10);
    ctx.fillStyle = '#fffa9e';
    ctx.fillRect(5, 5, 6, 6);
    ctx.fillStyle = '#e06100';
    ctx.fillRect(4, 4, 1, 8);
    ctx.fillRect(11, 4, 1, 8);
  }

  return canvas.toDataURL('image/png');
}

const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'creeper',
    name: 'Creeper Face',
    category: 'Mob Icon',
    generateCanvas: () => createPresetDataUrl('creeper'),
  },
  {
    id: 'pickaxe',
    name: 'Diamond Pickaxe',
    category: 'Tools & Weapons',
    generateCanvas: () => createPresetDataUrl('pickaxe'),
  },
  {
    id: 'golden_apple',
    name: 'Golden Apple',
    category: 'Treasures',
    generateCanvas: () => createPresetDataUrl('golden_apple'),
  },
  {
    id: 'redstone',
    name: 'Redstone Lamp',
    category: 'Mechanics',
    generateCanvas: () => createPresetDataUrl('redstone'),
  },
];

export default function PixelArtGenerator({ onNotify }: PixelArtGeneratorProps) {
  // State: Uploaded Image & Processing Configuration
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [sourceDataUrl, setSourceDataUrl] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [resolution, setResolution] = useState<ResolutionOption>(32);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const [ignoreTransparency, setIgnoreTransparency] = useState<boolean>(true);
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dithering, setDithering] = useState<boolean>(false);

  // Search filter for materials list
  const [materialFilter, setMaterialFilter] = useState<string>('');
  const [copiedMaterials, setCopiedMaterials] = useState<boolean>(false);

  // Generated Output State
  const [gridData, setGridData] = useState<CellData[][] | null>(null);
  const [materialCounts, setMaterialCounts] = useState<MaterialCount[]>([]);
  const [totalPlacedBlocks, setTotalPlacedBlocks] = useState<number>(0);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number; block: MinecraftBlock | null } | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const interactiveCanvasRef = useRef<HTMLCanvasElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Default initial load: Preload Creeper Face so the UI is immediately alive
  useEffect(() => {
    const initialPreset = PRESET_SAMPLES[0];
    const dataUrl = initialPreset.generateCanvas();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setSourceImage(img);
      setSourceDataUrl(dataUrl);
      setImageFileName('creeper-face-sample.png');
    };
    img.src = dataUrl;
  }, []);

  // Perceptual Euclidean Color Distance calculation
  // Uses standard human eye sensitivity weights: 2*r^2 + 4*g^2 + 3*b^2
  const findClosestBlock = useCallback((r: number, g: number, b: number): MinecraftBlock => {
    let closestBlock = MINECRAFT_BLOCK_PALETTE[0];
    let minDistance = Infinity;

    for (let i = 0; i < MINECRAFT_BLOCK_PALETTE.length; i++) {
      const candidate = MINECRAFT_BLOCK_PALETTE[i];
      const dr = r - candidate.r;
      const dg = g - candidate.g;
      const db = b - candidate.b;
      // Weighted Euclidean distance
      const distance = 2 * dr * dr + 4 * dg * dg + 3 * db * db;

      if (distance < minDistance) {
        minDistance = distance;
        closestBlock = candidate;
      }
    }

    return closestBlock;
  }, []);

  // Generate Blueprint Function
  const processImageToBlueprint = useCallback(() => {
    if (!sourceImage) {
      if (onNotify) onNotify('Please upload an image first!', 'info');
      return;
    }

    setIsProcessing(true);

    // Use requestAnimationFrame / setTimeout to allow UI spinner to show smoothly
    setTimeout(() => {
      try {
        const targetW = resolution;
        const targetH = resolution;

        // Create an offscreen canvas for resizing
        const offCanvas = document.createElement('canvas');
        offCanvas.width = targetW;
        offCanvas.height = targetH;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

        if (!offCtx) {
          setIsProcessing(false);
          return;
        }

        offCtx.imageSmoothingEnabled = false;

        let drawX = 0;
        let drawY = 0;
        let drawW: number = targetW;
        let drawH: number = targetH;

        if (keepAspectRatio) {
          const imgAspect = sourceImage.width / sourceImage.height;
          const targetAspect = targetW / targetH;

          if (imgAspect > targetAspect) {
            drawW = targetW;
            drawH = Math.round(targetW / imgAspect);
            drawY = Math.round((targetH - drawH) / 2);
          } else {
            drawH = targetH;
            drawW = Math.round(targetH * imgAspect);
            drawX = Math.round((targetW - drawW) / 2);
          }
        }

        // Fill background with transparent or black
        offCtx.clearRect(0, 0, targetW, targetH);
        offCtx.drawImage(sourceImage, drawX, drawY, drawW, drawH);

        const imgData = offCtx.getImageData(0, 0, targetW, targetH);
        const pixels = imgData.data;

        const newGrid: CellData[][] = [];
        const countsMap: Record<string, { block: MinecraftBlock; count: number }> = {};
        let totalCount = 0;

        // Working buffer if dithering is applied
        const floatPixels = new Float32Array(pixels.length);
        for (let i = 0; i < pixels.length; i++) {
          floatPixels[i] = pixels[i];
        }

        for (let y = 0; y < targetH; y++) {
          const row: CellData[] = [];
          for (let x = 0; x < targetW; x++) {
            const idx = (y * targetW + x) * 4;
            const r = Math.max(0, Math.min(255, floatPixels[idx]));
            const g = Math.max(0, Math.min(255, floatPixels[idx + 1]));
            const b = Math.max(0, Math.min(255, floatPixels[idx + 2]));
            const a = floatPixels[idx + 3];

            // If transparent and ignoreTransparency is active, mark as air / null
            if (ignoreTransparency && a < 50) {
              row.push({ block: null, x, y });
              continue;
            }

            // Find closest Minecraft block
            const matchedBlock = findClosestBlock(r, g, b);
            row.push({ block: matchedBlock, x, y });

            // Accumulate Material Counts
            if (!countsMap[matchedBlock.id]) {
              countsMap[matchedBlock.id] = { block: matchedBlock, count: 0 };
            }
            countsMap[matchedBlock.id].count += 1;
            totalCount += 1;

            // Optional Floyd-Steinberg Dithering error diffusion
            if (dithering) {
              const errR = r - matchedBlock.r;
              const errG = g - matchedBlock.g;
              const errB = b - matchedBlock.b;

              const diffuse = (dx: number, dy: number, factor: number) => {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < targetW && ny >= 0 && ny < targetH) {
                  const nIdx = (ny * targetW + nx) * 4;
                  floatPixels[nIdx] += (errR * factor) / 16;
                  floatPixels[nIdx + 1] += (errG * factor) / 16;
                  floatPixels[nIdx + 2] += (errB * factor) / 16;
                }
              };

              diffuse(1, 0, 7);
              diffuse(-1, 1, 3);
              diffuse(0, 1, 5);
              diffuse(1, 1, 1);
            }
          }
          newGrid.push(row);
        }

        // Format materials list sorted descending
        const materialsList: MaterialCount[] = Object.values(countsMap)
          .map(({ block, count }) => {
            const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
            const stacks = Math.floor(count / 64);
            const remainder = count % 64;
            return {
              block,
              count,
              percentage,
              stacks,
              remainder,
            };
          })
          .sort((a, b) => b.count - a.count);

        setGridData(newGrid);
        setMaterialCounts(materialsList);
        setTotalPlacedBlocks(totalCount);
        setIsProcessing(false);

        if (onNotify) {
          onNotify(
            `Blueprint Generated! ${totalCount.toLocaleString()} Minecraft blocks matched across ${materialsList.length} types.`,
            'success'
          );
        }
      } catch (err) {
        console.error('Error generating pixel blueprint:', err);
        setIsProcessing(false);
        if (onNotify) onNotify('Failed to process image into blueprint.', 'error');
      }
    }, 60);
  }, [sourceImage, resolution, keepAspectRatio, ignoreTransparency, dithering, findClosestBlock, onNotify]);

  // Trigger processing whenever sourceImage or resolution changes
  useEffect(() => {
    if (sourceImage) {
      processImageToBlueprint();
    }
  }, [sourceImage, resolution, keepAspectRatio, ignoreTransparency, dithering]);

  // Render Blueprint to Interactive Canvas
  useEffect(() => {
    const canvas = interactiveCanvasRef.current;
    if (!canvas || !gridData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = gridData.length;
    // Base cell size on display
    const cellSize = Math.max(4, Math.floor(512 / size));
    canvas.width = size * cellSize;
    canvas.height = size * cellSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw checkerboard background for transparent cells
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const isCheck = (x + y) % 2 === 0;
        ctx.fillStyle = isCheck ? '#111418' : '#0c0f12';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    // Draw Minecraft blocks
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = gridData[y][x];
        if (cell.block) {
          ctx.fillStyle = cell.block.hex;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    // Draw Grid Overlay if enabled and cells are large enough
    if (showGridLines && cellSize >= 3) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 0.5;

      ctx.beginPath();
      for (let i = 0; i <= size; i++) {
        // Vertical lines
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, size * cellSize);
        // Horizontal lines
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(size * cellSize, i * cellSize);
      }
      ctx.stroke();

      // Chunk border lines every 16 blocks (Minecraft chunk/build boundary)
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= size; i += 16) {
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, size * cellSize);
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(size * cellSize, i * cellSize);
      }
      ctx.stroke();
    }
  }, [gridData, showGridLines]);

  // Handle Image Upload from File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(png|jpeg|jpg|webp)/i)) {
      if (onNotify) onNotify('Please upload a valid .png or .jpg image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setSourceImage(img);
        setSourceDataUrl(dataUrl);
        setImageFileName(file.name);
        if (onNotify) onNotify(`Uploaded "${file.name}" (${img.width}x${img.height}px)`, 'success');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(png|jpeg|jpg|webp)/i)) {
      if (onNotify) onNotify('Please drop a valid .png or .jpg image file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setSourceImage(img);
        setSourceDataUrl(dataUrl);
        setImageFileName(file.name);
        if (onNotify) onNotify(`Loaded "${file.name}" (${img.width}x${img.height}px)`, 'success');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Load Preset
  const handleSelectPreset = (preset: PresetSample) => {
    const dataUrl = preset.generateCanvas();
    const img = new Image();
    img.onload = () => {
      setSourceImage(img);
      setSourceDataUrl(dataUrl);
      setImageFileName(`${preset.id}-preset.png`);
      if (onNotify) onNotify(`Preset "${preset.name}" loaded!`, 'info');
    };
    img.src = dataUrl;
  };

  // Canvas Hover Mouse Move for Tooltip
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = interactiveCanvasRef.current;
    if (!canvas || !gridData) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = clientX * scaleX;
    const canvasY = clientY * scaleY;

    const size = gridData.length;
    const cellSize = canvas.width / size;

    const gridX = Math.floor(canvasX / cellSize);
    const gridY = Math.floor(canvasY / cellSize);

    if (gridX >= 0 && gridX < size && gridY >= 0 && gridY < size) {
      setHoveredCell({
        x: gridX,
        y: gridY,
        block: gridData[gridY][gridX].block,
      });
    } else {
      setHoveredCell(null);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredCell(null);
  };

  // Download Blueprint as PNG
  const handleDownloadBlueprint = () => {
    const canvas = interactiveCanvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `minecraft-blueprint-${resolution}x${resolution}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    if (onNotify) onNotify(`Downloaded high-res ${resolution}x${resolution} Blueprint PNG!`, 'success');
  };

  // Copy Material Summary List to Clipboard
  const handleCopyMaterialList = () => {
    if (materialCounts.length === 0) return;

    let text = `========================================\n`;
    text += `MINECRAFT PIXEL ART BLUEPRINT MATERIALS\n`;
    text += `Resolution: ${resolution}x${resolution} | Total Blocks: ${totalPlacedBlocks}\n`;
    text += `========================================\n\n`;

    materialCounts.forEach((m, idx) => {
      const stackText = m.stacks > 0 ? `(${m.stacks} stacks + ${m.remainder})` : `(${m.remainder} blocks)`;
      text += `${idx + 1}. [ ] ${m.block.name.padEnd(22)} : ${m.count.toString().padStart(5)} blocks ${stackText}\n`;
    });

    text += `\nGenerated via Minecraft Creator Toolkit Pixel-Art Studio`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedMaterials(true);
        setTimeout(() => setCopiedMaterials(false), 2000);
        if (onNotify) onNotify('Material shopping list copied to clipboard!', 'success');
      });
    }
  };

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    if (!materialFilter.trim()) return materialCounts;
    const query = materialFilter.toLowerCase();
    return materialCounts.filter(
      (m) => m.block.name.toLowerCase().includes(query) || m.block.id.toLowerCase().includes(query)
    );
  }, [materialCounts, materialFilter]);

  // Total stacks calculation
  const totalStacksCount = useMemo(() => {
    const totalStacks = Math.floor(totalPlacedBlocks / 64);
    const rem = totalPlacedBlocks % 64;
    return `${totalStacks} stacks${rem > 0 ? ` + ${rem}` : ''}`;
  }, [totalPlacedBlocks]);

  return (
    <section className="relative mt-20" id="pixel-blueprint">
      {/* ======================================================== */}
      {/* SECTION HEADER: MODULE // 06 & PIXEL-ART STUDIO          */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#1d2022] text-[#00f5d4] text-[11px] font-mono tracking-widest uppercase border border-cyan-500/30">
              MODULE // 06
            </span>
            <span className="text-slate-400 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <span>// PIXEL-ART STUDIO</span>
              <Sparkles className="w-3 h-3 text-[#00f5d4]" />
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight flex items-center gap-3">
            <span>IMAGE TO BLUEPRINT</span>
            <span className="hidden sm:inline-block text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/30">
              BUILD PLANNER
            </span>
          </h2>
        </div>
        <p className="text-sm text-slate-300 max-w-md font-sans">
          Convert any image or digital artwork into an authentic Minecraft block blueprint with exact material tallies, coordinates, and layer breakdowns.
        </p>
      </div>

      {/* ======================================================== */}
      {/* 2-COLUMN GRID LAYOUT                                     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Image Upload & Settings                      */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: File Upload & Preset Selection */}
          <div className="bg-[#1d2022] border border-cyan-500/20 p-6 rounded-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#00f5d4]" />
                <h3 className="font-heading font-bold text-base text-white tracking-wide">
                  SOURCE IMAGE INPUT
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">PNG, JPG, WEBP</span>
            </div>

            {/* Drag and Drop Zone */}
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group ${
                isDragging
                  ? 'border-[#00f5d4] bg-cyan-950/30 scale-[1.01]'
                  : 'border-slate-700/60 hover:border-cyan-500/50 bg-[#0c0f11]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {sourceDataUrl ? (
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-cyan-500/40 bg-black/60 shadow-inner flex items-center justify-center">
                    <img
                      src={sourceDataUrl}
                      alt="Source Preview"
                      className="max-w-full max-h-full object-contain image-rendering-pixelated"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-cyan-300 text-xs font-mono">
                      Click to Replace
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-mono text-cyan-300 font-bold truncate max-w-[240px]">
                      {imageFileName || 'custom-image.png'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {sourceImage ? `${sourceImage.width} × ${sourceImage.height} px` : ''} • Drop or Click to change
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-200 mt-1">
                    Drag &amp; drop an image here or <span className="text-[#00f5d4] underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-500">Supports transparency for clean silhouettes</p>
                </div>
              )}
            </div>

            {/* Quick Demo Presets */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00f5d4]" />
                  <span>Instant Demo Presets</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">1-Click Test</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_SAMPLES.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#0c0f11] hover:bg-[#161a1e] border border-slate-800 hover:border-cyan-500/40 transition text-left cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded bg-[#1d2022] border border-slate-700/60 p-0.5 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={preset.generateCanvas()}
                        alt={preset.name}
                        className="w-full h-full object-contain image-rendering-pixelated"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                        {preset.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{preset.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Processing & Resolution Settings */}
          <div className="bg-[#1d2022] border border-cyan-500/20 p-6 rounded-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00f5d4]" />
                <h3 className="font-heading font-bold text-base text-white tracking-wide">
                  BLUEPRINT SETTINGS
                </h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                AUTO-MAPPED
              </span>
            </div>

            {/* Resolution Selector (32x32, 64x64, 128x128) */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Grid className="w-3.5 h-3.5 text-[#00f5d4]" />
                  <span>Grid Resolution</span>
                </span>
                <span className="text-cyan-300 font-bold">{resolution} × {resolution}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([32, 64, 128] as ResolutionOption[]).map((res) => {
                  const isSelected = resolution === res;
                  const totalPixels = res * res;
                  return (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setResolution(res)}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-cyan-950/80 border-[#00f5d4] text-white shadow-glow-cyan'
                          : 'bg-[#0c0f11] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span className="font-mono font-black text-base">{res}×{res}</span>
                      <span className="text-[10px] font-mono mt-0.5 opacity-80">
                        {totalPixels >= 1000 ? `${(totalPixels / 1000).toFixed(1)}k blocks` : `${totalPixels} blocks`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio & Transparency Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0c0f11] border border-slate-800">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-200">Preserve Aspect Ratio</span>
                  <span className="text-[11px] text-slate-500">Pads edges instead of stretching</span>
                </div>
                <button
                  type="button"
                  onClick={() => setKeepAspectRatio(!keepAspectRatio)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    keepAspectRatio ? 'bg-[#00f5d4]' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      keepAspectRatio ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0c0f11] border border-slate-800">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-200">Ignore Transparent Air</span>
                  <span className="text-[11px] text-slate-500">Skips empty background pixels</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIgnoreTransparency(!ignoreTransparency)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    ignoreTransparency ? 'bg-[#00f5d4]' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      ignoreTransparency ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0c0f11] border border-slate-800">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-200">Floyd-Steinberg Dithering</span>
                  <span className="text-[11px] text-slate-500">Smooth color shading for photos</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDithering(!dithering)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    dithering ? 'bg-[#00f5d4]' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      dithering ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Primary Action Button: Re-Generate Blueprint */}
            <button
              onClick={processImageToBlueprint}
              disabled={isProcessing || !sourceImage}
              className={`w-full py-3.5 px-6 rounded-xl font-heading font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isProcessing || !sourceImage
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-[#00f5d4] hover:bg-[#00dcbe] text-slate-950 shadow-glow-cyan active:scale-[0.99]'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Mapping Minecraft Palette...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Blueprint</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Visual Blueprint & Material List            */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Interactive Visual Blueprint Grid */}
          <div className="bg-[#1d2022] border border-cyan-500/20 p-6 rounded-xl shadow-xl flex flex-col relative overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-4 z-10">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#00f5d4]" />
                <h3 className="font-heading font-bold text-base text-white tracking-wide">
                  VISUAL BLUEPRINT CANVAS
                </h3>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGridLines(!showGridLines)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                    showGridLines
                      ? 'bg-cyan-950/80 border-cyan-500/50 text-[#00f5d4]'
                      : 'bg-[#0c0f11] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Toggle Grid Lines"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBlueprint}
                  disabled={!gridData}
                  className="px-2.5 py-1 rounded text-xs font-mono font-medium bg-[#0c0f11] hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  title="Download PNG Image"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PNG</span>
                </button>
              </div>
            </div>

            {/* Canvas Display Container */}
            <div className="relative w-full aspect-square max-h-[460px] bg-[#0c0f11] rounded-lg border border-slate-800/80 flex items-center justify-center overflow-hidden p-2">
              <canvas
                ref={interactiveCanvasRef}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={handleCanvasMouseLeave}
                className="max-w-full max-h-full object-contain image-rendering-pixelated cursor-crosshair shadow-2xl rounded"
              />

              {/* Empty Placeholder */}
              {!gridData && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2 pointer-events-none">
                  <ImageIcon className="w-10 h-10 text-slate-600" />
                  <p className="text-xs font-mono">Upload an image to generate grid</p>
                </div>
              )}

              {/* Hover Inspection HUD Overlay */}
              {hoveredCell && (
                <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-[#1d2022]/95 backdrop-blur-md border border-cyan-500/40 px-3 py-2 rounded-lg shadow-xl text-xs font-mono flex items-center gap-3 z-20 pointer-events-none">
                  {hoveredCell.block ? (
                    <>
                      <div
                        className="w-4 h-4 rounded border border-white/20 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: hoveredCell.block.hex }}
                      />
                      <div>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <span>{hoveredCell.block.name}</span>
                          <span className="text-[10px] text-cyan-400">({hoveredCell.block.hex})</span>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Coords: X: {hoveredCell.x} | Y: {hoveredCell.y}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="font-bold text-slate-400">Air / Transparent</p>
                      <p className="text-[10px] text-slate-500">
                        Coords: X: {hoveredCell.x} | Y: {hoveredCell.y} (No block required)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Status Bar */}
            <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
              <div className="flex items-center gap-3">
                <span>
                  Grid: <strong className="text-white">{resolution} × {resolution}</strong>
                </span>
                <span>•</span>
                <span>
                  Placed: <strong className="text-[#00f5d4]">{totalPlacedBlocks.toLocaleString()} blocks</strong>
                </span>
              </div>
              <span className="text-slate-500">Cyan lines mark 16-block chunk boundaries</span>
            </div>
          </div>

          {/* Card 2: Material Shopping List & Recipe Breakdown */}
          <div className="bg-[#1d2022] border border-cyan-500/20 p-6 rounded-xl shadow-xl flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00f5d4]" />
                <h3 className="font-heading font-bold text-base text-white tracking-wide">
                  MATERIAL LIST &amp; SHOPPING RECIPE
                </h3>
              </div>

              {/* Copy Material List Button */}
              <button
                type="button"
                onClick={handleCopyMaterialList}
                disabled={materialCounts.length === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#0c0f11] hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {copiedMaterials ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Material List</span>
                  </>
                )}
              </button>
            </div>

            {/* Metrics Overview Pill Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-[#0c0f11] border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Blocks</span>
                <span className="text-sm font-mono font-bold text-white mt-0.5 block">
                  {totalPlacedBlocks.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0c0f11] border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Stack Count (64x)</span>
                <span className="text-sm font-mono font-bold text-cyan-300 mt-0.5 block truncate">
                  {totalStacksCount}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0c0f11] border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Unique Types</span>
                <span className="text-sm font-mono font-bold text-emerald-300 mt-0.5 block">
                  {materialCounts.length} blocks
                </span>
              </div>
            </div>

            {/* Filter Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter blocks (e.g. Wool, Concrete, Stone)..."
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
                className="w-full bg-[#0c0f11] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Scrollable Material Table */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {filteredMaterials.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs font-mono">
                  No matching blocks found in blueprint.
                </div>
              ) : (
                filteredMaterials.map((item) => (
                  <div
                    key={item.block.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#0c0f11] hover:bg-[#14181c] border border-slate-800/80 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-5 h-5 rounded border border-white/20 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: item.block.hex }}
                      />
                      <div className="truncate">
                        <p className="text-xs font-medium text-slate-200 truncate">{item.block.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {item.stacks > 0 ? `${item.stacks} stacks + ${item.remainder}` : `${item.remainder} single`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-mono text-xs font-bold text-white block">
                        {item.count.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 block">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
