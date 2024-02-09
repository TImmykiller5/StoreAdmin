"use client"
import { Store } from "@prisma/client"

import { Popover, PopoverTrigger } from "./ui/popover"
import { usseStoreModal } from "@/hooks/use-store-modal"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/button"
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { PopoverContent } from "@radix-ui/react-popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreswitcherProps extends PopoverTriggerProps {
    items: Store[]
}
function Storeswitcher({
    className, items = []
} : StoreswitcherProps) {
    const storeModal = usseStoreModal()
    const params = useParams()
    const router = useRouter()

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const currentStore = formattedItems.find(item => item.value === params.storeId)

    const [open, setOpen] = useState(false)

    const onStoreSelect = (store : {value: string, label: string}) => {
        setOpen(false)
        router.push(`/${store.value}`)
    }

  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button variant="outline"
            size='sm'
            role="combobox"
            aria-expanded={open}
            aria-label= "Select a store"
            className={cn("w-[200px] justify-between", className)}>
                <StoreIcon className="mr-2 h-4 w-4" aria-hidden="true"/>
                {currentStore?.label}
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>            
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
                <CommandList>
                    <CommandInput placeholder="Search store..."></CommandInput>
                    <CommandEmpty>No store found</CommandEmpty>
                    <CommandGroup heading="Stores">
                        {formattedItems.map((item) => (
                            <CommandItem
                            key={item.value}
                            value={item.value}
                            onSelect={() => onStoreSelect(item)}>
                                <StoreIcon className="mr-2 h-4 w-4"/>
                                {item.label}
                                <Check 
                                className={cn("ml-auto h-4 w-4", currentStore?.value === item.value ? "opacity-100" : "opacity-0")}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
                <CommandSeparator/>
                <CommandList>
                    <CommandGroup>
                        <CommandItem
                        onSelect={() => {
                            storeModal.onOpen()
                            setOpen(false)
                        }}>
                            <PlusCircle className="mr-2 h-5 w-5"/>
                            Create New Store
                        </CommandItem>
                    </CommandGroup>
                </CommandList>

            </Command>
        </PopoverContent>
    </Popover>
  )
}

export default Storeswitcher