"use client";

import { useState, useRef } from "react";
import { uploadFile } from "@/utils/supabase";

interface FileUploadProps {
    onUploadComplete: (urls: string[]) => void;
    label: string;
    accept?: string;
    multiple?: boolean;
}

export default function FileUpload({ onUploadComplete, label, accept = "image/*", multiple = true }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const urls: string[] = [];
        const total = files.length;

        try {
            for (let i = 0; i < total; i++) {
                const url = await uploadFile(files[i]);
                urls.push(url);
                setProgress(Math.round(((i + 1) / total) * 100));
            }
            onUploadComplete(urls);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed. Make sure Supabase is configured correctly.");
        } finally {
            setIsUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</label>
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-sm p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${isDragging ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                    } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept={accept}
                    multiple={multiple}
                    onChange={(e) => handleFiles(e.target.files)}
                />

                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className={`w-6 h-6 ${isDragging ? "text-[var(--accent)]" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>

                <div className="text-center">
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                        {isUploading ? `Uploading ${progress}%` : "Drop files here or click to browse"}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Images or Videos</p>
                </div>
            </div>

            {isUploading && (
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-[var(--accent)] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            )}
        </div>
    );
}
