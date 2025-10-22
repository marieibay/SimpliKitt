
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { trackGtagEvent } from '../../analytics';

const units = {
    length: {
        meter: 1,
        kilometer: 1000,
        centimeter: 0.01,
        millimeter: 0.001,
        mile: 1609.34,
        yard: 0.9144,
        foot: 0.3048,
        inch: 0.0254,
    },
    mass: {
        gram: 1,
        kilogram: 1000,
        milligram: 0.001,
        pound: 453.592,
        ounce: 28.3495,
    },
    volume: {
        liter: 1,
        milliliter: 0.001,
        gallon: 3.78541,
        quart: 0.946353,
        pint: 0.473176,
        cup: 0.236588,
    },
};

type Category = keyof typeof units;
type Unit<C extends Category> = keyof typeof units[C];

const UnitConverter: React.FC = () => {
    const [category, setCategory] = useState<Category>('length');
    const [fromUnit, setFromUnit] = useState<keyof typeof units['length']>('meter');
    const [toUnit, setToUnit] = useState<keyof typeof units['length']>('foot');
    const [fromValue, setFromValue] = useState('1');
    const hasTrackedRef = useRef<boolean>(false);
    
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value as Category;
        setCategory(newCategory);
        const newUnits = Object.keys(units[newCategory]);
        setFromUnit(newUnits[0] as any);
        setToUnit(newUnits[1] as any);
    };

    const toValue = useMemo(() => {
        const from = parseFloat(fromValue);
        if (isNaN(from)) {
            hasTrackedRef.current = false;
            return '';
        }

        const fromFactor = units[category][fromUnit as Unit<typeof category>];
        const toFactor = units[category][toUnit as Unit<typeof category>];
        
        const valueInBase = from * fromFactor;
        const result = valueInBase / toFactor;
        
        return result.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }, [fromValue, fromUnit, toUnit, category]);

    useEffect(() => {
        if (toValue !== '' && !hasTrackedRef.current) {
            trackGtagEvent('tool_used', {
                event_category: 'Calculators & Time Tools',
                event_label: 'Unit Converter',
                tool_name: 'unit-converter',
                is_download: false,
                category: category,
                from_unit: fromUnit,
                to_unit: toUnit,
            });
            hasTrackedRef.current = true;
        }
    }, [toValue, category, fromUnit, toUnit]);

    useEffect(() => {
        hasTrackedRef.current = false;
    }, [fromValue, fromUnit, toUnit, category]);

    const unitOptions = Object.keys(units[category]);

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div>
                <label className="block text-sm font-medium">Category</label>
                <select value={category} onChange={handleCategoryChange} className="w-full p-2 mt-1 border-gray-300 rounded-md">
                    {Object.keys(units).map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">From</label>
                    <input type="number" value={fromValue} onChange={e => setFromValue(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md" />
                    <select value={fromUnit} onChange={e => setFromUnit(e.target.value as any)} className="w-full p-2 mt-1 border-gray-300 rounded-md">
                        {unitOptions.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
                <div className="text-center font-bold text-2xl">=</div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">To</label>
                    <input type="text" readOnly value={toValue} className="w-full p-2 mt-1 border-gray-300 rounded-md bg-gray-100" />
                     <select value={toUnit} onChange={e => setToUnit(e.target.value as any)} className="w-full p-2 mt-1 border-gray-300 rounded-md">
                        {unitOptions.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default UnitConverter;
