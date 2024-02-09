'use client'
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { usseStoreModal } from "@/hooks/use-store-modal";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";


export default function Home() {
  const onOpen = usseStoreModal((state) => state.onOpen);
  const isOpen = usseStoreModal((state) => state.isOpen);

  useEffect(() => {
    if(!isOpen) {
      onOpen()
    }
  },[isOpen, onOpen])
  return (
    null
  )
}
