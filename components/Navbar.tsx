import { UserButton, auth } from "@clerk/nextjs"
import MainNav from "@/components/Main-nav"
import Storeswitcher from "@/components/store-switcher"
import { redirect } from "next/navigation"
import prismadb from "@/lib/prismadb"
import { ModeToggle } from "./theme-toggle-component"

const Navbar = async () => {
  const { userId }= auth()
  if(!userId){
    redirect('/sign-in')
  }
  const stores = await prismadb.store.findMany({
    where: {
      userId
    }
  })
  return (
    <div className="border-b">
        <div className="flex h-16 items-center px-4">
            <Storeswitcher items={stores}/>
            <MainNav className="mx-6"/>
            <div className="ml-auto flex item-center space-x-4">
                <ModeToggle />
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    </div>
  )
}

export default Navbar