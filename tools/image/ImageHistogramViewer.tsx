import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageHistogramViewer: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [histograms, setHistograms] = useState<{ r: number[], g: number[], b: number[], l: number[] } | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const histCanvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => setImage(img);
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const calculateHistogram = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, image.width, image.height).data;
        const r = new Array(256).fill(0);
        const g = new Array(256).fill(0);
        const b = new Array(256).fill(0);
        const l = new Array(256).fill(0);

        for (let i = 0; i < imageData.length; i += 4) {
            r[imageData[i]]++;
            g[imageData[i + 1]]++;
            b[imageData[i + 2]]++;
            const luminosity = Math.round(0.299 * imageData[i] + 0.587 * imageData[i + 1] + 0.114 * imageData[i + 2]);
            l[luminosity]++;
        }

        setHistograms({ r, g, b, l });
        trackEvent('image_histogram_viewed');
    }, [image]);

    const drawHistograms = useCallback(() => {
        if (!histograms || !histCanvasRef.current) return;
        const canvas = histCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const width = canvas.width;
        const height = canvas.height / 4;

        ctx.clearRect(0, 0, width, canvas.height);

        const draw = (data: number[], color: string, yOffset: number) => {
            const max = Math.max(...data);
            ctx.fillStyle = color;
            for (let i = 0; i < 256; i++) {
                const barHeight = (data[i] / max) * (height - 10);
                ctx.fillRect(i * (width / 256), yOffset + height - barHeight, (width / 256), barHeight);
            }
        };

        draw(histograms.r, 'rgba(255, 0, 0, 0.7)', 0);
        draw(histograms.g, 'rgba(0, 255, 0, 0.7)', height);
        draw(histograms.b, 'rgba(0, 0, 255, 0.7)', height * 2);
        draw(histograms.l, 'rgba(128, 128, 128, 0.7)', height * 3);
    }, [histograms]);

    useEffect(() => {
        if(image) calculateHistogram();
    }, [image, calculateHistogram]);
    
    useEffect(() => {
        drawHistograms();
    }, [histograms, drawHistograms]);
    
    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/*']} />;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-center items-center bg-gray-100 p-2 rounded-lg border">
                    <img src={image.src} alt="Preview" className="max-w-full max-h-[400px]" />
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                 <div className="p-2 bg-white border rounded-lg">
                    <canvas ref={histCanvasRef} width="512" height="400" className="w-full h-auto" />
                     <div className="grid grid-cols-4 text-center text-xs font-semibold p-2">
                        <span style={{color: 'red'}}>Red</span>
                        <span style={{color: 'green'}}>Green</span>
                        <span style={{color: 'blue'}}>Blue</span>
                        <span style={{color: 'gray'}}>Luminosity</span>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <button onClick={() => setImage(null)} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Check Another Image</button>
            </div>
        </div>
    );
};

export default ImageHistogramViewer;
