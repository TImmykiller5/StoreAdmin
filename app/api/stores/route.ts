import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"
import prismadb from '@/lib/prismadb';

export async function POST(req:Request) {
    try {
        const {userId} = auth(); // get userId from clerk();
        const body = await req.json();
        // console.log(body)
        const {name} = body;
        if(!userId){
            return new NextResponse('Unauthorized', { status: 401 })
        }
        if(!name){
            return new NextResponse('Name is required', { status: 400 })
        }
        const store = await prismadb.store.create({data: {name, userId}});         
        return NextResponse.json(store)
    } catch (error) {
        console.log('[STORES_POST]', error)
        return new NextResponse('Something went wrong', { status: 500 })
    }
}