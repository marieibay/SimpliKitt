import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageReflectionGenerator: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
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

    const draw = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reflectionHeight = image.height * 0.5;
        canvas.width = image.width;
        canvas.height = image.height + reflectionHeight;
        
        // Draw original
        ctx.drawImage(image, 0, 0);

        // Draw reflection
        ctx.save();
        ctx.translate(0, image.height);
        ctx.scale(1, -1);
        ctx.drawImage(image, 0, -image.height, image.width, image.height);
        ctx.restore();

        // Add gradient
        ctx.save();
        const gradient = ctx.createLinearGradient(0, image.height, 0, canvas.height);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 1)");
        ctx.fillStyle = gradient;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillRect(0, image.height, canvas.width, reflectionHeight);
        ctx.restore();

        setResultUrl(canvas.toDataURL('image/png'));
    }, [image]);

    useEffect(() => {
        draw();
    }, [draw]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_filter_applied', { filter: 'reflection' });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'reflected-image.png';
        link.click();
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/png']} title="Upload PNG with Transparency" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border">
                {resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[600px]" /> : <p>Loading...</p>}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                <button onClick={() => setImage(null)} className="px-4 py-2 text-sm text-gray-600 hover:underline">Use another image</button>
            </div>
        </div>
    );
};

export default ImageReflectionGenerator;
