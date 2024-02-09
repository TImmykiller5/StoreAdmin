import React from 'react'
import {format} from 'date-fns'
import Categorylient from './components/client'
import prismadb from '@/lib/prismadb'
import { CategoryColumn } from './components/columns'

const page = async (
  {params} : {params : { storeId:string }}
) => {
    const categories = await prismadb.category.findMany(
      {
        where: {
          storeId: params.storeId
        },
        include:{
          billboard: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    )
    // console.log(billboards)

    const formattedCategories: CategoryColumn[] = categories.map((category) => {
      return {
        id: category.id,
        name: category.name,
        billboardLabel: category.billboard.label,
        createdAt: format(category.createdAt, "MMMM do, yyyy")
      }
    }) 

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <Categorylient data={formattedCategories} />
        </div>
    </div>
  )
}

export default page