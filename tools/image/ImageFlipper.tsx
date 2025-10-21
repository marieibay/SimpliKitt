import React, { useState, useRef, useCallback, useEffect } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageFlipper: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [flip, setFlip] = useState({ horizontal: false, vertical: false });
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setFlip({ horizontal: false, vertical: false });
                setResultUrl(null);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const applyFlip = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        
        ctx.clearRect(0,0, canvas.width, canvas.height);
        
        ctx.save();
        const scaleH = flip.horizontal ? -1 : 1;
        const scaleV = flip.vertical ? -1 : 1;
        const translateX = flip.horizontal ? -canvas.width : 0;
        const translateY = flip.vertical ? -canvas.height : 0;

        ctx.translate(flip.horizontal ? canvas.width : 0, flip.vertical ? canvas.height : 0);
        ctx.scale(scaleH, scaleV);
        ctx.drawImage(image, 0, 0);
        ctx.restore();

        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, flip]);

    useEffect(() => {
        if(image) applyFlip();
    }, [image, flip, applyFlip]);

    const handleFlipHorizontal = () => {
        setFlip(f => ({ ...f, horizontal: !f.horizontal }));
        trackEvent('image_flipped', { direction: 'horizontal' });
    };

    const handleFlipVertical = () => {
        setFlip(f => ({ ...f, vertical: !f.vertical }));
        trackEvent('image_flipped', { direction: 'vertical' });
    };

    const handleDownload = () => {
        if (!resultUrl) return;
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'flipped-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setImage(null);
        setFlip({ horizontal: false, vertical: false });
        setResultUrl(null);
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border min-h-[300px]">
                {resultUrl ? (
                    <img src={resultUrl} alt="Flipped preview" className="max-w-full max-h-[400px]" />
                ) : (
                    <p>Applying transformation...</p>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleFlipHorizontal} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Flip Horizontal</button>
                <button onClick={handleFlipVertical} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Flip Vertical</button>
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} disabled={!resultUrl} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-green-300">
                    Download Flipped Image
                </button>
                <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">
                    Use another image
                </button>
            </div>
        </div>
    );
};

export default ImageFlipper;