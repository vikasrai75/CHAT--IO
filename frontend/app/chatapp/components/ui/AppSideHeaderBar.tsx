"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";
import { AvatarFallback,AvatarRoot,AvatarImage } from "./Avatar";
import * as ToolTip from "@radix-ui/react-tooltip";
import { CollapsibleContent,CollapsibleRoot,CollapsibleTrigger } from "./collapsible";
import LoginInfo from "./UserLoginInfo";

type user = {
    email ?: string | null,
    image ?: string | null,
    name ?: string | null
};


export default function AppSideHeaderBar(){
    const session = useSession();
    return(
        session.status == "authenticated" ? <UserAvatar userInfo={session.data.user}/> : <UserCustomLogBtn />
    )
}


function UserCustomLogBtn(){
    return(
        <div>
            <Link href="/chatapp/Login/" className="px-4 py-1 font-sans rounded bg-blue-500 border-transparent text-white text-center font-medium inline-block hover:shadow-lg hover:bg-blue-500/80 mx-3">Login</Link>
            <Link href="/chatapp/Signup/" className="px-4 py-1 font-sans rounded bg-blue-500 border-transparent text-white text-center hidden font-medium hover:shadow-lg hover:bg-blue-500/80 sm:inline-block">Signup</Link>
        </div>
    )
}

function UserAvatar({userInfo} : {userInfo ?: user}){
    return(
        <ToolTip.Provider>
            <ToolTip.Root>
                <ToolTip.Trigger asChild>
                    <div>
                        <CollapsibleRoot>
                            <CollapsibleTrigger>
                                <AvatarRoot>
                                    <AvatarImage src={userInfo?.image ?? ""} height={60} width={60} className="object-cover"></AvatarImage>
                                    <AvatarFallback className="text-xl">{userInfo?.name?.slice(0,1) ?? "&#128540;"}</AvatarFallback>
                                </AvatarRoot>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <LoginInfo />
                            </CollapsibleContent>
                        </CollapsibleRoot>
                    </div>
                </ToolTip.Trigger>
                <ToolTip.Portal>
                    <ToolTip.Content side="bottom" align="center">
                        <span className="text-base font-sans">{userInfo?.name ?? "user"}</span>
                    </ToolTip.Content>
                </ToolTip.Portal>
            </ToolTip.Root>
        </ToolTip.Provider>
    )
}