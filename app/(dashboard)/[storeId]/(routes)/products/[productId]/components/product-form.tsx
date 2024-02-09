'use client'
import React, { useEffect, useState } from 'react'
import Heading from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Category, Color, Image, Product, Size } from '@prisma/client'
import { Trash } from 'lucide-react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '@/components/modals/alert-modals'
import ImageUpload from '@/components/ui/image-upload'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
interface ProductFormProps {
    initialData: Product & {
        images: Image[], 
        color: Color[],
        size: Size[]
    } | null;
    categories: Category[]
    colors: Color[]
    sizes: Size[]
}
const formSchema = z.object({
    name: z.string().min(1, 'Product Name is required'),
    categoryId: z.string().min(1, 'Category is required'),
    // sizeId: z.string().min(1, 'Size is required'),
    // colorId: z.string().min(1, 'Color is required'),
    price: z.coerce.number().min(1, 'Price is required'),
    isFeatured: z.boolean().default(false),
    isArchived: z.boolean().default(false),
    images: z.object({url: z.string()}).array(),
    // colors: z.object({url: z.string()}).array().optional(),
})
type settingFormValues = z.infer<typeof formSchema>

interface ISelectProps {
    values: {
      key: string;
      value: string;
    }[];
  }


const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  colors,
  sizes
}) => {
    const [Colors, setColors] = useState<Color[]>([colors[0]]);
    const [Sizes, SetSizes] = useState<Color[]>([sizes[0]]);
    console.log(initialData)
    // if(initialData){    }
    useEffect(() => {
        // ts ignore
        initialData && setColors(initialData.color.map(col => col ))
        initialData && SetSizes(initialData.size.map(siz => siz ))
    }, [])
    
    const handleSelectChange = (value: Color) => {
      if (!Colors.filter((color) => color.id === value.id).length) {
        setColors((prev) => [...prev, value]);
      } else {
        const referencedArray = [...Colors];
        const indexOfItemToBeRemoved = referencedArray.findIndex((item) => item.id === value.id);
        referencedArray.splice(indexOfItemToBeRemoved, 1);
        setColors(referencedArray);
      }
    };
    const handleSizeSelectChange = (value: Size) => {
      if (!Sizes.filter((size) => size.id === value.id).length) {
        SetSizes((prev) => [...prev, value]);
      } else {
        const referencedArray = [...Sizes];
        const indexOfItemToBeRemoved = referencedArray.findIndex((item) => item.id === value.id);
        referencedArray.splice(indexOfItemToBeRemoved, 1);
        SetSizes(referencedArray);
      }
    };
    
  const isOptionSelected = (value: string): boolean => {
    return Colors.some((color) => color.id === value);
  };

  const isSizeSelected = (value: string): boolean => {
    return Sizes.some((size) => size.id === value);
  };
    const params = useParams()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const title = initialData ? 'Edit Product' : 'Create New Product'
    const description = initialData ? 'Edit your Product' : 'Add a new Product'
    const toastMessage = initialData ? 'Product updated!' : 'Product created!'
    const action = initialData ? 'Save Changes' : 'Create' 
    const form = useForm<settingFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData.price)),
        } : {
            name: '',
            images: [],
            price : 0,
            categoryId: '',
            // sizeId: '',
            isFeatured: false,
            isArchived: false,
            // colors:[]

        }
    })
 
    const onSubmit = async (data: settingFormValues) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, {...data, Colors, Sizes})
            }else{
                await axios.post(`/api/${params.storeId}/products`, {...data, Colors, Sizes})
            }
            location.reload()
            toast.success(toastMessage)
            router.push(`/${params.storeId}/products`)
            // router.refresh()
        } catch (error: any | AxiosError) {
            const toastMessage = error.response.data ? error.response.data : 'Something went wrong'
            toast.error(toastMessage) 
            // toast.error('Something went wrong!')
        }finally{
            setLoading(false)
        }
    }
    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/products/${params.PproductId}`)
            location.reload()
            router.push(`/${params.storeId}/products`)
        } catch (error) {
            toast.error('Something went wrong')
        }finally{
            setLoading(false)
            toast.success('Product deleted!')

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
                        name='images'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Image</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                    value={field.value.map((image) => image.url)} 
                                    disabled={loading} 
                                    onRemove={(url) => field.onChange([...field.value.filter((image) => image.url !== url)])} 
                                    onChange={(url) => field.onChange([...field.value, {url}])} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                <div className='grid grid-cols-3 gap-8'>
                    <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder='Product Name' {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input type='number' disabled={loading} placeholder='9.99' {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name='categoryId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                                disabled={loading}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder='Select category' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                   <div className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                           <DropdownMenu>
                            <DropdownMenuTrigger className='w-full' asChild>
                            <Button variant="outline" className="">
                                <span>Select Sizes</span>
                            </Button>
                            </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
                                <DropdownMenuLabel>Available sizes</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {sizes.map((value, index) => {
                                    return (
                                    <DropdownMenuCheckboxItem
                                        onSelect={(e) => e.preventDefault()}
                                        key={index}
                                        checked={isSizeSelected(value.id)}
                                        onCheckedChange={() => {handleSizeSelectChange(value); }}
                                    >
                                        {value.name}
                                    </DropdownMenuCheckboxItem>
                                    );
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    <div className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                           <DropdownMenu>
                            <DropdownMenuTrigger className='w-full' asChild>
                            <Button variant="outline" className="">
                                <span>Select Colors</span>
                            </Button>
                            </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
                                <DropdownMenuLabel>Available colors</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {colors.map((value, index) => {
                                    return (
                                    <DropdownMenuCheckboxItem
                                        onSelect={(e) => e.preventDefault()}
                                        key={index}
                                        checked={isOptionSelected(value.id)}
                                        onCheckedChange={() => {handleSelectChange(value); }}
                                    >
                                        {value.name}
                                    </DropdownMenuCheckboxItem>
                                    );
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    <FormField
                    control={form.control}
                    name='isFeatured'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                          <FormControl>
                            <Checkbox
                              checked={field.value} onCheckedChange={field.onChange}
                              />
                          </FormControl>
                          <div className='space-y-1 leading-none'>
                            <FormLabel>
                                Featured
                            </FormLabel>
                            <FormDescription>
                                Featured products will be displayed on the home page.
                            </FormDescription>
                          </div>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name='isArchived'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                          <FormControl>
                            <Checkbox
                              checked={field.value} onCheckedChange={field.onChange}
                              />
                          </FormControl>
                          <div className='space-y-1 leading-none'>
                            <FormLabel>
                                Archived
                            </FormLabel>
                            <FormDescription>
                                Archived products will not appear anywhere in the store.
                            </FormDescription>
                          </div>
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

export default ProductForm