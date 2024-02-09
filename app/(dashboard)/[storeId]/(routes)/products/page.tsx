

import React from 'react'
import {format} from 'date-fns'
import prismadb from '@/lib/prismadb'
import { ProductColumn } from './components/columns'
import { formatter } from '@/lib/utils'
import ProductsClient from './components/client'

const page = async (
  {params} : {params : { storeId:string }}
) => {
  console.log(formatter)

    const products = await prismadb.product.findMany(
      {
        where: {
          storeId: params.storeId
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          category: true,
          size: true,
          color: true,
        }
      }
    )
    // console.log(billboards)

    const formattedProducts: ProductColumn[] = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        isFeatured: product.isFeatured,
        isArchived: product.isArchived,
        price: formatter.format(product.price.toNumber()),
        category: product.category.name,
        size: product.size,
        color: product.color,
        createdAt: format(product.createdAt, "MMMM do, yyyy")
      }
    }) 

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <ProductsClient data={formattedProducts} />
        </div>
    </div>
  )
}

export default page