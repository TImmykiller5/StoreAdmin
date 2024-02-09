"use client";
import React, { useState } from 'react'
import { ProductColumn } from './columns';
import { Button } from '@/components/ui/button';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { DropdownMenuContent, DropdownMenu,  DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel  } from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import AlertModal from '@/components/modals/alert-modals';
interface CellActionProps {
    data: ProductColumn
}



const CellAction: React.FC<CellActionProps> = (
    { data }
) => {
    const router = useRouter()
    const params = useParams() 
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const onCopy = (id: string) => {
        navigator.clipboard.writeText(data.id)
        toast.success('Product ID Copied to clipboard')
    }
    const onDelete = async (id: string) => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/products/${id}`)
            router.refresh()
            toast.success('Product deleted!')
        } catch (error) {
            toast.error('Something went wrong')
        }finally{
            setLoading(false)
            setOpen(false)
        }   
    }
  return (
    <>
        <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete(data.id)}
        loading={loading}
        />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className='h-8 w-8 p-0'>
                    <span className='sr-only'>Open menu</span>
                    <MoreHorizontal className=" h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>
                    <Edit className='mr-2 h-4 w-4' /> Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopy(data.id)}>
                    <Copy className='mr-2 h-4 w-4' />Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className='mr-2 h-4 w-4' />Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
  )
}

export default CellAction