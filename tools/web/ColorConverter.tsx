
import React, { useState } from 'react';

// Color conversion utilities
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return { r, g, b };
};


const ColorConverter: React.FC = () => {
    const [hex, setHex] = useState('#FFFFFF');
    const [rgb, setRgb] = useState('255, 255, 255');
    const [hsl, setHsl] = useState('0, 0, 100');
    const [error, setError] = useState('');

    const updateFromHex = (newHex: string) => {
        setHex(newHex);
        const rgbVal = hexToRgb(newHex);
        if(rgbVal) {
            setError('');
            setRgb(`${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}`);
            const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
            setHsl(`${hslVal.h}, ${hslVal.s}, ${hslVal.l}`);
        } else {
            setError('Invalid HEX value');
        }
    };

    const updateFromRgb = (newRgb: string) => {
        setRgb(newRgb);
        const parts = newRgb.split(',').map(p => parseInt(p.trim()));
        if(parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
            setError('');
            const [r,g,b] = parts;
            setHex(rgbToHex(r,g,b));
            const hslVal = rgbToHsl(r,g,b);
            setHsl(`${hslVal.h}, ${hslVal.s}, ${hslVal.l}`);
        } else {
            setError('Invalid RGB value');
        }
    };

    const updateFromHsl = (newHsl: string) => {
        setHsl(newHsl);
        const parts = newHsl.split(',').map(p => parseInt(p.trim()));
        if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
            const [h,s,l] = parts;
            if(h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
                setError('');
                const rgbVal = hslToRgb(h,s,l);
                setRgb(`${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}`);
                setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
            } else {
                setError('Invalid HSL value');
            }
        } else {
            setError('Invalid HSL value');
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center">
                <div 
                    className="w-48 h-48 rounded-full border-8 border-gray-100 shadow-lg"
                    style={{ backgroundColor: error ? '#FFFFFF' : hex }}
                />
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="hex" className="block text-sm font-medium text-gray-700">HEX</label>
                    <input type="text" id="hex" value={hex} onChange={e => updateFromHex(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md font-mono" />
                </div>
                 <div>
                    <label htmlFor="rgb" className="block text-sm font-medium text-gray-700">RGB</label>
                    <input type="text" id="rgb" value={rgb} onChange={e => updateFromRgb(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md font-mono" placeholder="255, 255, 255" />
                </div>
                 <div>
                    <label htmlFor="hsl" className="block text-sm font-medium text-gray-700">HSL</label>
                    <input type="text" id="hsl" value={hsl} onChange={e => updateFromHsl(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md font-mono" placeholder="0, 0, 100" />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default ColorConverter;
