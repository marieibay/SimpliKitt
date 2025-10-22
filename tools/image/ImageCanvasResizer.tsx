import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageCanvasResizer: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [bgColor, setBgColor] = useState('#ffffff');
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setCanvasSize({ width: img.width, height: img.height });
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

        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const x = (canvas.width - image.width) / 2;
        const y = (canvas.height - image.height) / 2;
        ctx.drawImage(image, x, y);

        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, canvasSize, bgColor]);

    useEffect(() => {
        draw();
    }, [draw]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_canvas_resized');
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'canvas-resized.png';
        link.click();
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex justify-center items-center bg-gray-100 p-4 rounded-lg border">
                {resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[500px]" /> : <p>Loading...</p>}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex gap-4">
                    <div>
                        <label className="block text-sm font-medium">Width (px)</label>
                        <input type="number" value={canvasSize.width} onChange={e => setCanvasSize(s => ({ ...s, width: Number(e.target.value) }))} className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Height (px)</label>
                        <input type="number" value={canvasSize.height} onChange={e => setCanvasSize(s => ({ ...s, height: Number(e.target.value) }))} className="w-full p-2 border rounded-md" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Background Color</label>
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 p-1 border rounded-md" />
                </div>
                <div className="pt-4 space-y-3">
                    <button onClick={handleDownload} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                    <button onClick={() => setImage(null)} className="w-full text-sm text-blue-600 hover:underline">Use another image</button>
                </div>
            </div>
        </div>
    );
};

export default ImageCanvasResizer;
