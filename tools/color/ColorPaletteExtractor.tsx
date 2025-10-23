import React, { useState, useRef } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

// Simple quantization logic
const getPalette = (imageData: ImageData, colorCount = 10) => {
    const pixels = imageData.data;
    const pixelCount = imageData.width * imageData.height;
    
    const colorMap: { [key: string]: number } = {};
    for (let i = 0; i < pixels.length; i += 4) {
        // Quantize colors to reduce the color space
        const r = Math.round(pixels[i] / 32) * 32;
        const g = Math.round(pixels[i+1] / 32) * 32;
        const b = Math.round(pixels[i+2] / 32) * 32;
        const key = `${r},${g},${b}`;
        colorMap[key] = (colorMap[key] || 0) + 1;
    }
    
    return Object.entries(colorMap)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, colorCount)
        .map(([key]) => key.split(',').map(Number));
};

const ColorPaletteExtractor: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [palette, setPalette] = useState<number[][] | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                extractPalette(img);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };
    
    const extractPalette = (img: HTMLImageElement) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if(!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const extracted = getPalette(imageData, 8);
        setPalette(extracted);
        trackEvent('color_palette_extracted');
        trackGtagEvent('tool_used', {
            event_category: 'Image Tools',
            event_label: 'Color Palette Extractor (from Image)',
            tool_name: 'color-palette-extractor-from-image',
        });
    };
    
    const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

    const ColorSwatch: React.FC<{ color: number[] }> = ({ color }) => {
        const [r, g, b] = color;
        const hex = rgbToHex(r, g, b);
        const [copied, setCopied] = useState(false);
        const handleCopy = () => {
            navigator.clipboard.writeText(hex);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
        return (
            <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: `rgb(${r}, ${g}, ${b})`}} />
                <span className="font-mono text-sm flex-grow">{hex}</span>
                <button onClick={handleCopy} className="text-xs bg-gray-200 px-2 py-0.5 rounded hover:bg-gray-300">{copied ? 'Copied!' : 'Copy'}</button>
            </div>
        );
    }
    
    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/*']} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-center items-center bg-gray-100 p-2 rounded-lg border">
                <img src={image.src} alt="Source" className="max-w-full max-h-[500px]" />
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dominant Colors</h3>
                {palette ? (
                    <div className="space-y-2">
                        {palette.map((color, i) => <ColorSwatch key={i} color={color} />)}
                    </div>
                ) : <p>Extracting palette...</p>}
                 <button onClick={() => setImage(null)} className="text-sm text-blue-600 hover:underline pt-4">Use another image</button>
            </div>
        </div>
    );
};

export default ColorPaletteExtractor;