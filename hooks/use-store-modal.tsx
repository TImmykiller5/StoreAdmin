import {create} from "zustand"

interface usseStoreModalStore {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const usseStoreModal = create<usseStoreModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}))