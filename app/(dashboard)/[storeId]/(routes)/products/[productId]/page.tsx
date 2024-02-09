import React from 'react'
import prismadb from '@/lib/prismadb'
import ProductForm from './components/product-form'

const ProductsPage = async ({
    params
}:{
    params: {productId : string, storeId: string}
}) => {
    const size = await prismadb.product.findUnique({
        where: {
            id: params.productId
        },
        include: {
            images: true,
            color: true,
            size: true,
            
        }
    })
    

    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        }
    })
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        }
    
    })
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        }
    })
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <ProductForm colors={colors} categories={categories} sizes={sizes} initialData={size}/>
        </div>
    </div>
  )
}

export default ProductsPage