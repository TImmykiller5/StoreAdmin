'use client'
import React, { useState } from 'react'
import Heading from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Billboard } from '@prisma/client'
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
interface BillboardFormProps {
    initialData: Billboard | null
}
const formSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    imageUrl: z.string().min(1, 'Image URL is required'),
})
type settingFormValues = z.infer<typeof formSchema>


const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData
}) => {
    const params = useParams()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const title = initialData ? 'Edit Billboard' : 'Add New Billboard'
    const description = initialData ? 'Edit your billboard' : 'Add a new billboard'
    const toastMessage = initialData ? 'Billboard updated!' : 'Billboard created!'
    const action = initialData ? 'Save Changes' : 'Create' 
    const form = useForm<settingFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: '',
        }
    })
    const onSubmit = async (data: settingFormValues) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
            }else{
                await axios.post(`/api/${params.storeId}/billboards`, data)
            }
            location.reload()
            router.push(`/${params.storeId}/billboards`)

            // router.refresh()
            toast.success(toastMessage)
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong!')
        }finally{

            setLoading(false)
        }
    }
    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            location.reload()
            router.push(`/${params.storeId}/billboards`)
            toast.success('billboard deleted!')
        } catch (error) {
            console.log(error)
            toast.error('Make sure you remove all categories using this billbord')
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
                <FormField
                        control={form.control}
                        name='imageUrl'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background image</FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value ? [field.value] : []} disabled={loading} onRemove={() => field.onChange('')} onChange={(url) => field.onChange(url)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                <div className='grid grid-cols-3 gap-8'>
                    <FormField
                    control={form.control}
                    name='label'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder='Billboard label' {...field}/>
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

export default BillboardForm