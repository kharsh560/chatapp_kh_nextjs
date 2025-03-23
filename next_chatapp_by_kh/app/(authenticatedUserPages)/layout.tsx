import { Sidebar } from "@/components/sideBarComponents/SideBarComponent";

export default function ({children} : {children: React.ReactNode}) {
    return (
        <div className=" flex">
            <Sidebar />
            {children}
        </div>
    )
}