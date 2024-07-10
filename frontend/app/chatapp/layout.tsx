import React from "react";
import AuthSessionProvider from "./(api)/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]/route";
import AppSideHeaderBar from "./components/ui/AppSideHeaderBar";
import AppSearchBar from "./components/ui/AppSearchBar";
import { IoChatbubblesOutline } from "react-icons/io5";

export default async function MainPageLayout({children,Signup} : {children : React.ReactNode,Signup : React.ReactNode}){
    const session = await getServerSession(authOptions);
    return(
        <React.Fragment>
            <AuthSessionProvider session={session}>
                <LayoutHeader />
                <LayoutMain>
                    {children}
                    {Signup}
                </LayoutMain>
            </AuthSessionProvider>
        </React.Fragment>
    )
}

function LayoutHeader(){
    return(
        <header className="shadow-lg font-robo box-border max-h-1/5 bg-white-500 py-4 w-full flex items-center justify-between px-4 sm:px-6 md:px-8">
            <UserIcon />
            <AppSearchBar />
            <AppSideHeaderBar />
        </header>
    )
}
 
function LayoutMain({children} : {children : React.ReactNode}){
    return(
        <main className="flex-1 overflow-hidden w-full h-full">
            {children}
        </main>
    )
}

function UserIcon(){
    return(
        <div className="flex select-none mb-2">
           <h1 className="text-2xl font-extrabold text-blue-600 pr-1">OC-Chat</h1>
           <span className="text-2xl text-blue-600 font-bold"><IoChatbubblesOutline /></span>
           <span className="relative top-6 left-[-6.5rem] text-sm font-bold font-sans text-blue-600">chat real</span>
        </div>
    )
}