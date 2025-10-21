import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageLightnessAdjuster: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [lightness, setLightness] = useState(0); // -100 to 100
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setLightness(0);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const applyFilter = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.filter = `brightness(${100 + lightness}%)`;
        ctx.drawImage(image, 0, 0);

        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, lightness]);

    useEffect(() => {
        if(image) applyFilter();
    }, [image, lightness, applyFilter]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_filter_applied', { filter: 'lightness', intensity: lightness });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'lightness-image.png';
        link.click();
    };

    const handleReset = () => setImage(null);

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border min-h-[300px]">
                {resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[500px]" /> : <p>Applying filter...</p>}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <label className="block text-sm font-medium">Lightness: {lightness}%</label>
                <input
                    type="range"
                    min="-100"
                    max="100"
                    value={lightness}
                    onChange={e => setLightness(parseInt(e.target.value, 10))}
                    className="w-full"
                />
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} disabled={!resultUrl} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">Use another image</button>
            </div>
        </div>
    );
};

export default ImageLightnessAdjuster;