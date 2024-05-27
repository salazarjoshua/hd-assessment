// components/FileUpload.tsx
"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"



const FileUpload: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [errorFiles, setErrorFiles] = useState<string[] | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [dogImage, setDogImage] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');
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


    const fetchDogImage = async () => {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            return data.message;
        } catch (error) {
            console.error('Error fetching dog image:', error);
            return null;
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        try {
            // Uploading begins: fetch a dog image
            const startDogImage = await fetchDogImage();
            setDogImage(startDogImage);
            setStatusMessage('Uploading ⌛️');
            await new Promise(resolve => setTimeout(resolve, 3000)); // Add delay

            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
            }

            // Uploading done: fetch a new dog image
            const successDogImage = await fetchDogImage();
            setDogImage(successDogImage);
            setStatusMessage('Upload done ✅');
            await new Promise(resolve => setTimeout(resolve, 3000)); // Add delay

            // Clear files after successful upload
            setFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset the input after successful upload
            }
        } catch (error) {
            // Uploading error: fetch a new dog image
            const failDogImage = await fetchDogImage();
            setDogImage(failDogImage);
            setStatusMessage('Upload failed ⚠️❌🚨');
            await new Promise(resolve => setTimeout(resolve, 3000)); // Add delay
            setErrorFiles(['Upload failed. Please try again.']);
            setIsOpen(true);
        }
    };

    return (
        <div>
            <div className="flex gap-4">
                <Input type="file" multiple onChange={handleFileChange} ref={fileInputRef} />
                <Button onClick={handleUpload} disabled={files.length === 0}>Upload</Button>
            </div>
            {dogImage && (
                <div className="mt-4 flex items-center justify-center flex-col">
                    <Image src={dogImage} 
                    alt="Dog" className="w-40 h-40 object-cover bg-slate-100 rounded-xl" 
                    width={128}
                    height={128}                    />
                    <p>{statusMessage}</p>
                </div>
            )}
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
