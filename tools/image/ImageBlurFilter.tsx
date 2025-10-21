import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageBlurFilter: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [blur, setBlur] = useState(5); // Default blur radius in pixels
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setBlur(5);
                setResultUrl(null);
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

        ctx.filter = `blur(${blur}px)`;
        ctx.drawImage(image, 0, 0);

        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, blur]);

    useEffect(() => {
        applyFilter();
    }, [image, blur, applyFilter]);

    const handleDownload = () => {
        if (!resultUrl) return;
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'blurred-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        trackEvent('image_filter_applied', { filter: 'blur', intensity: blur });
    };

    const handleReset = () => {
        setImage(null);
        setBlur(5);
        setResultUrl(null);
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border min-h-[300px]">
                {resultUrl ? (
                    <img src={resultUrl} alt="Blurred preview" className="max-w-full max-h-[400px]" />
                ) : (
                    <p>Applying filter...</p>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <label htmlFor="blur" className="block text-sm font-medium text-gray-700">Blur Intensity: {blur}px</label>
                <input
                    type="range"
                    id="blur"
                    min="0"
                    max="20"
                    value={blur}
                    onChange={e => setBlur(parseInt(e.target.value, 10))}
                    className="w-full"
                />
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} disabled={!resultUrl} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-green-300">
                    Download Blurred Image
                </button>
                <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">
                    Use another image
                </button>
            </div>
        </div>
    );
};

export default ImageBlurFilter;