// components/FileUpload.tsx
"use client";

import React, { useState, useRef } from 'react';
import type { PutBlobResult } from '@vercel/blob';
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import FileList from './FileList';



const FileUpload: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [errorFiles, setErrorFiles] = useState<string[] | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [dogImage, setDogImage] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [blobs, setBlobs] = useState<PutBlobResult[]>([]);

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

    const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (files.length === 0) return;

        try {
            // Uploading begins: fetch a dog image
            const startDogImage = await fetchDogImage();
            setDogImage(startDogImage);
            setStatusMessage('Uploading ⌛️');

            const uploadedBlobs: PutBlobResult[] = [];

            for (const file of files) {
                const response = await fetch(`/api/file?filename=${file.name}`, {
                    method: 'POST',
                    body: file,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const newBlob = (await response.json()) as PutBlobResult;
                uploadedBlobs.push(newBlob);
            }

            setBlobs(uploadedBlobs);

            // Uploading done: fetch a new dog image
            const successDogImage = await fetchDogImage();
            setDogImage(successDogImage);
            setStatusMessage('Upload done ✅');
            // await new Promise(resolve => setTimeout(resolve, 3000)); // Add delay

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
            setErrorFiles(['Upload failed. Please try again.']);
            setIsOpen(true);
        }
    };

    return (
        <div className='w-full max-w-[600px] flex flex-col gap-4'>
            <form className="flex gap-4 mx-auto" onSubmit={handleUpload}>
                <Input type="file" multiple onChange={handleFileChange} ref={fileInputRef} />
                <Button disabled={files.length === 0} type='submit'>Upload</Button>
            </form>

            {dogImage && (
                <div className="mt-4 flex items-center justify-center gap-4">
                    <Image src={dogImage} alt="Dog" className="size-10 object-cover bg-slate-100 rounded-lg" width={128} height={128} />
                    <p>{statusMessage}</p>
                </div>
            )}

            {blobs.length > 0 && <FileList blobs={blobs} />}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger />
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Upload Error</DialogTitle>
                        <DialogDescription>
                            <p>These files are over 5MB:</p>
                            <ul className="list-disc list-inside">
                                {errorFiles?.map((file, index) => (
                                    <li key={index}>{file}</li>
                                ))}
                            </ul>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FileUpload;