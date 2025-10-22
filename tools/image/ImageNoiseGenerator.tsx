import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageNoiseGenerator: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [intensity, setIntensity] = useState(20);
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

    const applyNoise = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * intensity;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }
        ctx.putImageData(imageData, 0, 0);

        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, intensity]);

    useEffect(() => {
        if (image) applyNoise();
    }, [image, intensity, applyNoise]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_filter_applied', { filter: 'noise', intensity });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = `noisy-image.png`;
        link.click();
    };

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
                <label className="block text-sm font-medium">Noise Intensity: {intensity}</label>
                <input type="range" min="0" max="100" value={intensity} onChange={e => setIntensity(parseInt(e.target.value, 10))} className="w-full" />
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                <button onClick={() => setImage(null)} className="px-4 py-2 text-sm text-gray-600 hover:underline">Use another image</button>
            </div>
        </div>
    );
};

export default ImageNoiseGenerator;
