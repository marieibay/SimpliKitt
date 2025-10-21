import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageRotator: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [angle, setAngle] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setAngle(0);
                setResultUrl(null);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const drawRotatedImage = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        // Bounding box for the rotated image
        const newWidth = Math.abs(image.width * cos) + Math.abs(image.height * sin);
        const newHeight = Math.abs(image.width * sin) + Math.abs(image.height * cos);

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(rad);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);

        // Reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, angle]);

    useEffect(() => {
        drawRotatedImage();
    }, [image, angle, drawRotatedImage]);

    const handleDownload = () => {
        if (!resultUrl) return;
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'rotated-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        trackEvent('image_rotated', { angle });
    };

    const handleReset = () => {
        setImage(null);
        setAngle(0);
        setResultUrl(null);
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border min-h-[300px]">
                {resultUrl ? (
                    <img src={resultUrl} alt="Rotated preview" className="max-w-full max-h-[400px]" />
                ) : (
                    <p>Loading preview...</p>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <label htmlFor="angle" className="block text-sm font-medium text-gray-700">Angle: {angle}°</label>
                <input
                    type="range"
                    id="angle"
                    min="-180"
                    max="180"
                    value={angle}
                    onChange={e => setAngle(parseInt(e.target.value, 10))}
                    className="w-full"
                />
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} disabled={!resultUrl} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-green-300">
                    Download Rotated Image
                </button>
                <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">
                    Use another image
                </button>
            </div>
        </div>
    );
};

export default ImageRotator;