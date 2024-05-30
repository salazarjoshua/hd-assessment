"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { PutBlobResult } from '@vercel/blob';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import FileList from './FileList';
import { toast } from "sonner"

const FileUpload: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [errorFiles, setErrorFiles] = useState<string[] | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [dogImage, setDogImage] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [blobs, setBlobs] = useState<PutBlobResult[]>([]);

    // Load blobs from localStorage on component mount
    useEffect(() => {
        const storedBlobs = localStorage.getItem('blobs');
        if (storedBlobs) {
            const parsedBlobs = JSON.parse(storedBlobs);
            if (Array.isArray(parsedBlobs)) {
                setBlobs(parsedBlobs);
                console.log("Loaded blobs from localStorage:", parsedBlobs);
            } else {
                console.error("Invalid blobs format in localStorage");
            }
        }
    }, []);

    // Update localStorage whenever blobs state changes
    useEffect(() => {
        if (blobs.length > 0) {
            localStorage.setItem('blobs', JSON.stringify(blobs));
            console.log("Updated localStorage with blobs:", blobs);
        } else {
            localStorage.removeItem('blobs'); // Remove the 'blobs' item if the array is empty
            console.log("Removed blobs from localStorage");
        }
    }, [blobs]);


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
            toast.error('Error fetching dog image', {
                description: `${error}`,
            });
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
            toast("Uploading ⌛️");

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

            setBlobs((prevBlobs) => [...prevBlobs, ...uploadedBlobs]);

            // Uploading done: fetch a new dog image
            const successDogImage = await fetchDogImage();
            setDogImage(successDogImage);
            toast.success("Upload done");

            // Clear files after successful upload
            setFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset the input after successful upload
            }
        } catch (error) {
            // Uploading error: fetch a new dog image
            const failDogImage = await fetchDogImage();
            setDogImage(failDogImage);
            toast.error('Upload failed');
            setStatusMessage('Upload failed');
            setErrorFiles(['Upload failed. Please try again.']);
            setIsOpen(true);
        }
    };

    const handleDeleteBlob = (url: string) => {
        setBlobs((prevBlobs) => prevBlobs.filter(blob => blob.url !== url));
    };

    const handleRenameBlob = (oldUrl: string, newBlob: PutBlobResult) => {
        setBlobs((prevBlobs) => {
            const updatedBlobs = prevBlobs.map(blob =>
                blob.url === oldUrl ? newBlob : blob
            );
            localStorage.setItem('blobs', JSON.stringify(updatedBlobs));
            return updatedBlobs;
        });
    };

    return (
        <>
        <div className='w-full max-w-[600px] flex flex-col gap-4'>
            <form className="flex gap-4 mx-auto" onSubmit={handleUpload}>
                <Input type="file" multiple onChange={handleFileChange} ref={fileInputRef} />
                <Button disabled={files.length === 0} type='submit'>Upload</Button>
            </form>

            {blobs.length > 0 && <FileList blobs={blobs} onDeleteBlob={handleDeleteBlob} onRename={handleRenameBlob} />}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger />
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Upload Error</DialogTitle>
                        <DialogDescription>
                            {statusMessage === 'Upload failed' ?
                                null
                                :
                                <p>These files are over 5MB:</p>
                            }

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
        {dogImage && (
                <Image src={dogImage} alt="Dog" className="fixed bottom-4 right-4 size-20 md:size-40 object-cover bg-slate-100 rounded-lg" width={128} height={128} />
            )}
        </>
    );
};

export default FileUpload;
