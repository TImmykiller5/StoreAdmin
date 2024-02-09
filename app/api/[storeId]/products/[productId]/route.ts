import { Color, Image, Size } from '@prisma/client';
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";


export async function PATCH (
    req: Request,
    {params} : {
        params: {storeId: string, productId: string}
    }
){
    try {
        const {userId} = auth();
        const body = await req.json();
        console.log(body)
        const {
            name,
            price,
            categoryId,
            Sizes,
            images,
            isFeatured,
            isArchived,
            Colors:color
        } : {name: string, price: number, categoryId: string, Sizes: Size[], images: Image[], isFeatured: boolean, isArchived: boolean, Colors: Color[]} = body;
        if(!userId){
            return new NextResponse('Unauthenticated', { status: 401 });
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
        if(!color.length){
            return new NextResponse('Select one or more Colors', { status: 400 })
        }
        if(!Sizes.length){
            return new NextResponse('Select one or more Sizes', { status: 400 })
        }
        if(!images || !images.length){
            return new NextResponse('Images are required', { status: 400 })
        }
        if(!params.productId){
            return new NextResponse('Product ID is required', { status: 400 })
        }
        if(!params.storeId){
            return new NextResponse('Store ID is required', { status: 400 });
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {id: params.storeId, userId},
        })
        if(!storeByUserId){
            return new NextResponse('Unauthorized', { status: 403 })
        }
        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                isFeatured,
                isArchived,
                images: {
                    deleteMany : {}
                },
                color: {
                    set:[]
                },
                size: {
                    set:[]
                }


            }
        });
        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany : {
                        data:[...images.map((image : {url:string}) => image)]
                    }
                },
                color: {
                    connect : color.map(c => {return {id:c.id}})
                },
                size: {
                    connect : Sizes.map(s => {return {id:s.id}})
                }
            }
        })
        return NextResponse.json(product);

    } catch (error) {
        console.error('[PRODUCT_PATCH] ',error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function DELETE (
    req: Request,
    {params} : {
        params: {storeId: string, productId: string}
    }
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse('Unauthenticated', { status: 401 });
        }
        
        if(!params.productId){
            return new NextResponse('Product ID is required', { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {id: params.storeId, userId},
        })
        if(!storeByUserId){
            return new NextResponse('Unauthorized', { status: 403 })
        }
        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            },
        });
        return NextResponse.json(product);

    } catch (error) {
        console.error('[PRODUCT_DELETE]',error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET (
    req: Request,
    {params} : {
        params: { productId: string}
    }
){
    try {
        
        
        if(!params.productId){
            return new NextResponse('Product ID is required', { status: 400 });
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                color: true,
                size: true,
                category: true
            }
        });
        return NextResponse.json(product);

    } catch (error) {
        console.error('[PRODUCT_GET]',error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}