
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
    onProcessFile: (file: File) => void;
    isLoading: boolean;
    loadingMessage: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onProcessFile, isLoading, loadingMessage }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onProcessFile(e.dataTransfer.files[0]);
        }
    }, [onProcessFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onProcessFile(e.target.files[0]);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-400"></div>
                <p className="mt-4 text-lg font-semibold text-slate-300">{loadingMessage}</p>
                 <p className="mt-2 text-sm text-slate-400">This may take a moment, please wait...</p>
            </div>
        );
    }
    
    return (
        <div className="flex items-center justify-center h-full p-4">
            <div 
                className={`w-full max-w-2xl p-10 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-sky-400 bg-slate-700/50' : 'border-slate-600 hover:border-sky-500'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center text-center cursor-pointer">
                    <UploadIcon className="w-16 h-16 text-slate-500 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-200">Drag & Drop your document image</h3>
                    <p className="text-slate-400 mt-1">or click to browse</p>
                    <p className="text-xs text-slate-500 mt-4">PNG, JPG, or WEBP files are supported.</p>
                </label>
            </div>
        </div>
    );
};
