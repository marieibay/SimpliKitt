import React, { useState, useRef, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageDitheringEffect: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
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

    const applyDithering = useCallback(() => {
        if (!image || !canvasRef.current) return;
        setIsProcessing(true);

        setTimeout(() => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            const bayerMatrix = [
                [0, 8, 2, 10],
                [12, 4, 14, 6],
                [3, 11, 1, 9],
                [15, 7, 13, 5],
            ];
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const y = Math.floor((i / 4) / canvas.width);
                const x = (i / 4) % canvas.width;
                const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
                const threshold = (bayerMatrix[y % 4][x % 4] / 16) * 255;
                const value = gray > threshold ? 255 : 0;
                data[i] = data[i + 1] = data[i + 2] = value;
            }
            ctx.putImageData(imageData, 0, 0);
            setResultUrl(canvas.toDataURL('image/png'));
            setIsProcessing(false);
            trackEvent('image_filter_applied', { filter: 'dithering' });
        }, 50);
    }, [image]);

    const handleDownload = () => {
        if (!resultUrl) return;
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'dithered-image.png';
        link.click();
    };
    
    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                 <div className="p-2 border rounded-lg bg-gray-100 flex items-center justify-center min-h-[300px]">
                    <img src={image.src} alt="Original" className="max-w-full max-h-[400px]" />
                </div>
                <div className="p-2 border rounded-lg bg-gray-100 flex items-center justify-center min-h-[300px]">
                    {isProcessing ? <p>Dithering...</p> : resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[400px]" /> : null}
                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>
            <div className="flex justify-center gap-4">
                {!resultUrl ? (
                    <button onClick={applyDithering} disabled={isProcessing} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                        {isProcessing ? 'Processing...' : 'Apply Dithering Effect'}
                    </button>
                ) : (
                    <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                )}
                <button onClick={() => setImage(null)} className="px-4 py-2 text-sm text-gray-600 hover:underline">Use another image</button>
            </div>
        </div>
    );
};

export default ImageDitheringEffect;
