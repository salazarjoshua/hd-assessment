import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

type Props = {
    downloadUrl: string;
}

const DownloadButton = ({downloadUrl}: Props) => {

    return (
        <Button variant="outline" size="icon" asChild>
            <Link href={downloadUrl}>
                <ArrowDownTrayIcon className="size-4" />
            </Link>
        </Button>
    )
}

export default DownloadButton