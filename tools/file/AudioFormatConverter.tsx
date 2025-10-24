import React, { useState, useEffect, useRef } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackGtagEvent } from '../../analytics';
import { LoaderIcon, DownloadIcon } from '../../components/Icons';
import { loadScript } from '../../utils/scriptLoader';

declare global {
  interface Window {
    lamejs: any;
    Oggmented: any;
    FLAC: any;
  }
}

type OutputFormat = 'mp3' | 'wav' | 'ogg' | 'flac' | 'aiff';

const LAME_URL = "https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js";
const FLAC_URL = "https://cdn.jsdelivr.net/npm/flac-addon@0.3.0/dist/flac-addon.min.js";
const OGG_URL = "https://cdn.jsdelivr.net/npm/oggmented@1.0.2/oggmented.js";


const AudioFormatConverter: React.FC = () => {
    const [isReady, setIsReady] = useState(false);
    const [status, setStatus] = useState("Initializing...");
    const [error, setError] = useState<string | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [outputFormat, setOutputFormat] = useState<OutputFormat>('mp3');
    const [mp3Bitrate, setMp3Bitrate] = useState(128);
    const [oggQuality, setOggQuality] = useState(0.5);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ url: string, name: string } | null>(null);

    useEffect(() => {
        const loadLibraries = async () => {
            try {
                setStatus("Loading audio encoders...");
                await Promise.all([
                    loadScript(LAME_URL),
                    loadScript(FLAC_URL),
                    loadScript(OGG_URL)
                ]);
                if (window.lamejs && window.FLAC && window.Oggmented) {
                    setIsReady(true);
                    setStatus("Ready");
                } else {
                    throw new Error("One or more audio libraries failed to load.");
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message);
                setStatus("Error loading libraries");
            }
        };
        loadLibraries();
    }, []);

    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);
        setResult(null);
    };
    
    const handleReset = () => {
        setFile(null);
        setError(null);
        if (result) URL.revokeObjectURL(result.url);
        setResult(null);
    };

    const handleConvert = async () => {
        if (!file) return;
        
        setIsProcessing(true);
        setError(null);
        if (result) URL.revokeObjectURL(result.url);
        setResult(null);

        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            let blob: Blob;
            const outputExtension = outputFormat === 'aiff' ? 'aif' : outputFormat;
            const outputName = file.name.replace(/\.[^/.]+$/, `.${outputExtension}`);

            switch (outputFormat) {
                case 'mp3':
                    if (!window.lamejs) throw new Error("MP3 encoding library not loaded.");
                    const mp3encoder = new window.lamejs.Mp3Encoder(1, audioBuffer.sampleRate, mp3Bitrate);
                    const samples = audioBuffer.getChannelData(0);
                    const sampleBlockSize = 1152;
                    const mp3Data = [];
                    for (let i = 0; i < samples.length; i += sampleBlockSize) {
                        const sampleChunk = samples.subarray(i, i + sampleBlockSize);
                        const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
                        if (mp3buf.length > 0) mp3Data.push(new Int8Array(mp3buf));
                    }
                    const mp3buf = mp3encoder.flush();
                    if (mp3buf.length > 0) mp3Data.push(new Int8Array(mp3buf));
                    blob = new Blob(mp3Data, { type: 'audio/mp3' });
                    break;
                case 'ogg':
                    if (!window.Oggmented) throw new Error("OGG encoding library not loaded.");
                    const oggEncoder = new window.Oggmented.OggmentedEncoder(audioBuffer.numberOfChannels, audioBuffer.sampleRate, oggQuality);
                    const pcmChannelsOgg = [];
                    for (let i = 0; i < audioBuffer.numberOfChannels; i++) pcmChannelsOgg.push(audioBuffer.getChannelData(i));
                    oggEncoder.encode(pcmChannelsOgg);
                    const oggData = oggEncoder.finish();
                    blob = new Blob(oggData, { type: 'audio/ogg' });
                    break;
                case 'flac':
                     if (!window.FLAC) throw new Error("FLAC encoding library not loaded.");
                    const channels = [];
                    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
                        const channelData = audioBuffer.getChannelData(i);
                        const int32Channel = new Int32Array(channelData.length);
                        for (let j = 0; j < channelData.length; j++) {
                            int32Channel[j] = Math.max(-0x80000000, Math.min(0x7FFFFFFF, channelData[j] * 0x80000000));
                        }
                        channels.push(int32Channel);
                    }
                    const flacData = window.FLAC.encode(channels, audioBuffer.sampleRate, 16);
                    blob = new Blob([flacData], { type: 'audio/flac' });
                    break;
                case 'wav':
                    blob = createWavBlob(audioBuffer);
                    break;
                case 'aiff':
                    blob = createAiffBlob(audioBuffer);
                    break;
                default:
                    throw new Error("Unsupported output format.");
            }

            setResult({ url: URL.createObjectURL(blob), name: outputName });
            trackGtagEvent('tool_used', {
                'tool_name': 'Audio Format Converter',
                'tool_category': 'File Converters & Utilities',
                'output_format': outputFormat,
            });

        } catch (err: any) {
            console.error(err);
            setError(`Conversion failed: ${err.message}. The file might be corrupted or in an unsupported format.`);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    
    const createWavBlob = (audioBuffer: AudioBuffer): Blob => {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const bitDepth = 16;
        const numSamples = audioBuffer.length;
        
        const buffer = new ArrayBuffer(44 + numSamples * numChannels * (bitDepth / 8));
        const view = new DataView(buffer);

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + numSamples * numChannels * (bitDepth / 8), true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
        view.setUint16(32, numChannels * (bitDepth / 8), true);
        view.setUint16(34, bitDepth, true);
        writeString(view, 36, 'data');
        view.setUint32(40, numSamples * numChannels * (bitDepth / 8), true);

        let offset = 44;
        for (let i = 0; i < numSamples; i++) {
            for (let channel = 0; channel < numChannels; channel++) {
                const sample = audioBuffer.getChannelData(channel)[i];
                view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
                offset += 2;
            }
        }
        return new Blob([view], { type: 'audio/wav' });
    }
    
    const createAiffBlob = (audioBuffer: AudioBuffer): Blob => {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const bitDepth = 16;
        const numSamples = audioBuffer.length;
        
        const dataSize = numSamples * numChannels * (bitDepth / 8);
        const buffer = new ArrayBuffer(54 + dataSize);
        const view = new DataView(buffer);
        
        writeString(view, 0, 'FORM');
        view.setUint32(4, 46 + dataSize, false); // Big-endian
        writeString(view, 8, 'AIFF');
        writeString(view, 12, 'COMM');
        view.setUint32(16, 18, false); // COMM chunk size
        view.setUint16(20, numChannels, false);
        view.setUint32(22, numSamples, false);
        view.setUint16(26, bitDepth, false);
        // AIFF sample rate is an 80-bit float, we'll write a common simplified version
        view.setUint16(28, 16414, false); // Exponent for 44100 Hz
        view.setUint32(30, 1132462080, false); // High mantissa
        view.setUint32(34, 0, false); // Low mantissa

        writeString(view, 38, 'SSND');
        view.setUint32(42, 8 + dataSize, false);
        view.setUint32(46, 0, false); // offset
        view.setUint32(50, 0, false); // block size

        let offset = 54;
        for (let i = 0; i < numSamples; i++) {
            for (let channel = 0; channel < numChannels; channel++) {
                const sample = audioBuffer.getChannelData(channel)[i];
                view.setInt16(offset, (sample < 0 ? sample * 0x8000 : sample * 0x7FFF), false); // Big-endian
                offset += 2;
            }
        }
        return new Blob([view], { type: 'audio/aiff' });
    }
    
    if (!isReady) {
        return (
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border min-h-[300px]">
                <LoaderIcon className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Initializing Audio Engine...</h2>
                <p className="text-gray-600">{status}</p>
                {error && <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</p>}
            </div>
        );
    }


    if (result) {
        return (
            <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-xl font-bold text-gray-800">Conversion Complete!</h3>
                <p className="text-gray-600">Your file is ready to be downloaded.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                    <a href={result.url} download={result.name} className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                        <DownloadIcon className="w-5 h-5" /> Download {result.name}
                    </a>
                    <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">Convert Another</button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
             {isProcessing ? (
                <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                    <p className="text-lg font-semibold text-gray-700 mt-4">Converting audio...</p>
                </div>
            ) : !file ? (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['audio/*']} title="Upload an audio file" description="Supports WAV, MP3, M4A, FLAC, OGG and more." />
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border rounded-lg flex items-center justify-between">
                        <p className="font-semibold text-gray-800 truncate">{file.name}</p>
                        <button onClick={handleReset} className="text-sm text-blue-600 hover:underline font-medium flex-shrink-0 ml-4">Change file</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Convert to:</label>
                            <select value={outputFormat} onChange={e => setOutputFormat(e.target.value as OutputFormat)} className="w-full p-2 border-gray-300 rounded-md">
                                <option value="mp3">MP3</option>
                                <option value="wav">WAV</option>
                                <option value="ogg">OGG</option>
                                <option value="flac">FLAC</option>
                                <option value="aiff">AIFF</option>
                            </select>
                        </div>
                        {outputFormat === 'mp3' && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">MP3 Bitrate:</label>
                                <select value={mp3Bitrate} onChange={e => setMp3Bitrate(Number(e.target.value))} className="w-full p-2 border-gray-300 rounded-md">
                                    <option value={96}>96 kbps (Voice)</option>
                                    <option value={128}>128 kbps (Standard)</option>
                                    <option value={192}>192 kbps (High Quality)</option>
                                    <option value={320}>320 kbps (Best Quality)</option>
                                </select>
                            </div>
                        )}
                        {outputFormat === 'ogg' && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">OGG Quality: {oggQuality.toFixed(1)}</label>
                                 <input type="range" min="-0.1" max="1.0" step="0.1" value={oggQuality} onChange={e => setOggQuality(Number(e.target.value))} className="w-full mt-2" />
                            </div>
                        )}
                    </div>
                    
                    <button onClick={handleConvert} className="w-full px-8 py-3 bg-blue-600 text-white text-md font-bold rounded-lg hover:bg-blue-700 transition">
                      Convert File
                    </button>
                    {error && <p className="text-red-600 text-center text-sm p-2 bg-red-50 rounded-lg">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default AudioFormatConverter;