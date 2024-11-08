import Logo from "@/app/common/Logo";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { FaCog } from "react-icons/fa";

export default async function Sidebar() {
    return (
        <div className="group flex h-full w-20 flex-col items-start overflow-hidden bg-panel py-2 drop-shadow transition-all hover:w-64">
            {/* Home Button */}
            <div className="mx-2 flex w-60 cursor-pointer items-center rounded-lg drop-shadow transition-all hover:bg-panel-hover">
                <Link className="ml-1 mr-2 flex h-14 w-14 items-center justify-center" title="Home" href={"/"}>
                    <Logo className="scale-110 text-4xl" />
                </Link>
                <div className="flex h-8 w-44 items-center overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold opacity-0 transition-all group-hover:opacity-100">
                    Home
                </div>
            </div>

            <SidebarDivider />
            <div className="text-md mx-auto mb-1 mt-0.5 h-6 scale-95 font-bold text-light">Profiles</div>
            <SidebarDivider />

            {/* Profiles */}

            {/* Add Profile */}
            <div className="group mx-2 mt-auto flex w-60 cursor-pointer items-center rounded-lg py-2 opacity-80 drop-shadow transition-all hover:bg-panel-hover">
                <Link className="mx-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent" title="Home" href={"/add-profile"}>
                    <FaPlus className="text-3xl text-white" />
                </Link>
                <div className="flex h-8 w-44 items-center overflow-hidden text-ellipsis whitespace-nowrap pl-2 text-lg font-bold opacity-0 transition-all group-hover:opacity-100">
                    Add Profile
                </div>
            </div>

            {/* Settings */}
            <SidebarDivider />
            <div className="group mx-2 flex w-60 cursor-pointer items-center rounded-lg py-2 drop-shadow transition-all hover:bg-panel-hover">
                <Link className="mx-2 flex h-12 w-12 items-center justify-center rounded-lg border" title="Home" href={"/settings"}>
                    <FaCog className="text-3xl text-white" />
                </Link>
                <div className="flex h-8 w-44 items-center overflow-hidden text-ellipsis whitespace-nowrap pl-2 text-lg font-bold opacity-0 transition-all group-hover:opacity-100">
                    Settings
                </div>
            </div>
        </div>
    );
}

function SidebarDivider({ className = "" }) {
    return <div className={"mx-2 my-1 h-0.5 w-16 rounded-full bg-border opacity-50 transition-all group-hover:w-60 " + className} />;
}
