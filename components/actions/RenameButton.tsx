'use client'
import React, { useState } from 'react';
import { Button } from '../ui/button'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
    pathname: string;
    fromUrl: string;
}

const RenameButton = ({pathname, fromUrl} : Props) => {
    const [newName, setNewName] = useState(pathname);

    const handleRename = async () => {
        await fetch(`/api/rename`, {
            method: "PUT",
            body: JSON.stringify({
                fromUrl: fromUrl,
                toPathname: newName,
            })
        })

        handleDelete(fromUrl)

    }

    const handleDelete = async (url: string) => {
        await fetch(`/api/file`, {
            method: "DELETE",
            body: JSON.stringify({
                url,
            })
        })

    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <PencilSquareIcon className="size-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Rename file</DialogTitle>
                        <DialogDescription>
                            Rename your file here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                File Name
                            </Label>
                            <Input
                                id="name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="button" onClick={handleRename}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default RenameButton