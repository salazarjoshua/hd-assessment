import React from 'react'
import { Button } from '../ui/button'
import { PencilSquareIcon } from '@heroicons/react/24/outline'

const RenameButton = () => {

    return (
        <Button variant="outline" size="icon">
            <PencilSquareIcon className="size-4" />
        </Button>
    )
}

export default RenameButton