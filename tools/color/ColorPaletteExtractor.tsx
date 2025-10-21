import React, { useState, useRef, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

interface Color {
  hex: string;
  rgb: string;
}

const ColorPaletteExtractor: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [palette, setPalette] = useState<Color[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setPalette([]);
                setError(null);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };
    
    const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    
    const extractPalette = useCallback(() => {
        if (!image || !canvasRef.current) return;
        setIsProcessing(true);
        setError(null);

        setTimeout(() => {
            try {
                const canvas = canvasRef.current!;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (!ctx) throw new Error("Canvas context is not available.");

                const MAX_WIDTH = 100;
                const aspectRatio = image.height / image.width;
                canvas.width = MAX_WIDTH;
                canvas.height = MAX_WIDTH * aspectRatio;
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                const colorCounts: { [key: string]: number } = {};
                const step = 4; // Process every 4th pixel for performance

                for (let i = 0; i < imageData.length; i += 4 * step) {
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];
                    const rgb = `${r},${g},${b}`;
                    colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
                }

                const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
                
                const mainPalette: Color[] = [];
                const colorDistanceThreshold = 50;

                for (const [rgbStr, count] of sortedColors) {
                    if (mainPalette.length >= 8) break;
                    const [r, g, b] = rgbStr.split(',').map(Number);
                    
                    const isSimilar = mainPalette.some(color => {
                        const [pr, pg, pb] = color.rgb.split(',').map(Number);
                        const distance = Math.sqrt((r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2);
                        return distance < colorDistanceThreshold;
                    });
                    
                    if (!isSimilar) {
                        mainPalette.push({ hex: rgbToHex(r, g, b), rgb: rgbStr });
                    }
                }
                
                setPalette(mainPalette);
                trackEvent('color_palette_extracted', { colorCount: mainPalette.length });
            } catch (err: any) {
                setError(err.message || "Could not process image to extract colors.");
            } finally {
                setIsProcessing(false);
            }
        }, 50);

    }, [image]);

    const handleReset = () => {
        setImage(null);
        setPalette([]);
        setError(null);
    };

    const ColorSwatch: React.FC<{ color: Color }> = ({ color }) => {
        const [copied, setCopied] = useState(false);
        const handleCopy = () => {
            navigator.clipboard.writeText(color.hex);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };
        return (
            <div className="flex flex-col items-center" onClick={handleCopy}>
                <div style={{ backgroundColor: color.hex }} className="w-16 h-16 rounded-full border-2 border-gray-200 cursor-pointer shadow-md"/>
                <span className="mt-2 text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{copied ? 'Copied!' : color.hex}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <canvas ref={canvasRef} className="hidden" />
            {!image ? (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />
            ) : (
                <>
                    <div className="flex justify-center p-4 bg-gray-100 border rounded-lg">
                        <img src={image.src} alt="Uploaded preview" className="max-h-80 object-contain rounded" />
                    </div>
                    <div className="text-center">
                        <button onClick={extractPalette} disabled={isProcessing} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                            {isProcessing ? 'Analyzing...' : 'Extract Color Palette'}
                        </button>
                    </div>
                </>
            )}

            {error && <p className="text-red-600 text-center">{error}</p>}
            
            {palette.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">Dominant Colors</h3>
                    <div className="flex flex-wrap justify-center gap-6 p-4 bg-gray-50 border rounded-lg">
                        {palette.map((color) => <ColorSwatch key={color.hex} color={color} />)}
                    </div>
                </div>
            )}
            
            {image && (
                <div className="text-center pt-4 border-t">
                    <button onClick={handleReset} className="text-sm text-blue-600 hover:underline">Use another image</button>
                </div>
            )}
        </div>
    );
};

export default ColorPaletteExtractor;
