import React from 'react'
import {format} from 'date-fns'
import OrderClient from './components/client'
import prismadb from '@/lib/prismadb'
import { OrderColumn } from './components/columns'
import { formatter } from '@/lib/utils'

const page = async (
  {params} : {params : { storeId:string }}
) => {
    const orders = await prismadb.order.findMany(
      {
        where: {
          storeId: params.storeId
        },
        include:{
          orderItems: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    )
    // console.log(billboards)

    const formattedOrders: OrderColumn[] = orders.map((order) => {
      return {
        id: order.id,
        label: order.phone,
        address: order.address,
        products: order.orderItems.map((orderItem) => orderItem.product.name).join(', '),
        totalPrice: formatter.format(order.orderItems.reduce((total, item) => {
          return total + Number(item.product.price)
        }, 0)),
        isPaid: order.isPaid,
        phone: order.phone,
        createdAt: format(order.createdAt, "MMMM do, yyyy")
      }
    }) 

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <OrderClient data={formattedOrders} />
        </div>
    </div>
  )
}

export default page