import React, { useState, useMemo, useRef, useEffect } from 'react';
import { trackEvent, trackGtagEvent } from '../../analytics';

const units = {
    'Bytes': 1,
    'Kilobytes (KB)': 1024,
    'Megabytes (MB)': 1024 ** 2,
    'Gigabytes (GB)': 1024 ** 3,
    'Terabytes (TB)': 1024 ** 4,
};
type Unit = keyof typeof units;

const FileSizeConverter: React.FC = () => {
    const [fromUnit, setFromUnit] = useState<Unit>('Megabytes (MB)');
    const [toUnit, setToUnit] = useState<Unit>('Kilobytes (KB)');
    const [fromValue, setFromValue] = useState('1');
    const hasTrackedRef = useRef(false);

    const toValue = useMemo(() => {
        const from = parseFloat(fromValue);
        if (isNaN(from)) {
            hasTrackedRef.current = false;
            return '';
        }
        const valueInBytes = from * units[fromUnit];
        const result = valueInBytes / units[toUnit];
        trackEvent('file_size_converted');
        if (!hasTrackedRef.current) {
            trackGtagEvent('tool_used', {
                event_category: 'File Converters & Utilities',
                event_label: 'File Size Converter',
                tool_name: 'file-size-converter',
            });
            hasTrackedRef.current = true;
        }
        return result.toLocaleString(undefined, {maximumFractionDigits: 6});
    }, [fromValue, fromUnit, toUnit]);

    useEffect(() => {
        // Reset tracking when inputs change to capture new usage sessions
        hasTrackedRef.current = false;
    }, [fromValue, fromUnit, toUnit]);

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">From</label>
                    <input type="number" value={fromValue} onChange={e => setFromValue(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md" />
                    <select value={fromUnit} onChange={e => setFromUnit(e.target.value as Unit)} className="w-full p-2 mt-1 border-gray-300 rounded-md">
                        {Object.keys(units).map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
                <div className="text-center font-bold text-2xl">=</div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">To</label>
                    <input type="text" readOnly value={toValue} className="w-full p-2 mt-1 border-gray-300 rounded-md bg-gray-100" />
                    <select value={toUnit} onChange={e => setToUnit(e.target.value as Unit)} className="w-full p-2 mt-1 border-gray-300 rounded-md">
                        {Object.keys(units).map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FileSizeConverter;