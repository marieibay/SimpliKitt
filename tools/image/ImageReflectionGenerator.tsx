import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageReflectionGenerator: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [resultUrl, setResultUrl] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => { const img = new Image(); img.onload = () => setImage(img); img.src = e.target!.result as string; };
        reader.readAsDataURL(file);
    };

    const draw = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = image.width;
        canvas.height = image.height * 1.5;
        
        // Draw original image
        ctx.drawImage(image, 0, 0);
        
        // Draw reflection
        ctx.save();
        ctx.translate(0, image.height);
        ctx.scale(1, -1);
        ctx.drawImage(image, 0, -image.height, image.width, image.height);
        ctx.restore();
        
        // Add gradient fade
        const gradient = ctx.createLinearGradient(0, image.height, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, image.height, canvas.width, image.height * 0.5);

        setResultUrl(canvas.toDataURL());
    }, [image]);

    useEffect(() => { draw(); }, [draw]);

    const handleDownload = () => {
        trackEvent('image_reflection_generated');
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'reflected-image.png';
        link.click();
    };

    if (!image) return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/png']} title="Upload PNG with Transparency" />;

    return (
        <div className="space-y-6 text-center">
            <div className="inline-block bg-white p-4 rounded-lg border bg-[repeating-conic-gradient(theme(colors.gray.200)_0%_25%,transparent_25%_50%)] [background-size:20px_20px]">
                <img src={resultUrl} alt="Preview" className="max-w-full max-h-[500px]" />
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div>
                <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download</button>
            </div>
        </div>
    );
};

export default ImageReflectionGenerator;
