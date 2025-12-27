"use client";

import { useState, useRef, useEffect } from "react";

interface CustomDatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export default function CustomDatePicker({ value, onChange, label, placeholder, required, className }: CustomDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleDateSelect = (day: number) => {
        const year = viewDate.getFullYear();
        const month = String(viewDate.getMonth() + 1).padStart(2, '0');
        const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
        onChange(dateStr);
        setIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() + offset);
        setViewDate(newDate);
    };

    const renderDays = () => {
        const totalDays = daysInMonth(viewDate.getMonth(), viewDate.getFullYear());
        const startDay = firstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear());
        const days = [];

        // Padding for start of month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`pad-${i}`} className="h-8 md:h-10" />);
        }

        for (let d = 1; d <= totalDays; d++) {
            const isSelected = value === `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            days.push(
                <button
                    key={d}
                    type="button"
                    onClick={() => handleDateSelect(d)}
                    className={`h-8 md:h-10 flex items-center justify-center text-[10px] md:text-xs font-bold transition-all
                        ${isSelected ? 'bg-[var(--primary)] text-white shadow-md rounded-sm' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                    {d}
                </button>
            );
        }
        return days;
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {label && <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">{label}</label>}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 bg-gray-50 border border-gray-100 focus-within:border-[var(--primary)] outline-none text-sm font-bold transition-all cursor-pointer flex justify-between items-center group"
            >
                <span className={value ? "text-gray-900" : "text-gray-400 font-normal italic"}>
                    {value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : (placeholder || "Select Date")}
                </span>
                <svg className={`w-4 h-4 text-gray-400 group-hover:text-[var(--primary)] transition-colors ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-gray-100 shadow-2xl p-4 md:p-6 animate-in slide-in-from-top-2 duration-300 min-w-[280px]">
                    {/* Calendar Header */}
                    <div className="flex justify-between items-center mb-6">
                        <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <div className="flex gap-2 items-center">
                            <select
                                value={viewDate.getMonth()}
                                onChange={(e) => {
                                    const next = new Date(viewDate);
                                    next.setMonth(parseInt(e.target.value));
                                    setViewDate(next);
                                }}
                                className="text-[10px] font-black uppercase tracking-widest bg-transparent border-none outline-none cursor-pointer hover:text-[var(--primary)]"
                            >
                                {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                            </select>
                            <select
                                value={viewDate.getFullYear()}
                                onChange={(e) => {
                                    const next = new Date(viewDate);
                                    next.setFullYear(parseInt(e.target.value));
                                    setViewDate(next);
                                }}
                                className="text-[10px] font-black uppercase tracking-widest bg-transparent border-none outline-none cursor-pointer hover:text-[var(--primary)]"
                            >
                                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 80 + i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* Weekdays */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="h-8 flex items-center justify-center text-[8px] font-black text-gray-400 uppercase tracking-widest">{day}</div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-1">
                        {renderDays()}
                    </div>

                    {/* Calendar Footer */}
                    <div className="mt-8 pt-4 border-t border-gray-50 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => {
                                const today = new Date();
                                onChange(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
                                setIsOpen(false);
                            }}
                            className="text-[9px] font-black uppercase tracking-widest text-[var(--primary)] hover:underline"
                        >
                            Select Today
                        </button>
                        <button
                            type="button"
                            onClick={() => { onChange(""); setIsOpen(false); }}
                            className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:underline"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
            <input type="hidden" value={value} required={required} />
        </div>
    );
}
