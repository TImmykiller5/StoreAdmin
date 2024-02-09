'use client'
import React, { useState } from 'react'
import Heading from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {  Billboard, Category } from '@prisma/client'
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[]
}
const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    billboardId: z.string().min(1, 'Category ID is required'),
})
type CategoryFormValues = z.infer<typeof formSchema>


const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards
}) => {
    const params = useParams()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const title = initialData ? 'Edit Category' : 'Add New Category'
    const description = initialData ? 'Edit your Category' : 'Add a new Category'
    const toastMessage = initialData ? 'Category updated!' : 'Category created!'
    const action = initialData ? 'Save Changes' : 'Create' 
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: '',
        }
    })
    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            }else{
                await axios.post(`/api/${params.storeId}/categories`, data)
            }
            location.reload()
            // router.refresh()
            router.push(`/${params.storeId}/categories`)

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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            location.reload()
            router.push(`/${params.storeId}/categories`)
            toast.success('Category deleted!')
        } catch (error) {
            toast.error('Make sure you remove all products using this category')
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
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder='Categoy name' {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name='billboardId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Billboard</FormLabel>
                            <Select 
                                disabled={loading}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder='Select billboard' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        {billboards.map((billboard) => (
                                            <SelectItem
                                                key={billboard.id} value={billboard.id}>
                                                {billboard.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
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

export default CategoryForm