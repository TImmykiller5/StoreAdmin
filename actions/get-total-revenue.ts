import prismadb from "@/lib/prismadb"


export const getTotalRevenue = async (storeId: string) => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId: storeId,
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
    })
    const totalRevenue = paidOrders.reduce((acc, order) => {
        return acc + order.orderItems.reduce((ordersum, orderItem) => {
            return ordersum + orderItem.product.price.toNumber()
        }, 0)
    }, 0)

    return totalRevenue
}