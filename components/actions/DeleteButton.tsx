'use client'
import React from 'react'
import { Button } from '../ui/button'
import { TrashIcon } from '@heroicons/react/24/outline'
import { toast } from "sonner"

type Props = {
    url: string;
}

const DeleteButton = ({ url }: Props) => {
    const handleDelete = async () => {
        try {
            await fetch(`/api/file`, {
                method: "DELETE",
                body: JSON.stringify({
                    url
                })
            });
        } catch (error) {
            // console.error('Error deleting file:', error);
            toast.error('Error deleting file:', {
                description: `${error}`,
            })
        }

    }
    return (
        <Button onClick={handleDelete} variant="outline" size="icon" className="hover:bg-red-500 hover:text-white">
            <TrashIcon className="size-4" />
        </Button>
    )
}

export default DeleteButton