import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

type Direction = 'horizontal' | 'vertical';
type Position = 'top' | 'bottom' | 'left' | 'right';

const ImageMirrorEffect: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [direction, setDirection] = useState<Direction>('horizontal');
    const [position, setPosition] = useState<Position>('bottom');
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => setImage(img);
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const applyEffect = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = image.width;
        const h = image.height;
        canvas.width = direction === 'horizontal' ? w : w * 2;
        canvas.height = direction === 'vertical' ? h : h * 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(direction === 'horizontal') {
            const y = position === 'top' ? h : 0;
            ctx.drawImage(image, 0, y);
            ctx.save();
            ctx.translate(0, h);
            ctx.scale(1, -1);
            ctx.drawImage(image, 0, y === 0 ? 0 : -h);
            ctx.restore();
        } else { // vertical
            const x = position === 'left' ? w : 0;
            ctx.drawImage(image, x, 0);
            ctx.save();
            ctx.translate(w, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(image, x === 0 ? 0 : -w, 0);
            ctx.restore();
        }
        
        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, direction, position]);

    useEffect(() => {
        applyEffect();
    }, [image, direction, position, applyEffect]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_filter_applied', { filter: 'mirror', direction, position });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'mirrored-image.png';
        link.click();
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border">
                {resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[500px]" /> : <p>Loading...</p>}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border rounded-lg">
                <div>
                    <label className="block text-sm font-medium mb-1">Direction</label>
                    <select value={direction} onChange={e => setDirection(e.target.value as Direction)} className="w-full p-2 border-gray-300 rounded-md">
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Reflection Position</label>
                    <select value={position} onChange={e => setPosition(e.target.value as Position)} className="w-full p-2 border-gray-300 rounded-md">
                        {direction === 'horizontal' ? <>
                            <option value="bottom">Bottom</option>
                            <option value="top">Top</option>
                        </> : <>
                            <option value="right">Right</option>
                            <option value="left">Left</option>
                        </>}
                    </select>
                </div>
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} disabled={!resultUrl} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                <button onClick={() => setImage(null)} className="px-4 py-2 text-sm text-gray-600 hover:underline">Use another image</button>
            </div>
        </div>
    );
};

export default ImageMirrorEffect;