import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    label?: string;
}

export const CustomSelect = ({ value, onChange, options, label }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            {label && (
                <label className="block text-sm font-semibold text-text-header mb-2.5 dark:text-neutral-300">
                    {label}
                </label>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 bg-bg-card border-2 rounded-xl text-left transition-all duration-200 ${isOpen
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border-light hover:border-border dark:border-neutral-600 dark:hover:border-neutral-500'
                    } dark:bg-neutral-800 dark:text-neutral-50`}
            >
                <span className="font-medium truncate block">
                    {selectedOption?.label || value}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-text-muted transition-transform duration-200 ${isOpen ? 'transform rotate-180 text-primary' : ''
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-bg-card dark:bg-neutral-800 border border-border-light dark:border-neutral-700 rounded-xl shadow-xl overflow-hidden animate-slide-down">
                    <div className="max-h-60 overflow-y-auto sidebar-scroll p-1.5">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${value === option.value
                                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                                        : 'text-text-body hover:bg-bg-hover dark:text-neutral-200 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                <span>{option.label}</span>
                                {value === option.value && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
