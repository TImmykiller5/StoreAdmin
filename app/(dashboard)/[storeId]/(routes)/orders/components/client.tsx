"use client"

import Heading from "@/components/ui/Heading"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import { OrderColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import ApiList from "@/components/ui/api-list"

interface OrderClientProps {
  data: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = ({
  data
}) => {
    const router = useRouter()
    const params = useParams()
  return (
    <>
        <div className="flex items-center justify-between">
            <Heading
            title={`Orders (${data.length}) `}
            description="Manage your orders"
            />
            
        </div>
        <Separator />
        <DataTable searchKey="products" columns={columns} data={data} />
        {/* <Heading title="API" description="API calls for orders" />
        <Separator />
        <ApiList entityName="orders" entityIdName="orderId" /> */}

    </>
  )
}

export default OrderClient