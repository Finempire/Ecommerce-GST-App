'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX, FiCheck, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { uploadsApi, PLATFORMS } from '@/lib/api';

interface UploadedFile {
    file: File;
    id: string;
    status: 'pending' | 'uploading' | 'processing' | 'done' | 'error';
    progress: number;
    platform?: string;
    error?: string;
    uploadId?: string;
}

interface FileUploadProps {
    onUploadComplete?: () => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [selectedPlatform, setSelectedPlatform] = useState('Amazon');

    const uploadFile = async (uploadFile: UploadedFile) => {
        // Set to uploading
        setFiles((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 30 } : f))
        );

        try {
            // Upload to API
            const response = await uploadsApi.uploadFile(uploadFile.file, uploadFile.platform || 'Unknown');

            if (response.success && response.data) {
                // Set to processing
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === uploadFile.id
                            ? { ...f, status: 'processing', progress: 100, uploadId: response.data!.id }
                            : f
                    )
                );

                // Poll for completion
                const finalStatus = await uploadsApi.pollUploadStatus(
                    response.data.id,
                    (status) => {
                        if (status.status === 'completed') {
                            setFiles((prev) =>
                                prev.map((f) =>
                                    f.id === uploadFile.id ? { ...f, status: 'done' } : f
                                )
                            );
                        }
                    }
                );

                if (finalStatus.status === 'completed') {
                    onUploadComplete?.();
                } else if (finalStatus.status === 'failed') {
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === uploadFile.id
                                ? { ...f, status: 'error', error: finalStatus.error_message || 'Processing failed' }
                                : f
                        )
                    );
                }
            } else {
                throw new Error(response.error || 'Upload failed');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === uploadFile.id ? { ...f, status: 'error', error: errorMessage } : f
                )
            );
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map((file) => ({
            file,
            id: Math.random().toString(36).substring(7),
            status: 'pending' as const,
            progress: 0,
            platform: selectedPlatform,
        }));
        setFiles((prev) => [...prev, ...newFiles]);

        // Start upload for each file
        newFiles.forEach((file) => {
            uploadFile(file);
        });
    }, [selectedPlatform]);

    const removeFile = (fileId: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/json': ['.json'],
        },
    });

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Upload Files</h2>
                <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                    {PLATFORMS.map((p) => (
                        <option key={p.name} value={p.name}>
                            {p.icon} {p.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
            >
                <input {...getInputProps()} />
                <FiUploadCloud className="mx-auto text-4xl text-gray-400 mb-3" />
                <p className="text-gray-600 mb-1">
                    {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
                </p>
                <p className="text-gray-400 text-sm">or click to browse</p>
                <p className="text-gray-400 text-xs mt-2">
                    Supports: PDF, CSV, Excel, JSON
                </p>
            </div>

            {/* File List */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-2"
                    >
                        {files.map((file) => (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`flex items-center gap-3 p-3 rounded-lg ${file.status === 'error' ? 'bg-red-50' : 'bg-gray-50'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${file.status === 'error' ? 'bg-red-100' : 'bg-blue-100'
                                    }`}>
                                    {file.status === 'error' ? (
                                        <FiAlertCircle className="text-red-600" />
                                    ) : (
                                        <FiFile className="text-blue-600" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {file.file.name}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">{file.platform}</span>
                                        {file.status === 'uploading' && (
                                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 transition-all"
                                                    style={{ width: `${file.progress}%` }}
                                                />
                                            </div>
                                        )}
                                        {file.status === 'processing' && (
                                            <span className="text-xs text-yellow-600 flex items-center gap-1">
                                                <FiLoader className="animate-spin" size={12} />
                                                Processing...
                                            </span>
                                        )}
                                        {file.status === 'done' && (
                                            <span className="text-xs text-green-600 flex items-center gap-1">
                                                <FiCheck size={12} />
                                                Done
                                            </span>
                                        )}
                                        {file.status === 'error' && (
                                            <span className="text-xs text-red-600 flex items-center gap-1">
                                                <FiAlertCircle size={12} />
                                                {file.error || 'Error'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FiX />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
