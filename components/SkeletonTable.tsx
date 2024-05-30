import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Props = {
    length?: number;
}

const SkeletonTable = ({ length = 5 }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80%]">
                        <Skeleton className="w-full h-[20px] rounded-full" />
                    </TableHead>
                    <TableHead className="w-[20%] text-center">
                        <Skeleton className="w-full h-[20px] rounded-full" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(length)].map((index) => (
                    <TableRow key={index}>
                        <TableCell className="w-[80%] flex gap-4">
                            <Skeleton className="w-full h-[20px] rounded-full" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="w-full h-[20px] rounded-full" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default SkeletonTable