"use client"

import React, { useEffect, useState } from 'react'
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';

interface AlertModalsProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

const AlertModal: React.FC<AlertModalsProps> = (
  {isOpen, onClose, onConfirm, loading}
) => {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
        return () => setIsMounted(false)
    }, [])
    if (!isMounted) {
        return null
    }
  return (
    <Modal title='Are You sure' description='This action cannot be undone' isOpen={isOpen} onClose={onClose}>
        <div className='flex pt-6 space-x-2 items-center justify-end w-full'>
            <Button variant='outline' onClick={onClose} disabled={loading}>
                Cancel
            </Button>
            <Button variant='destructive' onClick={onConfirm} disabled={loading}>
                Delete
            </Button>
        </div>
    </Modal>
  )
}

export default AlertModal
