import Stripe from "stripe";
import {headers} from 'next/headers'
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req:Request) {
    console.log('yes')
    const body = await req.text();
    const Signature = headers().get('Stripe-Signature') as string;
    
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            Signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err:any) {
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session
    const address = session?.customer_details?.address

    const addressComponent = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country
]

    const addressString = addressComponent.filter(c => c !== null).join(', ')
    console.log(session.metadata, event.type)
    if(event.type === "checkout.session.completed"){
        console.log('yes')
        console.log(session.metadata)

        await prismadb.order.update({
            where: {
                id: session?.metadata?.orderId
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || ''
            },
            include: {
                orderItems: true,
            }
        })

        // you can picl the product id into a list from the order item and reduce quantity of each item by 1 and if it is zero, set isarchived to true
    }

    return NextResponse.json(null, { status: 200 })
}