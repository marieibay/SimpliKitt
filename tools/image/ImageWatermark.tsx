import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageWatermark: React.FC = () => {
    const [mainImage, setMainImage] = useState<HTMLImageElement | null>(null);
    const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);
    const [watermark, setWatermark] = useState({ x: 10, y: 10, scale: 0.2, opacity: 0.7 });
    const [isDragging, setIsDragging] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const dragStartWatermarkPos = useRef({ x: 0, y: 0 });

    const drawCanvas = useCallback(() => {
        if (!canvasRef.current || !mainImage) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = mainImage.width;
        canvas.height = mainImage.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mainImage, 0, 0);

        if (watermarkImage) {
            ctx.globalAlpha = watermark.opacity;
            const wmWidth = watermarkImage.width * watermark.scale;
            const wmHeight = watermarkImage.height * watermark.scale;
            ctx.drawImage(watermarkImage, watermark.x, watermark.y, wmWidth, wmHeight);
            ctx.globalAlpha = 1.0;
        }
    }, [mainImage, watermark, watermarkImage]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);

    const handleFile = (file: File, type: 'main' | 'watermark') => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                if (type === 'main') setMainImage(img);
                else setWatermarkImage(img);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
        setResult(null);
    };

    const startDrag = (clientX: number, clientY: number) => {
        if (!watermarkImage || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = (clientX - rect.left) * scaleX;
        const canvasY = (clientY - rect.top) * scaleY;

        const wmWidth = watermarkImage.width * watermark.scale;
        const wmHeight = watermarkImage.height * watermark.scale;

        if (canvasX >= watermark.x && canvasX <= watermark.x + wmWidth && canvasY >= watermark.y && canvasY <= watermark.y + wmHeight) {
            setIsDragging(true);
            dragStartPos.current = { x: canvasX, y: canvasY };
            dragStartWatermarkPos.current = { x: watermark.x, y: watermark.y };
        }
    };

    const handleDrag = (clientX: number, clientY: number) => {
        if (!isDragging || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = (clientX - rect.left) * scaleX;
        const canvasY = (clientY - rect.top) * scaleY;

        const dx = canvasX - dragStartPos.current.x;
        const dy = canvasY - dragStartPos.current.y;

        setWatermark(prev => ({ ...prev, x: dragStartWatermarkPos.current.x + dx, y: dragStartWatermarkPos.current.y + dy }));
    };

    const endDrag = () => setIsDragging(false);
    
    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length > 0) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length > 0) handleDrag(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        setResult(dataUrl);
        trackEvent('image_watermarked');
    };
    
    const handleReset = () => {
        setMainImage(null);
        setWatermarkImage(null);
        setResult(null);
    }
    
    if(result) {
        return (
            <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Watermarked Image</h3>
                <img src={result} alt="Watermarked result" className="max-w-full mx-auto border rounded-lg shadow" />
                <div className="flex justify-center gap-4 pt-2">
                    <a href={result} download="watermarked-image.png" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</a>
                    <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Start Over</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!mainImage ? (
                <FileUpload onFileUpload={(file) => handleFile(file, 'main')} acceptedMimeTypes={['image/jpeg', 'image/png']} title="Upload Main Image" />
            ) : !watermarkImage ? (
                 <FileUpload onFileUpload={(file) => handleFile(file, 'watermark')} acceptedMimeTypes={['image/png']} title="Upload Watermark Logo" description="A PNG with a transparent background is recommended." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex justify-center items-center bg-gray-100 p-2 rounded-lg border">
                        <canvas ref={canvasRef} className="max-w-full h-auto cursor-grab active:cursor-grabbing"
                            onMouseDown={e => startDrag(e.clientX, e.clientY)}
                            onMouseMove={e => handleDrag(e.clientX, e.clientY)}
                            onMouseUp={endDrag}
                            onMouseLeave={endDrag}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={endDrag}
                            onTouchCancel={endDrag}
                        />
                    </div>
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <label className="block text-sm font-medium">Scale: {Math.round(watermark.scale * 100)}%</label>
                            <input type="range" min="0.05" max="1" step="0.01" value={watermark.scale} onChange={e => setWatermark(w => ({ ...w, scale: parseFloat(e.target.value) }))} className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Opacity: {Math.round(watermark.opacity * 100)}%</label>
                            <input type="range" min="0.1" max="1" step="0.05" value={watermark.opacity} onChange={e => setWatermark(w => ({ ...w, opacity: parseFloat(e.target.value) }))} className="w-full" />
                        </div>
                        <button onClick={handleDownload} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Apply & Download</button>
                        <button onClick={handleReset} className="w-full mt-2 px-4 py-2 text-sm text-gray-600 hover:underline">Reset</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageWatermark;