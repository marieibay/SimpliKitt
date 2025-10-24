import React, { useState, useRef, useCallback, useEffect } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackGtagEvent } from '../../analytics';

const ImageColorPicker: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [pickedColor, setPickedColor] = useState<{ r: number; g: number; b: number } | null>(null);
    const [lockedColor, setLockedColor] = useState<{ r: number; g: number; b: number } | null>(null);
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
                setPickedColor(null);
                setLockedColor(null);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };
    
    const handleReset = () => {
        setImage(null);
        setPickedColor(null);
        setLockedColor(null);
    };

    useEffect(() => {
        if (image && mainCanvasRef.current) {
            const canvas = mainCanvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Ensure the canvas is cleared before drawing a new image
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
            }
        }
    }, [image]);

    const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
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
        
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        const canvasX = Math.round(mouseX * (mainCanvasRef.current.width / rect.width));
        const canvasY = Math.round(mouseY * (mainCanvasRef.current.height / rect.height));
        
        const clampedX = Math.max(0, Math.min(canvasX, mainCanvasRef.current.width - 1));
        const clampedY = Math.max(0, Math.min(canvasY, mainCanvasRef.current.height - 1));

        setMousePos({ x: mouseX, y: mouseY });
        updateLoupe(clampedX, clampedY);
    };

    const handleClick = () => {
        if (pickedColor) {
            setLockedColor(pickedColor);
            trackGtagEvent('tool_used', {
                event_category: 'Image Tools',
                event_label: 'Image Color Picker (Magnifier)',
                tool_name: 'image-color-picker-magnifier',
                is_download: false,
                picked_color_hex: rgbToHex(pickedColor.r, pickedColor.g, pickedColor.b),
            });
        }
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
        handleClick();
    };
    
    const CopyButton: React.FC<{ value: string }> = ({ value }) => {
        const [copied, setCopied] = useState(false);
        const handleCopy = (e: React.MouseEvent) => {
            e.stopPropagation();
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
        return <button onClick={handleCopy} className="text-xs bg-gray-200 px-2 py-0.5 rounded hover:bg-gray-300">{copied ? 'Copied!' : 'Copy'}</button>;
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }
    
    const hoverHex = pickedColor ? rgbToHex(pickedColor.r, pickedColor.g, pickedColor.b) : '';
    
    const lockedHex = lockedColor ? rgbToHex(lockedColor.r, lockedColor.g, lockedColor.b) : '';
    const lockedRgb = lockedColor ? `rgb(${lockedColor.r}, ${lockedColor.g}, ${lockedColor.b})` : '';
    const lockedHslVal = lockedColor ? rgbToHsl(lockedColor.r, lockedColor.g, lockedColor.b) : null;
    const lockedHsl = lockedHslVal ? `hsl(${lockedHslVal.h}, ${lockedHslVal.s}%, ${lockedHslVal.l}%)` : '';


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
                    <div style={{ left: mousePos.x + 15, top: mousePos.y + 15, position: 'absolute', pointerEvents: 'none', zIndex: 10 }}>
                        <canvas ref={loupeCanvasRef} className="border-4 border-white rounded-full shadow-lg" />
                    </div>
                )}
            </div>
            <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Hover Color</h3>
                    {pickedColor && (
                        <div className="mt-2 space-y-2">
                             <div className="w-full h-10 rounded border" style={{ backgroundColor: hoverHex }} />
                             <div className="font-mono text-sm text-center text-gray-600">{hoverHex}</div>
                        </div>
                    )}
                </div>
                
                <hr className="border-gray-200" />
                
                <div>
                     <h3 className="text-lg font-semibold text-gray-800">Selected Color</h3>
                     {lockedColor ? (
                        <div className="mt-2 space-y-3">
                            <div className="w-full h-16 rounded-md border" style={{ backgroundColor: lockedHex }} />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center font-mono"><span className="font-semibold text-gray-600">HEX:</span> <span className="text-gray-800">{lockedHex}</span> <CopyButton value={lockedHex} /></div>
                                <div className="flex justify-between items-center font-mono"><span className="font-semibold text-gray-600">RGB:</span> <span className="text-gray-800">{lockedRgb}</span> <CopyButton value={lockedRgb} /></div>
                                <div className="flex justify-between items-center font-mono"><span className="font-semibold text-gray-600">HSL:</span> <span className="text-gray-800">{lockedHsl}</span> <CopyButton value={lockedHsl} /></div>
                            </div>
                        </div>
                     ) : (
                        <p className="text-sm text-gray-500 mt-2">Click on the image to select a color.</p>
                     )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-4">Hover to find a color, then click the image to lock it for copying.</p>
                    <button onClick={handleReset} className="w-full text-sm text-blue-600 hover:underline">
                        Use another image
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageColorPicker;