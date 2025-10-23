import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackGtagEvent } from '../../analytics';

const PngTransparencyChecker: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => setImage(img);
            img.src = e.target?.result as string;
            trackGtagEvent('tool_used', {
                event_category: 'Image Tools',
                event_label: 'PNG Transparency Checker',
                tool_name: 'png-transparency-checker',
            });
        };
        reader.readAsDataURL(file);
    };

    const draw = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        
        // Draw checkerboard
        const TILE_SIZE = 10;
        for (let y = 0; y < canvas.height; y += TILE_SIZE) {
            for (let x = 0; x < canvas.width; x += TILE_SIZE) {
                const isLight = ((x / TILE_SIZE) + (y / TILE_SIZE)) % 2 === 0;
                ctx.fillStyle = isLight ? '#fff' : '#ccc';
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            }
        }
        
        // Draw image over it
        ctx.drawImage(image, 0, 0);
    }, [image]);

    useEffect(() => {
        draw();
    }, [image, draw]);

    const handleReset = () => setImage(null);

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/png']} title="Upload a PNG to Check Transparency" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-start p-4 bg-gray-50 border rounded-lg">
                <canvas ref={canvasRef} className="max-w-full max-h-[600px] border" />
            </div>
            <div className="text-center">
                <button onClick={handleReset} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                    Check Another Image
                </button>
            </div>
        </div>
    );
};

export default PngTransparencyChecker;