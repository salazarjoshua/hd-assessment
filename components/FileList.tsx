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
import DownloadButton from "./actions/DownloadButton";
import DeleteButton from "./actions/DeleteButton";
import RenameButton from "./actions/RenameButton";
import Link from "next/link";

interface FileListProps {
    blobs: PutBlobResult[];
    onDeleteBlob: (url: string) => void;
    onRename: (oldUrl: string, newBlob: PutBlobResult) => void;
}

const FileList: React.FC<FileListProps> = ({ blobs, onDeleteBlob, onRename }) => {
    console.log("FileList received blobs:", blobs);

    return (
        <>
            <Table>
                <TableCaption>A list of your uploaded files.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80%]">Files</TableHead>
                        <TableHead className="w-[20%] text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {blobs.map((blob, index) => (
                        <TableRow key={index}>
                            <TableCell className="w-[80%] flex gap-4">
                                <Link href={blob.url}>{blob.pathname}</Link>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-4 items-center justify-center">
                                    <DownloadButton downloadUrl={blob.downloadUrl} />
                                    <RenameButton pathname={blob.pathname} fromUrl={blob.url} onRename={onRename} />
                                    <DeleteButton url={blob.url} onDelete={onDeleteBlob} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default FileList;
