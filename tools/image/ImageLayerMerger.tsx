
import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const blendModes: GlobalCompositeOperation[] = [
    'source-over', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
    'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion'
];

const ImageLayerMerger: React.FC = () => {
    const [bottomLayer, setBottomLayer] = useState<HTMLImageElement | null>(null);
    const [topLayer, setTopLayer] = useState<HTMLImageElement | null>(null);
    const [blendMode, setBlendMode] = useState<GlobalCompositeOperation>('overlay');
    const [resultUrl, setResultUrl] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleBottom = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => { const img = new Image(); img.onload = () => setBottomLayer(img); img.src = e.target!.result as string; };
        reader.readAsDataURL(file);
    };
    const handleTop = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => { const img = new Image(); img.onload = () => setTopLayer(img); img.src = e.target!.result as string; };
        reader.readAsDataURL(file);
    };

    const draw = useCallback(() => {
        if (!bottomLayer || !topLayer || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = bottomLayer.width;
        canvas.height = bottomLayer.height;
        ctx.drawImage(bottomLayer, 0, 0);

        ctx.globalCompositeOperation = blendMode;
        ctx.drawImage(topLayer, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';

        setResultUrl(canvas.toDataURL());
    }, [bottomLayer, topLayer, blendMode]);

    useEffect(() => { draw(); }, [draw]);

    const handleDownload = () => {
        trackEvent('image_layers_merged', { blendMode });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'merged-layers.png';
        link.click();
    };

    if (!bottomLayer) return <FileUpload onFileUpload={handleBottom} acceptedMimeTypes={['image/*']} title="Upload Bottom Layer" />;
    if (!topLayer) return <div><img src={bottomLayer.src} className="max-w-xs border rounded" /><FileUpload onFileUpload={handleTop} acceptedMimeTypes={['image/*']} title="Upload Top Layer" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-center"><canvas ref={canvasRef} className="max-w-full h-auto border" /></div>
            <div className="flex justify-center items-center gap-4">
                <label>Blend Mode:</label>
                <select value={blendMode} onChange={e => setBlendMode(e.target.value as GlobalCompositeOperation)} className="p-2 border rounded">
                    {blendModes.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                </select>
            </div>
            <button onClick={handleDownload} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Merged Image</button>
        </div>
    );
};

export default ImageLayerMerger;