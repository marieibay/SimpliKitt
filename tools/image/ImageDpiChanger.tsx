import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageDpiChanger: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [dpi, setDpi] = useState(300);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const changeDpi = (buffer: ArrayBuffer, newDpi: number) => {
        const view = new DataView(buffer);
        let offset = 2;
        while(offset < view.byteLength) {
            if (view.getUint16(offset) === 0xFFE0) { // APP0 marker for JFIF
                if(view.getUint16(offset+4) === 0x4A46 && view.getUint16(offset+6) === 0x4946 && view.getUint8(offset+8) === 0x00) { // "JFIF\0"
                    view.setUint8(offset + 12, 1); // units = dpi
                    view.setUint16(offset + 13, newDpi, false); // X density
                    view.setUint16(offset + 15, newDpi, false); // Y density
                    return buffer;
                }
            }
            offset += 2 + view.getUint16(offset + 2);
        }
        // If no JFIF found, we can't easily change DPI this way
        throw new Error("JFIF header not found. Cannot change DPI of this JPEG.");
    };

    const handleFile = async (selectedFile: File) => {
        setFile(selectedFile);
        setIsProcessing(true);
        try {
            const buffer = await selectedFile.arrayBuffer();
            const newBuffer = changeDpi(buffer, dpi);
            const blob = new Blob([newBuffer], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${selectedFile.name.replace(/\.[^/.]+$/, "")}-dpi${dpi}.jpg`;
            link.click();
            URL.revokeObjectURL(url);
            trackEvent('image_dpi_changed', { dpi });
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
            setFile(null);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center gap-4 p-4 bg-gray-50 border rounded-lg">
                <label className="text-sm font-medium">Set DPI to:</label>
                <select value={dpi} onChange={e => setDpi(+e.target.value)} className="p-2 border rounded-md">
                    <option value="72">72 (Web)</option>
                    <option value="150">150 (Standard Print)</option>
                    <option value="300">300 (High Quality Print)</option>
                </select>
            </div>
            <FileUpload 
                onFileUpload={handleFile}
                acceptedMimeTypes={['image/jpeg']}
                title="Upload JPEG to Change DPI"
                externalError={isProcessing ? "Processing..." : null}
            />
        </div>
    );
};

export default ImageDpiChanger;
