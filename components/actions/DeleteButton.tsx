'use client'
import React from 'react'
import { Button } from '../ui/button'
import { TrashIcon } from '@heroicons/react/24/outline'
import { toast } from "sonner"

type Props = {
    url: string;
    onDelete: (url: string) => void;
}

const DeleteButton = ({ url, onDelete }: Props) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/file`, {
                method: "DELETE",
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            // Call the onDelete callback to update the parent state
            onDelete(url);

            toast.success('File deleted successfully');
        } catch (error) {
            toast.error('Error deleting file:', {
                description: `${error}`,
            });
        }
    }
    
    return (
        <Button onClick={handleDelete} variant="outline" size="icon" className="hover:bg-red-500 hover:text-white">
            <TrashIcon className="size-4" />
        </Button>
    )
}

export default DeleteButton