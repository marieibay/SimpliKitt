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

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setZoom(1);
                setOffset({ x: 0, y: 0 });
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


    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/*']} title="Upload an Image to Zoom and Pan" />;
    }

    return (
        <div className="space-y-4">
            <div className="w-full h-[60vh] border rounded-lg overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing">
                <canvas 
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
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
                <p className="text-xs text-gray-500 text-center">Use mouse wheel to zoom, click and drag to pan.</p>
            </div>
             <button onClick={() => setImage(null)} className="text-sm text-blue-600 hover:underline">Use another image</button>
        </div>
    );
};

export default ImageZoomPreviewer;
