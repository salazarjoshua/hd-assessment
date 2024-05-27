import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

type Props = {
    url: string;
}

const DownloadButton = ({url}: Props) => {

    return (
        <Button variant="outline" size="icon" asChild>
            <Link href={url} target="_blank">
                <ArrowDownTrayIcon className="size-4" />
            </Link>
        </Button>
    )
}

export default DownloadButton