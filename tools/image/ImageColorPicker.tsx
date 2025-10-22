import React, { useState, useRef, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageColorPicker: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [pickedColor, setPickedColor] = useState<{ r: number; g: number; b: number } | null>(null);
    const [isLoupeVisible, setIsLoupeVisible] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const loupeCanvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                setImage(img);
                if (mainCanvasRef.current) {
                    const canvas = mainCanvasRef.current;
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx?.drawImage(img, 0, 0);
                }
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        } else { h = s = 0; }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    };

    const updateLoupe = useCallback((x: number, y: number) => {
        if (!mainCanvasRef.current || !loupeCanvasRef.current) return;
        const mainCtx = mainCanvasRef.current.getContext('2d', { willReadFrequently: true });
        const loupeCtx = loupeCanvasRef.current.getContext('2d');
        if (!mainCtx || !loupeCtx) return;

        const zoom = 10;
        const loupeSize = 150;
        loupeCanvasRef.current.width = loupeSize;
        loupeCanvasRef.current.height = loupeSize;

        loupeCtx.imageSmoothingEnabled = false;
        loupeCtx.clearRect(0, 0, loupeSize, loupeSize);
        loupeCtx.drawImage(mainCanvasRef.current, x - (loupeSize / zoom / 2), y - (loupeSize / zoom / 2), loupeSize / zoom, loupeSize / zoom, 0, 0, loupeSize, loupeSize);

        // Crosshair
        loupeCtx.strokeStyle = 'red';
        loupeCtx.lineWidth = 2;
        loupeCtx.beginPath();
        loupeCtx.moveTo(loupeSize / 2, 0);
        loupeCtx.lineTo(loupeSize / 2, loupeSize);
        loupeCtx.moveTo(0, loupeSize / 2);
        loupeCtx.lineTo(loupeSize, loupeSize / 2);
        loupeCtx.stroke();
        
        const pixelData = mainCtx.getImageData(x, y, 1, 1).data;
        setPickedColor({ r: pixelData[0], g: pixelData[1], b: pixelData[2] });

    }, []);
    
    const handleInteractionMove = (clientX: number, clientY: number) => {
        if (!mainCanvasRef.current) return;
        const rect = mainCanvasRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        setMousePos({ x, y });
        updateLoupe(x, y);
    };

    const handleClick = () => {
        trackEvent('color_picked_from_image', { color: pickedColor ? rgbToHex(pickedColor.r, pickedColor.g, pickedColor.b) : '' });
    };
    
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsLoupeVisible(true);
        if (e.touches.length > 0) {
            handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    };
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.touches.length > 0) {
            handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    };
    const handleTouchEnd = () => {
        setIsLoupeVisible(false);
        handleClick(); // Track event on touch end
    };
    
    const CopyButton: React.FC<{ value: string }> = ({ value }) => {
        const [copied, setCopied] = useState(false);
        const handleCopy = () => {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
        return <button onClick={handleCopy} className="text-xs bg-gray-200 px-2 py-0.5 rounded hover:bg-gray-300">{copied ? 'Copied!' : 'Copy'}</button>;
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }
    
    const hex = pickedColor ? rgbToHex(pickedColor.r, pickedColor.g, pickedColor.b) : '';
    const rgb = pickedColor ? `rgb(${pickedColor.r}, ${pickedColor.g}, ${pickedColor.b})` : '';
    const hslVal = pickedColor ? rgbToHsl(pickedColor.r, pickedColor.g, pickedColor.b) : null;
    const hsl = hslVal ? `hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)` : '';


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 relative touch-none" 
                onMouseEnter={() => setIsLoupeVisible(true)} 
                onMouseLeave={() => setIsLoupeVisible(false)} 
                onMouseMove={e => handleInteractionMove(e.clientX, e.clientY)} 
                onClick={handleClick}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <canvas ref={mainCanvasRef} className="max-w-full h-auto cursor-crosshair rounded-lg border" />
                {isLoupeVisible && (
                    <div style={{ left: mousePos.x + 15, top: mousePos.y + 15 }} className="absolute pointer-events-none">
                        <canvas ref={loupeCanvasRef} className="border-4 border-white rounded-full shadow-lg" />
                    </div>
                )}
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Picked Color</h3>
                {pickedColor && (
                    <div className="space-y-3">
                        <div className="w-full h-16 rounded-md" style={{ backgroundColor: hex }} />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center font-mono"><span className="font-semibold">HEX:</span> {hex} <CopyButton value={hex} /></div>
                            <div className="flex justify-between items-center font-mono"><span className="font-semibold">RGB:</span> {rgb} <CopyButton value={rgb} /></div>
                            <div className="flex justify-between items-center font-mono"><span className="font-semibold">HSL:</span> {hsl} <CopyButton value={hsl} /></div>
                        </div>
                    </div>
                )}
                <p className="text-xs text-gray-500">Hover or tap-and-drag on the image to pick a color.</p>
                 <button onClick={() => setImage(null)} className="text-sm text-blue-600 hover:underline pt-4">Use another image</button>
            </div>
        </div>
    );
};

export default ImageColorPicker;