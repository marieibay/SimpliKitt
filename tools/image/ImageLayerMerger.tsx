import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const BLEND_MODES: GlobalCompositeOperation[] = [
    'source-over', 'source-in', 'source-out', 'source-atop',
    'destination-over', 'destination-in', 'destination-out', 'destination-atop',
    'lighter', 'copy', 'xor', 'multiply', 'screen', 'overlay', 'darken',
    'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light',
    'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'
];

const ImageLayerMerger: React.FC = () => {
    const [bottomLayer, setBottomLayer] = useState<HTMLImageElement | null>(null);
    const [topLayer, setTopLayer] = useState<HTMLImageElement | null>(null);
    const [blendMode, setBlendMode] = useState<GlobalCompositeOperation>('overlay');
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File, layer: 'bottom' | 'top') => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => (layer === 'bottom' ? setBottomLayer(img) : setTopLayer(img));
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const draw = useCallback(() => {
        if (!bottomLayer || !topLayer || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = Math.max(bottomLayer.width, topLayer.width);
        canvas.height = Math.max(bottomLayer.height, topLayer.height);

        ctx.drawImage(bottomLayer, 0, 0);
        ctx.globalCompositeOperation = blendMode;
        ctx.drawImage(topLayer, 0, 0);
        
        ctx.globalCompositeOperation = 'source-over'; // Reset
        setResultUrl(canvas.toDataURL('image/png'));
    }, [bottomLayer, topLayer, blendMode]);

    useEffect(() => {
        draw();
    }, [draw]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_layers_merged', { blendMode });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'merged-image.png';
        link.click();
    };

    if (!bottomLayer) return <FileUpload onFileUpload={(file) => handleFile(file, 'bottom')} acceptedMimeTypes={['image/jpeg', 'image/png']} title="1. Upload Bottom Layer" />;
    if (!topLayer) return <FileUpload onFileUpload={(file) => handleFile(file, 'top')} acceptedMimeTypes={['image/jpeg', 'image/png']} title="2. Upload Top Layer" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border">
                {resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[500px]" /> : <p>Loading...</p>}
                <canvas ref={canvasRef} className="hidden" />
            </div>
             <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-1">Blend Mode</label>
                <select value={blendMode} onChange={e => setBlendMode(e.target.value as GlobalCompositeOperation)} className="w-full p-2 border-gray-300 rounded-md">
                    {BLEND_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                </select>
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                <button onClick={() => { setBottomLayer(null); setTopLayer(null); }} className="px-4 py-2 text-sm text-gray-600 hover:underline">Start Over</button>
            </div>
        </div>
    );
};

export default ImageLayerMerger;
