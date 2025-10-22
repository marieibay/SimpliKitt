
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { trackGtagEvent } from '../../analytics';

type CalcType = 'percentOf' | 'isWhatPercent' | 'increaseDecrease';

const PercentageCalculator: React.FC = () => {
    const [calcType, setCalcType] = useState<CalcType>('percentOf');
    const [valA, setValA] = useState('');
    const [valB, setValB] = useState('');
    const hasTrackedRef = useRef(false);

    const result = useMemo(() => {
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
        if (isNaN(numA) || isNaN(numB)) {
            hasTrackedRef.current = false;
            return null;
        }

        try {
            switch (calcType) {
                case 'percentOf':
                    return (numA / 100) * numB;
                case 'isWhatPercent':
                    if (numB === 0) return 'Cannot divide by zero';
                    return (numA / numB) * 100;
                case 'increaseDecrease':
                    const change = numB - numA;
                    if (numA === 0) return 'Cannot calculate from zero';
                    return (change / numA) * 100;
                default:
                    return null;
            }
        } catch {
            return 'Calculation error';
        }
    }, [calcType, valA, valB]);

    useEffect(() => {
        if (result !== null && typeof result === 'number' && !hasTrackedRef.current) {
            trackGtagEvent('tool_used', {
                event_category: 'Calculators & Time Tools',
                event_label: 'Percentage Calculator',
                tool_name: 'percentage-calculator',
                is_download: false,
                calc_mode: calcType
            });
            hasTrackedRef.current = true;
        }
    }, [result, calcType]);
    
    const handleTabClick = (type: CalcType) => {
        setCalcType(type);
        setValA('');
        setValB('');
    };

    const renderInputs = () => {
        const inputA = <input type="number" value={valA} onChange={e => setValA(e.target.value)} className="w-24 p-2 border-b-2 text-center text-lg font-semibold focus:outline-none focus:border-blue-500 bg-transparent" />;
        const inputB = <input type="number" value={valB} onChange={e => setValB(e.target.value)} className="w-24 p-2 border-b-2 text-center text-lg font-semibold focus:outline-none focus:border-blue-500 bg-transparent" />;
        
        return (
            <div className="flex flex-wrap items-center justify-center gap-2 text-lg">
                {calcType === 'percentOf' && <>What is {inputA} % of {inputB} ?</>}
                {calcType === 'isWhatPercent' && <>{inputA} is what percent of {inputB} ?</>}
                {calcType === 'increaseDecrease' && <>What is the % change from {inputA} to {inputB} ?</>}
            </div>
        );
    };
    
    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="flex border-b">
                <button onClick={() => handleTabClick('percentOf')} className={`flex-1 p-3 text-sm font-medium ${calcType === 'percentOf' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>Percent of</button>
                <button onClick={() => handleTabClick('isWhatPercent')} className={`flex-1 p-3 text-sm font-medium ${calcType === 'isWhatPercent' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>X is % of Y</button>
                <button onClick={() => handleTabClick('increaseDecrease')} className={`flex-1 p-3 text-sm font-medium ${calcType === 'increaseDecrease' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>Change %</button>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
                {renderInputs()}
            </div>
            {result !== null && (
                 <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-lg font-semibold text-gray-800 mb-1">Result</p>
                    <p className="text-4xl font-bold text-blue-600 break-all">
                        {typeof result === 'number' ? result.toLocaleString(undefined, { maximumFractionDigits: 4 }) : result}
                        {typeof result === 'number' && (calcType === 'isWhatPercent' || calcType === 'increaseDecrease') ? '%' : ''}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PercentageCalculator;
