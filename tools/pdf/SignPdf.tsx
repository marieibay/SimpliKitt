import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUpload from '../../components/FileUpload';
import { trackGtagEvent } from '../../analytics';
import { LoaderIcon, InfoIcon, UploadIcon, PlusIcon, PenLineIcon, TypeIcon, Trash2Icon, DownloadIcon, CloseIcon } from '../../components/Icons';

const PDFJS_VERSION = "4.3.136";
const PDFJS_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.mjs`;
const PDFJS_WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;

type Handle = 'tl' | 'tr' | 'bl' | 'br' | 'move';

// --- SignaturePad Sub-component ---
const SignaturePad = ({ onSave }: { onSave: (dataUrl: string) => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const getPos = (e: MouseEvent | TouchEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        isDrawing.current = true;
        lastPos.current = getPos(e.nativeEvent);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing.current) return;
        e.preventDefault();
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const pos = getPos(e.nativeEvent);
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPos.current = pos;
    };
    
    const stopDrawing = () => { isDrawing.current = false; };
    
    const clear = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const save = () => {
        const canvas = canvasRef.current!;
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        if (canvas.toDataURL() === blank.toDataURL()) return;
        onSave(canvas.toDataURL('image/png'));
    };

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    return (
        <div className="flex flex-col items-center space-y-2">
            <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="bg-gray-100 border rounded-lg cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            <div className="flex gap-4">
                <button onClick={clear} className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300">Clear</button>
                <button onClick={save} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Signature</button>
            </div>
        </div>
    );
};


// --- SignatureModal Sub-component ---
const SignatureModal = ({ onClose, onSaveSignature }: { onClose: () => void, onSaveSignature: (dataUrl: string) => void }) => {
    const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('draw');
    const [typedText, setTypedText] = useState('');
    const [fontFamily, setFontFamily] = useState('Caveat');
    const typeCanvasRef = useRef<HTMLCanvasElement>(null);
    const fonts = ['Caveat', 'Dancing Script', 'Pacifico', 'Satisfy'];

    const drawTypedSignature = useCallback(() => {
        if (typeCanvasRef.current) {
            const canvas = typeCanvasRef.current;
            const ctx = canvas.getContext('2d')!;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `48px "${fontFamily}", cursive`;
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(typedText || 'Your Name', canvas.width / 2, canvas.height / 2);
        }
    }, [typedText, fontFamily]);

    useEffect(() => {
        if (tab === 'type') {
            drawTypedSignature();
        }
    }, [typedText, fontFamily, tab, drawTypedSignature]);

    const saveTypedSignature = () => {
        if (typeCanvasRef.current && typedText) {
            drawTypedSignature(); // Ensure it's drawn before saving
            onSaveSignature(typeCanvasRef.current.toDataURL('image/png'));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onSaveSignature(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Add Signature</h2>
                    <button onClick={onClose}><CloseIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex border-b">
                    <button onClick={() => setTab('draw')} className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 ${tab === 'draw' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}><PenLineIcon className="w-5 h-5"/> Draw</button>
                    <button onClick={() => setTab('type')} className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 ${tab === 'type' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}><TypeIcon className="w-5 h-5"/> Type</button>
                    <button onClick={() => setTab('upload')} className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 ${tab === 'upload' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}><UploadIcon className="w-5 h-5"/> Upload</button>
                </div>
                <div className="p-6">
                    {tab === 'draw' && <SignaturePad onSave={onSaveSignature} />}
                    {tab === 'type' && (
                        <div className="flex flex-col items-center space-y-4">
                            <input type="text" value={typedText} onChange={e => setTypedText(e.target.value)} placeholder="Type your name" className="w-full p-2 border rounded-lg text-center text-2xl" style={{fontFamily: `"${fontFamily}", cursive`}}/>
                            <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="p-2 border rounded-lg">
                                {fonts.map(font => <option key={font} value={font} style={{fontFamily: `"${font}", cursive`}}>{font}</option>)}
                            </select>
                            <canvas ref={typeCanvasRef} width={400} height={100} className="bg-gray-100 border rounded-lg" />
                            <button onClick={saveTypedSignature} disabled={!typedText} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save Signature</button>
                        </div>
                    )}
                    {tab === 'upload' && (
                        <div className="text-center">
                            <label htmlFor="sig-upload" className="cursor-pointer inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                                Upload Signature Image
                            </label>
                            <input id="sig-upload" type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
                            <p className="text-xs text-gray-500 mt-2">Best results with a transparent PNG.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Main SignPdf Component ---
const SignPdf: React.FC = () => {
    const [isLibraryReady, setIsLibraryReady] = useState(false);
    const [libraryError, setLibraryError] = useState<string | null>(null);
    const pdfjsLibRef = useRef<any>(null);

    const [file, setFile] = useState<File | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pdfPages, setPdfPages] = useState<any[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [signatures, setSignatures] = useState<string[]>([]);
    const [placedSignatures, setPlacedSignatures] = useState<any[]>([]);
    const [activeSigIndex, setActiveSigIndex] = useState<number | null>(null);
    const [selectedPlacedSigId, setSelectedPlacedSigId] = useState<number | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState('');
    
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const interactionRef = useRef<{ mode: 'move' | Handle | null, startPos: {x: number, y: number}, startSig: any }>({ mode: null, startPos: {x:0, y:0}, startSig: null });

    useEffect(() => {
        const loadLibrary = async () => {
            try {
                const pdfjsModule = await import(/* @vite-ignore */ PDFJS_URL);
                const pdfjsLib = pdfjsModule.default || pdfjsModule;
                pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
                pdfjsLibRef.current = pdfjsLib;
                setIsLibraryReady(true);
            } catch (err) {
                console.error(err);
                setLibraryError("PDF viewer library failed to load. Please refresh.");
            }
        };
        loadLibrary();
    }, []);

    const handleFile = async (selectedFile: File) => {
        setFile(selectedFile);
        setStatus('Loading PDF...');
        setIsProcessing(true);
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const loadingTask = pdfjsLibRef.current.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            
            const pagePromises = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                pagePromises.push(pdf.getPage(i));
            }
            setPdfPages(await Promise.all(pagePromises));
            setCurrentPage(1);

        } catch (err) {
            console.error(err);
            setLibraryError("Failed to load PDF. It may be corrupt or encrypted.");
        }
        setIsProcessing(false);
        setStatus('');
    };

    const drawCanvas = useCallback(async () => {
        if (pdfPages.length === 0 || !mainCanvasRef.current) return;
    
        const canvas = mainCanvasRef.current;
        const container = canvas.parentElement;
        if (!container) return;

        const ctx = canvas.getContext('2d');
        const page = pdfPages[currentPage - 1];
        if (!ctx || !page) return;
    
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const scale = Math.min(
            container.clientWidth / unscaledViewport.width,
            container.clientHeight / unscaledViewport.height
        );
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
    
        await page.render({ canvasContext: ctx, viewport }).promise;
    
        const sigImages = await Promise.all(signatures.map(s => new Promise<HTMLImageElement>(resolve => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = s;
        })));
    
        placedSignatures.filter(s => s.pageNum === currentPage).forEach(sig => {
            const sigImg = sigImages[sig.sigIndex];
            if (sigImg) {
                const x = sig.relX * canvas.width;
                const y = sig.relY * canvas.height;
                const width = sig.relWidth * canvas.width;
                const height = sig.relHeight * canvas.height;

                ctx.drawImage(sigImg, x, y, width, height);

                if (sig.id === selectedPlacedSigId) {
                    ctx.strokeStyle = 'rgba(0, 123, 255, 0.9)';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.strokeRect(x, y, width, height);
                    ctx.setLineDash([]);
                    
                    const handleSize = 8;
                    ctx.fillStyle = 'rgba(0, 123, 255, 0.9)';
                    ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize); // tl
                    ctx.fillRect(x + width - handleSize/2, y - handleSize/2, handleSize, handleSize); // tr
                    ctx.fillRect(x - handleSize/2, y + height - handleSize/2, handleSize, handleSize); // bl
                    ctx.fillRect(x + width - handleSize/2, y + height - handleSize/2, handleSize, handleSize); // br
                }
            }
        });
    }, [currentPage, pdfPages, placedSignatures, signatures, selectedPlacedSigId]);
    
    useEffect(() => {
        drawCanvas();
        window.addEventListener('resize', drawCanvas);
        return () => window.removeEventListener('resize', drawCanvas);
    }, [drawCanvas]);


    const getCanvasPos = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
        const canvas = mainCanvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const getHandleUnderCursor = (x: number, y: number, sig: any, canvas: HTMLCanvasElement): Handle | null => {
        const handleSize = 24; 
        const absSig = { x: sig.relX * canvas.width, y: sig.relY * canvas.height, width: sig.relWidth * canvas.width, height: sig.relHeight * canvas.height };
        
        if (x > absSig.x - handleSize/2 && x < absSig.x + handleSize/2 && y > absSig.y - handleSize/2 && y < absSig.y + handleSize/2) return 'tl';
        if (x > absSig.x + absSig.width - handleSize/2 && x < absSig.x + absSig.width + handleSize/2 && y > absSig.y - handleSize/2 && y < absSig.y + handleSize/2) return 'tr';
        if (x > absSig.x - handleSize/2 && x < absSig.x + handleSize/2 && y > absSig.y + absSig.height - handleSize/2 && y < absSig.y + absSig.height + handleSize/2) return 'bl';
        if (x > absSig.x + absSig.width - handleSize/2 && x < absSig.x + absSig.width + handleSize/2 && y > absSig.y + absSig.height - handleSize/2 && y < absSig.y + absSig.height + handleSize/2) return 'br';
        return null;
    };

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = mainCanvasRef.current!;
        const pos = getCanvasPos(e.nativeEvent);

        const selectedSig = placedSignatures.find(s => s.id === selectedPlacedSigId && s.pageNum === currentPage);
        if (selectedSig) {
            const handle = getHandleUnderCursor(pos.x, pos.y, selectedSig, canvas);
            if (handle) {
                interactionRef.current = { mode: handle, startPos: pos, startSig: { ...selectedSig } };
                return;
            }
        }

        const sigToSelect = [...placedSignatures].reverse().find(s => {
            if (s.pageNum !== currentPage) return false;
            const x = s.relX * canvas.width;
            const y = s.relY * canvas.height;
            const width = s.relWidth * canvas.width;
            const height = s.relHeight * canvas.height;
            return pos.x >= x && pos.x <= x + width && pos.y >= y && pos.y <= y + height;
        });

        if (sigToSelect) {
            setSelectedPlacedSigId(sigToSelect.id);
            interactionRef.current = { mode: 'move', startPos: pos, startSig: { ...sigToSelect } };
            return;
        }

        setSelectedPlacedSigId(null);

        if (activeSigIndex !== null) {
            const sigImg = new Image();
            sigImg.src = signatures[activeSigIndex];
            sigImg.onload = () => {
                const defaultWidth = 150;
                const aspectRatio = sigImg.height / sigImg.width;
                
                const relX = (pos.x - defaultWidth / 2) / canvas.width;
                const relY = (pos.y - (defaultWidth * aspectRatio) / 2) / canvas.height;
                const relWidth = defaultWidth / canvas.width;
                const relHeight = (defaultWidth * aspectRatio) / canvas.height;

                setPlacedSignatures(prev => [...prev, {
                    id: Date.now(), pageNum: currentPage, sigIndex: activeSigIndex,
                    relX, relY, relWidth, relHeight,
                }]);
                setActiveSigIndex(null);
            };
        }
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!interactionRef.current.mode) return;
        const canvas = mainCanvasRef.current!;
        const pos = getCanvasPos(e.nativeEvent);
        const { mode, startSig, startPos } = interactionRef.current;

        setPlacedSignatures(prev => prev.map(sig => {
            if (sig.id !== startSig.id) return sig;

            if (mode === 'move') {
                const dx = pos.x - startPos.x;
                const dy = pos.y - startPos.y;
                const relDx = dx / canvas.width;
                const relDy = dy / canvas.height;
                return { ...sig, relX: startSig.relX + relDx, relY: startSig.relY + relDy };
            }
            
            const startAbs = { x: startSig.relX * canvas.width, y: startSig.relY * canvas.height, width: startSig.relWidth * canvas.width, height: startSig.relHeight * canvas.height };
            const aspectRatio = startAbs.width / startAbs.height;
            let newAbs = { ...startAbs };

            switch(mode) {
                case 'br': {
                    const anchor = { x: startAbs.x, y: startAbs.y };
                    let width = pos.x - anchor.x;
                    let height = pos.y - anchor.y;
                    if (width / height > aspectRatio) height = width / aspectRatio; else width = height * aspectRatio;
                    newAbs.width = width; newAbs.height = height;
                    break;
                }
                case 'bl': {
                    const anchor = { x: startAbs.x + startAbs.width, y: startAbs.y };
                    let width = anchor.x - pos.x;
                    let height = pos.y - anchor.y;
                    if (width / height > aspectRatio) height = width / aspectRatio; else width = height * aspectRatio;
                    newAbs.x = anchor.x - width; newAbs.width = width; newAbs.height = height;
                    break;
                }
                case 'tr': {
                    const anchor = { x: startAbs.x, y: startAbs.y + startAbs.height };
                    let width = pos.x - anchor.x;
                    let height = anchor.y - pos.y;
                    if (width / height > aspectRatio) height = width / aspectRatio; else width = height * aspectRatio;
                    newAbs.y = anchor.y - height; newAbs.width = width; newAbs.height = height;
                    break;
                }
                case 'tl': {
                    const anchor = { x: startAbs.x + startAbs.width, y: startAbs.y + startAbs.height };
                    let width = anchor.x - pos.x;
                    let height = anchor.y - pos.y;
                    if (width / height > aspectRatio) height = width / aspectRatio; else width = height * aspectRatio;
                    newAbs.x = anchor.x - width; newAbs.y = anchor.y - height; newAbs.width = width; newAbs.height = height;
                    break;
                }
            }
            
            if (newAbs.width < 20 || newAbs.height < 20) return sig;
            
            return { 
                ...sig, 
                relX: newAbs.x / canvas.width,
                relY: newAbs.y / canvas.height,
                relWidth: newAbs.width / canvas.width,
                relHeight: newAbs.height / canvas.height,
            };
        }));
    };
    
    const handleMouseUp = () => {
        interactionRef.current.mode = null;
    };

    const handleDeleteSignature = () => {
        if (selectedPlacedSigId === null) return;
        setPlacedSignatures(prev => prev.filter(s => s.id !== selectedPlacedSigId));
        setSelectedPlacedSigId(null);
    };

    const handleSaveSignature = (dataUrl: string) => {
        setSignatures(prev => [...prev, dataUrl]);
        setIsModalOpen(false);
    };
    
    const handleApplyAndDownload = async () => {
        if (!file) return;
        setStatus('Applying signatures...');
        setIsProcessing(true);
        try {
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            const embeddedSigs = await Promise.all(signatures.map(s => pdfDoc.embedPng(s)));

            placedSignatures.forEach(sig => {
                const page = pdfDoc.getPage(sig.pageNum - 1);
                const { width: pageWidth, height: pageHeight } = page.getSize();
                
                page.drawImage(embeddedSigs[sig.sigIndex], {
                    x: sig.relX * pageWidth,
                    y: pageHeight - (sig.relY * pageHeight) - (sig.relHeight * pageHeight),
                    width: sig.relWidth * pageWidth,
                    height: sig.relHeight * pageHeight,
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `signed-${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            
            trackGtagEvent('tool_used', { tool_name: 'Sign PDF', is_download: true });

        } catch(err) {
            console.error(err);
            setStatus('Error applying signatures.');
        } finally {
            setIsProcessing(false);
        }
    };


    if (!isLibraryReady || libraryError) {
        return (
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border min-h-[300px]">
                {libraryError ? <InfoIcon className="w-12 h-12 text-red-500 mb-4" /> : <LoaderIcon className="w-12 h-12 text-blue-600 animate-spin mb-6" />}
                <h2 className="text-xl font-bold text-gray-800 mb-2">{libraryError ? 'Library Error' : 'Initializing PDF Engine...'}</h2>
                <p className="text-gray-600 text-center">{libraryError || 'This should only take a moment.'}</p>
            </div>
        );
    }

    if (!file) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['application/pdf']} title="Upload a PDF to Sign" />;
    }
    
    return (
        <div className="flex flex-col md:flex-row gap-4 h-[80vh]">
            {isModalOpen && <SignatureModal onClose={() => setIsModalOpen(false)} onSaveSignature={handleSaveSignature} />}
            
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-200 rounded-lg overflow-hidden p-4 touch-none">
                <div className="flex-grow flex items-center justify-center w-full min-h-0">
                    <canvas 
                        ref={mainCanvasRef} 
                        className={`bg-white shadow-lg ${activeSigIndex !== null ? 'cursor-crosshair' : 'cursor-default'}`} 
                        onMouseDown={e => handleMouseDown(e)}
                        onMouseMove={e => handleMouseMove(e)}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={e => handleMouseDown(e)}
                        onTouchMove={e => handleMouseMove(e)}
                        onTouchEnd={handleMouseUp}
                    />
                </div>
                {pdfPages.length > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-4 flex-shrink-0 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-1 text-sm bg-white rounded-full shadow hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Previous page"
                        >
                            &larr; Previous
                        </button>
                        <span className="text-sm font-medium text-gray-700 tabular-nums" aria-live="polite">
                            Page {currentPage} / {pdfPages.length}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(pdfPages.length, p + 1))}
                            disabled={currentPage === pdfPages.length}
                            className="px-4 py-1 text-sm bg-white rounded-full shadow hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Next page"
                        >
                            Next &rarr;
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full md:w-64 bg-gray-50 border rounded-lg p-4 flex flex-col gap-4 flex-shrink-0">
                <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5"/> Add Signature
                </button>
                <div className="flex-grow space-y-2 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-600">Your Signatures</h3>
                    {signatures.map((sig, index) => (
                        <div key={index} onClick={() => setActiveSigIndex(index)} className={`p-2 border rounded-lg cursor-pointer ${activeSigIndex === index ? 'ring-2 ring-blue-500' : 'hover:border-gray-400'}`}>
                            <img src={sig} alt="Signature" className="w-full h-auto bg-white"/>
                        </div>
                    ))}
                    {signatures.length === 0 && <p className="text-xs text-gray-500 text-center">No signatures created yet.</p>}
                </div>

                {selectedPlacedSigId !== null && (
                    <div className="border-t pt-4">
                         <h3 className="text-sm font-semibold text-gray-600 mb-2">Selected Signature</h3>
                        <button onClick={handleDeleteSignature} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
                           <Trash2Icon className="w-4 h-4" /> Delete Signature
                        </button>
                    </div>
                )}
                
                <button onClick={handleApplyAndDownload} disabled={isProcessing || placedSignatures.length === 0} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-green-300">
                    {isProcessing ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <DownloadIcon className="w-5 h-5" />}
                    {isProcessing ? status : 'Apply & Download'}
                </button>
            </div>
        </div>
    );
};

export default SignPdf;