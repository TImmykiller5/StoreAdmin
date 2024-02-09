"use client"

import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogDescription } from "@/components/ui/dialog"

interface ModalProps {
    children: React.ReactNode
    isOpen: boolean
    onClose: () => void
    title: string
    description: string
}

export const Modal: React.FC<ModalProps> = 
({ children, isOpen, onClose, title, description
 }) => {
    const onChange = (open :boolean) => {
        if(!open){
            onClose()
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}