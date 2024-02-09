'use client'
import React, { useState } from 'react'
import Heading from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Size } from '@prisma/client'
import { Trash } from 'lucide-react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '@/components/modals/alert-modals'
import ImageUpload from '@/components/ui/image-upload'
interface SizeFormProps {
    initialData: Size | null
}
const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    value: z.string().min(1, 'Value is required'),
})
type settingFormValues = z.infer<typeof formSchema>


const SizeForm: React.FC<SizeFormProps> = ({
  initialData
}) => {
    const params = useParams()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const title = initialData ? 'Edit Size' : 'Add New Size'
    const description = initialData ? 'Edit your Size' : 'Add a new Size'
    const toastMessage = initialData ? 'Size updated!' : 'Size created!'
    const action = initialData ? 'Save Changes' : 'Create' 
    const form = useForm<settingFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        }
    })
    const onSubmit = async (data: settingFormValues) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
            }else{
                await axios.post(`/api/${params.storeId}/sizes`, data)
            }
            location.reload()
            router.push(`/${params.storeId}/sizes`)

            // router.refresh()
            toast.success(toastMessage)
        } catch (error) {
            toast.error('Something went wrong!')
        }finally{

            setLoading(false)
        }
    }
    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
            location.reload()
            router.push(`/${params.storeId}/sizes`)
            toast.success('Size deleted!')
        } catch (error) {
            toast.error('Make sure you remove all products using this size')
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
        onConfirm={onDelete}
        loading={loading}
        />
        <div className='flex items-center justify-between'>
            <Heading
            title={title}
            description={description}/>
            {initialData && (<Button
            disabled={loading}
            variant={'destructive'}
            size={'icon'}
            onClick={() => {setOpen(true)}}
            >
                <Trash
                className='h-4 w-4'
                // size={16}
                ></Trash>
            </Button>)}
        </div>
        <Separator/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                
                <div className='grid grid-cols-3 gap-8'>
                    <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder='size name' {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name='value'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder='size value' {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
            </form>

        </Form>
        {/* <Separator /> */}
        {/* <ApiAlert title='NEXT_PUBLIC_API_URL' description={`${origin}/api/${params.storeId}`} variant='public' /> */}
    </>
  )
}

export default SizeForm