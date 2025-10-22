
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { trackGtagEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

const ImageToPdfConverter: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // FIX: Change state type to string to satisfy select element's value prop type.
    const [pageSize, setPageSize] = useState<string>('A4');
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');


    const onDrop = (acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles.filter(f => f.type.startsWith('image/'))]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    });

    const handleConvert = async () => {
        if (files.length === 0) {
            setError("Please select at least one image file.");
            return;
        }
        setIsProcessing(true);
        setError(null);

        try {
            const pdfDoc = await PDFDocument.create();

            for (const file of files) {
                const imageBytes = await file.arrayBuffer();
                
                const image = await (file.type === 'image/png' 
                    ? pdfDoc.embedPng(imageBytes)
                    : pdfDoc.embedJpg(imageBytes));

                // FIX: Assert type back to keyof PageSizes when accessing the object.
                let page = pdfDoc.addPage(PageSizes[pageSize as keyof typeof PageSizes]);
                if (orientation === 'landscape') {
                    // FIX: Assert type back to keyof PageSizes when accessing the object.
                    const [w, h] = PageSizes[pageSize as keyof typeof PageSizes];
                    page.setSize(h, w);
                }
                const { width, height } = page.getSize();
                
                const dims = image.scaleToFit(width, height);
                page.drawImage(image, {
                    x: (width - dims.width) / 2,
                    y: (height - dims.height) / 2,
                    width: dims.width,
                    height: dims.height,
                });
            }

            const pdfBytes = await pdfDoc.save();

            trackGtagEvent('tool_used', {
                event_category: 'PDF & Document Tools',
                event_label: 'Image to PDF Converter',
                tool_name: 'image-to-pdf-converter',
                is_download: true,
                file_count: files.length,
            });

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'images.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setFiles([]);
        } catch (err) {
            console.error(err);
            setError("An error occurred during conversion. One or more files may be corrupted.");
        } finally {
            setIsProcessing(false);
        }
    };
    
     const handleRemoveFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                <input {...getInputProps()} />
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-lg font-semibold text-gray-700">Drop image files here or click to select</p>
            </div>
            {error && <p className="text-red-600 text-center">{error}</p>}
            {files.length > 0 && (
                 <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Page Size</label>
                            {/* FIX: Remove 'as any' as the state is now a string. */}
                            <select value={pageSize} onChange={e => setPageSize(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md">
                                {Object.keys(PageSizes).map(size => <option key={size} value={size}>{size}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Orientation</label>
                            <select value={orientation} onChange={e => setOrientation(e.target.value as any)} className="w-full p-2 mt-1 border-gray-300 rounded-md">
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                            </select>
                        </div>
                     </div>
                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-80 overflow-y-auto">
                        {files.map((file, index) => (
                            <li key={index} className="relative group">
                                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-32 object-cover rounded-lg" />
                                <button onClick={() => handleRemoveFile(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">&times;</button>
                            </li>
                        ))}
                    </ul>
                    <div className="text-center pt-4">
                        <button onClick={handleConvert} disabled={isProcessing} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
                            {isProcessing ? 'Converting...' : 'Create PDF & Download'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageToPdfConverter;
