import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { PutBlobResult } from '@vercel/blob';
import Link from "next/link"
import Image from "next/image";
import { Button } from "./ui/button"
import { PencilSquareIcon } from '@heroicons/react/24/outline'

interface FileListProps {
    blobs: PutBlobResult[];
}


const FileList: React.FC<FileListProps> = ({ blobs }) => {
    return (
        <Table>
            <TableCaption>A list of your uploaded images.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-full">File Name</TableHead>
                    <TableHead>Rename</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {blobs.map((blob, index) => (
                    <TableRow key={index}>
                        <TableCell className="flex gap-4">
                            <Image
                            src={blob.url}
                            alt=""
                            width={40}
                            height={40}
                            className="size-10"
                            />
                            <a href={blob.url}>{blob.url}</a>
                        </TableCell>
                        <TableCell>
                            <Button variant="outline" size="icon" className="flex mx-auto">
                                <PencilSquareIcon className="size-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default FileList