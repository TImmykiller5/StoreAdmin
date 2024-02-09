"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import CellAction from "./cell-action";
import { Color, Size } from "@prisma/client";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  size: Size[];
  category: string;
  color: Color[];
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
 
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({row}) => {
      console.log(row)
      return (
      <div className="flex items-center gap-x-2">
        
        {row.original.size[0].name}
        <div className="h-6 w-6 rounded-full " />
      </div>
    )}
  },
  {
    accessorKey: "color",
    header: "color",
    cell: ({row}) => {
      console.log(row)
      return (
      <div className="flex items-center gap-x-2">
        
        {row.original.color[0].name}
        <div className="h-6 w-6 rounded-full " style={{ backgroundColor: row.original.color[0].value }} />
      </div>
    )}
  },
  
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
