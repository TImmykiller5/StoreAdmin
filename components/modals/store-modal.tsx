"use client"

import * as z from "zod"
import { usseStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "../ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField } from "../ui/form"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
const formSchema = z.object({
    name : z.string().min(1, {message: "Name is required"}),
})


export const StoreModal = () => {
    const storeModal  = usseStoreModal();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onsubmit =async (values:z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            const response = await axios.post("/api/stores", values);
            console.log(response.data)
            window.location.assign(`/${response.data.id}`)
            // toast.success("Store created successfully")
        } catch (error) {
            // console.log(error)
            toast.error("Failed to create store")
        }finally{
            setLoading(false)
        }
    }
    return (
    <Modal
    title="Create Store"
    description="Add a new store to manage products and categories"
    isOpen={storeModal.isOpen}
    onClose={() => storeModal.onClose()}
    >
        <div>
            <div className="space-y-4 py-2 pb-4"></div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)}>
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Store name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="space-x-4 pt-6 flex items-center justify-end w-full" >
                        <Button disabled={loading} variant={"outline"} onClick={() => storeModal.onClose()} >Cancel</Button>
                        <Button disabled={loading} type="submit" >Continue</Button>
                    </div>
                </form>
            </Form>
        </div>
    </Modal>
    )
}