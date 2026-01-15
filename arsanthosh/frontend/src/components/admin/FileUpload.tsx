"use client";

import { useState, useRef } from "react";
import { uploadFile, supabase } from "@/utils/supabase";
import { useToast } from "@/context/ToastContext";

interface FileUploadProps {
    onUploadComplete: (urls: string[]) => void;
    label: string;
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number; // In bytes
}

export default function FileUpload({
    onUploadComplete,
    label,
    accept = "image/*",
    multiple = true,
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024 // Default 50MB
}: FileUploadProps) {
    const { showToast } = useToast();
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        // Validation limits
        if (maxFiles === 0) {
            showToast("You have reached the maximum number of files for this section.", "warning");
            return;
        }

        if (files.length > maxFiles) {
            showToast(`You can only upload ${maxFiles} more file(s).`, "warning");
            return;
        }

        // Size validation
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > maxSize) {
                showToast(`File ${files[i].name} exceeds the ${Math.round(maxSize / (1024 * 1024))}MB limit.`, "warning");
                return;
            }
        }

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
            showToast(`${total} file(s) uploaded successfully!`);
        } catch (error: any) {
            console.error("Upload error:", error);
            showToast(error.message || "Upload failed. Make sure Supabase is configured correctly.", "error");
        } finally {
            setIsUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{label}</label>
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-sm p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${isDragging ? "border-[var(--primary)] bg-gray-50 shadow-inner" : "border-gray-100 hover:border-[var(--primary)]/30 bg-gray-50/50"
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

                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                    <svg className={`w-6 h-6 ${isDragging ? "text-[var(--primary)]" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>

                <div className="text-center">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        {isUploading ? `Uploading ${progress}%` : "Drop files here or click to browse"}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest font-bold">
                        Images or Videos
                    </p>
                </div>
            </div>

            {isUploading && (
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-[var(--primary)] h-full transition-all duration-300 shadow-[0_0_8px_rgba(197,168,128,0.5)]" style={{ width: `${progress}%` }} />
                </div>
            )}
        </div>
    );
}
