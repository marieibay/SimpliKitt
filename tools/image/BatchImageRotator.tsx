import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

declare global {
  interface Window {
    JSZip: any;
  }
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

const BatchImageRotator: React.FC = () => {
    const [files, setFiles] = useState<ImageFile[]>([]);
    const [angle, setAngle] = useState(90);
    const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
    const [progress, setProgress] = useState(0);
    const [zipUrl, setZipUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [libReady, setLibReady] = useState(false);

    useEffect(() => {
      if ((window as any).JSZip) {
        setLibReady(true);
      } else {
        const interval = setInterval(() => {
          if ((window as any).JSZip) {
            setLibReady(true);
            clearInterval(interval);
          }
        }, 200);
        return () => clearInterval(interval);
      }
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newImageFiles = acceptedFiles.map(file => ({
            id: `${file.name}-${file.size}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
        }));
        setFiles(prev => [...prev, ...newImageFiles]);
        setStatus('idle');
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    const rotateImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('No canvas context');

                if (angle === 90 || angle === -90) {
                    canvas.width = img.height;
                    canvas.height = img.width;
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }
                
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(angle * Math.PI / 180);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);

                canvas.toBlob(blob => blob ? resolve(blob) : reject('Blob creation failed'), file.type);
            };
            img.onerror = reject;
        });
    };

    const handleRotate = async () => {
        if (files.length === 0) return;
        setStatus('processing');
        setProgress(0);
        const JSZip = window.JSZip;
        const zip = new JSZip();

        for (let i = 0; i < files.length; i++) {
            const rotatedBlob = await rotateImage(files[i].file);
            zip.file(files[i].file.name, rotatedBlob);
            setProgress(((i + 1) / files.length) * 100);
        }

        const content = await zip.generateAsync({ type: 'blob' });
        setZipUrl(URL.createObjectURL(content));
        setStatus('done');
        trackEvent('batch_image_rotated', { count: files.length, angle });
    };

    const handleReset = () => {
        files.forEach(f => URL.revokeObjectURL(f.preview));
        setFiles([]);
        setStatus('idle');
    };
    
    if(status === 'done' && zipUrl) {
        return (
             <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border">
                <h3 className="text-xl font-bold">Rotation Complete!</h3>
                <a href={zipUrl} download="rotated-images.zip" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download ZIP</a>
                <button onClick={handleReset} className="ml-4 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Start Over</button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                <input {...getInputProps()} />
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-lg">Drag & drop images, or click to select</p>
            </div>
            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border rounded-lg">
                        <label className="block text-sm font-medium mb-2">Rotation Angle</label>
                        <select value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full p-2 border-gray-300 rounded-md">
                            <option value={90}>90° Clockwise</option>
                            <option value={-90}>90° Counter-Clockwise</option>
                            <option value={180}>180°</option>
                        </select>
                    </div>
                    {status === 'processing' ? (
                        <div className="p-6 bg-gray-50 border rounded-lg text-center space-y-3">
                            <h3 className="text-lg font-semibold">Processing...</h3>
                            <div className="w-full bg-gray-200 rounded-full h-4"><div className="bg-blue-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div></div>
                        </div>
                    ) : (
                        <div className="pt-4 border-t flex justify-center items-center gap-4">
                            <button onClick={handleRotate} disabled={!libReady} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                                {!libReady ? 'Initializing...' : `Rotate ${files.length} Image(s)`}
                            </button>
                            <button onClick={handleReset} className="text-sm text-gray-600 hover:underline">Clear All</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BatchImageRotator;
