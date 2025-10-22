import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageZoomPreviewer: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const lastTouchDistance = useRef(0);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setZoom(1);
                // Center the image initially
                if (canvasRef.current) {
                    const canvasWidth = canvasRef.current.parentElement!.clientWidth;
                    const canvasHeight = canvasRef.current.parentElement!.clientHeight;
                    setOffset({
                        x: (canvasWidth - img.width) / 2,
                        y: (canvasHeight - img.height) / 2,
                    });
                } else {
                    setOffset({ x: 0, y: 0 });
                }
                trackEvent('image_zoom_previewer_loaded');
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const draw = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.parentElement!.clientWidth;
        canvas.height = canvas.parentElement!.clientHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(zoom, zoom);
        ctx.drawImage(image, 0, 0);
        ctx.restore();
    }, [image, zoom, offset]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const scaleAmount = 1.1;
            const newZoom = e.deltaY < 0 ? zoom * scaleAmount : zoom / scaleAmount;
            setZoom(Math.max(0.1, Math.min(newZoom, 10)));
        };
        canvas.addEventListener('wheel', handleWheel, { passive: false });
        return () => canvas.removeEventListener('wheel', handleWheel);
    }, [zoom]);
    
    useEffect(() => {
        draw();
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, [draw]);

    // Pan logic for both mouse and touch
    const handlePanStart = (clientX: number, clientY: number) => {
        isDragging.current = true;
        lastPos.current = { x: clientX, y: clientY };
    };

    const handlePanMove = (clientX: number, clientY: number) => {
        if (!isDragging.current) return;
        const dx = clientX - lastPos.current.x;
        const dy = clientY - lastPos.current.y;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        lastPos.current = { x: clientX, y: clientY };
    };

    const handlePanEnd = () => {
        isDragging.current = false;
        lastTouchDistance.current = 0;
    };
    
    // Pinch to zoom
    const handlePinch = (e: TouchEvent) => {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const distance = Math.sqrt(Math.pow(t1.clientX - t2.clientX, 2) + Math.pow(t1.clientY - t2.clientY, 2));

        if (lastTouchDistance.current > 0) {
            const scaleFactor = distance / lastTouchDistance.current;
            setZoom(prev => Math.max(0.1, Math.min(prev * scaleFactor, 10)));
        }
        lastTouchDistance.current = distance;
    };
    
    // Combined touch handler
    const handleTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            if (e.type === 'touchstart') handlePanStart(touch.clientX, touch.clientY);
            else if (e.type === 'touchmove') handlePanMove(touch.clientX, touch.clientY);
        } else if (e.touches.length === 2 && e.type === 'touchmove') {
            isDragging.current = false;
            handlePinch(e.nativeEvent as TouchEvent);
        }
        if (e.type === 'touchend') handlePanEnd();
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/*']} title="Upload an Image to Zoom and Pan" />;
    }

    return (
        <div className="space-y-4">
            <div className="w-full h-[60vh] border rounded-lg overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing touch-none">
                <canvas 
                    ref={canvasRef}
                    onMouseDown={e => handlePanStart(e.clientX, e.clientY)}
                    onMouseMove={e => handlePanMove(e.clientX, e.clientY)}
                    onMouseUp={handlePanEnd}
                    onMouseLeave={handlePanEnd}
                    onTouchStart={handleTouch}
                    onTouchMove={handleTouch}
                    onTouchEnd={handleTouch}
                    onTouchCancel={handlePanEnd}
                />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                 <label className="block text-sm font-medium">Zoom: {Math.round(zoom * 100)}%</label>
                 <input 
                    type="range" 
                    min="0.1" 
                    max="10" 
                    step="0.1" 
                    value={zoom}
                    onChange={e => setZoom(Number(e.target.value))}
                    className="w-full"
                />
                <p className="text-xs text-gray-500 text-center">Use mouse wheel or pinch to zoom. Click/drag to pan.</p>
            </div>
             <button onClick={() => setImage(null)} className="text-sm text-blue-600 hover:underline">Use another image</button>
        </div>
    );
};

export default ImageZoomPreviewer;