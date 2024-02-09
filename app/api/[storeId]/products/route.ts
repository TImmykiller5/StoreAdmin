import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"
import prismadb from '@/lib/prismadb';
import { string } from "zod";
import { Color, Size } from "@prisma/client";

export async function POST(req:Request, {params}: {params:{storeId: string}}) {
    try {
        const {userId} = auth(); // get userId from clerk();
        const body = await req.json();
        const {
            name,
            price,
            categoryId,
            // sizeId,
            Sizes,
            images,
            isFeatured,
            isArchived,
            Colors
        } = body;
        if(!userId){
            return new NextResponse('Unauthenticated', { status: 401 })
        }
        if(!name){
            return new NextResponse('Name is required', { status: 400 })
        }

        if(!price){
            return new NextResponse('Price is required', { status: 400 })
        }
        if(!categoryId){
            return new NextResponse('Category ID is required', { status: 400 })
        }
        if(!Colors){
            return new NextResponse('Select one or more Colors', { status: 400 })
        }
        if(!Sizes){
            return new NextResponse('Select one or more Sizes', { status: 400 })
        }
        if(!images || !images.length){
            return new NextResponse('Images are required', { status: 400 })
        }

        if(!params.storeId){
            return new NextResponse('Store ID is required', { status: 400 })
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {id: params.storeId, userId},
        })
        if(!storeByUserId){
            return new NextResponse('Unauthorized', { status: 403 })
        }
        const product = await prismadb.product.create({data: {
            name,
            price,
            categoryId,
            // sizeId,
            isFeatured,
            isArchived,
            storeId: params.storeId,
            images: {
                createMany : {
                    data:[...images.map((image : {url:string}) => image)]
                }
            },
            color: {
                connect: Colors.map((c:Color) => {
                    return {id: c.id}
                })
            },
            size: {
                connect: Sizes.map((s:Size) => {
                    return {id: s.id}
                })
            }
        }});         
        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCT_POST]', error)
        return new NextResponse('Something went wrongG', { status: 500 })
    }
}

export async function GET(req:Request, {params}: {params:{storeId: string}}) {
    try {
        const {searchParams} = new URL(req.url);
        const categoryId = searchParams.get('categoryId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const isFeatured = searchParams.get('isFeatured') ;

        if(!params.storeId){
            return new NextResponse('Store ID is required', { status: 400 })
        }
      
        
        const product = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                // colorId,
                color:{
                    some:{
                        id: colorId
                    }
                },
                size:{
                    some:{
                        id: sizeId
                    }
                },
                // sizeId,
                isFeatured : isFeatured ? true : undefined,
                isArchived: false 
            },
            include: {
                category: true,
                color: true,
                size: true,
                images: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });         
        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCT_GET]', error)
        return new NextResponse('Something went wrong', { status: 500 })
    }
}