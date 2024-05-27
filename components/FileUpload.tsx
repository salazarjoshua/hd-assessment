// components/FileUpload.tsx
"use client";

import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"



const FileUpload: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [errorFiles, setErrorFiles] = useState<string[] | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        const validFiles = selectedFiles.filter(file => file.size <= 5 * 1024 * 1024);
        const invalidFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024).map(file => file.name);

        if (invalidFiles.length > 0) {
            setErrorFiles(invalidFiles);
            setFiles([]); // Clear the valid files if there are invalid files
            setIsOpen(true);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset the input to clear invalid files
            }
        } else {
            setErrorFiles([]);
            setFiles(validFiles);
        }
    };


    const handleUpload = async () => {
        console.log("uploading", files)
    };

    return (
        <div>
            <div className="flex gap-4">
                <Input type="file" multiple onChange={handleFileChange} ref={fileInputRef}/>
                <Button onClick={handleUpload} disabled={files.length === 0}>Upload</Button>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger />
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Upload Error</DialogTitle>
                        <DialogDescription>
                            <p>These files are over 5mb</p>
                            <ul className="list-disc list-inside">
                                {errorFiles?.map((file, index) =>
                                    <li key={index}>{file}</li>
                                )}
                            </ul>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FileUpload;
