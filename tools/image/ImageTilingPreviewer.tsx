import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';

const ImageTilingPreviewer: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
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

        const pattern = ctx.createPattern(image, 'repeat');
        if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [image]);

    useEffect(() => {
        draw();
    }, [draw]);
    
    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/gif']} title="Upload an Image to Preview Tiling" />;
    }

    return (
        <div className="space-y-6">
            <div className="w-full h-[500px] border rounded-lg overflow-hidden">
                <canvas ref={canvasRef} width="800" height="500" />
            </div>
            <div className="text-center">
                <button onClick={() => setImage(null)} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                    Use Another Image
                </button>
            </div>
        </div>
    );
};

export default ImageTilingPreviewer;
