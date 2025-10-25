import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

const VintageFilmFilter: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [grain, setGrain] = useState(15);
    const [vignette, setVignette] = useState(40);
    const [colorShift, setColorShift] = useState('subtle-sepia');
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

    const applyEffect = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;

        // 1. Apply Color Shift
        ctx.filter = 'none'; // Reset filter
        switch(colorShift) {
            case 'subtle-sepia':
                ctx.filter = 'sepia(30%) contrast(95%) brightness(105%) saturate(110%)';
                break;
            case 'faded-color':
                ctx.filter = 'saturate(70%) contrast(90%) brightness(110%)';
                break;
            case 'cool-blues':
                ctx.filter = 'contrast(110%) saturate(120%) hue-rotate(-10deg)';
                break;
        }
        ctx.drawImage(image, 0, 0);
        ctx.filter = 'none'; // Reset filter after drawing so it doesn't affect subsequent operations

        // 2. Apply Grain
        if (grain > 0) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * grain;
                data[i] = Math.max(0, Math.min(255, data[i] + noise));
                data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
                data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
            }
            ctx.putImageData(imageData, 0, 0);
        }

        // 3. Apply Vignette
        if (vignette > 0) {
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.2,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.8
            );
            gradient.addColorStop(0, `rgba(0,0,0,0)`);
            gradient.addColorStop(1, `rgba(0,0,0,${vignette / 100})`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, grain, vignette, colorShift]);

    useEffect(() => {
        applyEffect();
    }, [applyEffect]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_filter_applied', { filter: 'vintage-film', grain, vignette, colorShift });
        trackGtagEvent('tool_used', {
            event_category: 'Image Tools',
            event_label: 'Vintage Film Filter',
            tool_name: 'vintage-film-filter',
            is_download: true,
        });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'vintage-film-image.png';
        link.click();
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border min-h-[300px]">
                {resultUrl ? (
                    <img src={resultUrl} alt="Vintage film effect preview" className="max-w-full max-h-[500px]" />
                ) : (
                    <p>Applying effect...</p>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                    <label className="block text-sm font-medium">Grain Intensity: {grain}</label>
                    <input type="range" min="0" max="50" value={grain} onChange={e => setGrain(parseInt(e.target.value, 10))} className="w-full" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Vignette: {vignette}%</label>
                    <input type="range" min="0" max="100" value={vignette} onChange={e => setVignette(parseInt(e.target.value, 10))} className="w-full" />
                </div>
                <div>
                     <label className="block text-sm font-medium">Color Style</label>
                     <select value={colorShift} onChange={e => setColorShift(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md">
                        <option value="subtle-sepia">Subtle Sepia</option>
                        <option value="faded-color">Faded Color</option>
                        <option value="cool-blues">Cool Blues</option>
                     </select>
                </div>
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} disabled={!resultUrl} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-green-300">
                    Download Image
                </button>
                <button onClick={() => setImage(null)} className="px-4 py-2 text-sm text-gray-600 hover:underline">
                    Use another image
                </button>
            </div>
        </div>
    );
};

export default VintageFilmFilter;
