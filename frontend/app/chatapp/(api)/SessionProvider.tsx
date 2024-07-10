"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function AuthSessionProvider({children,session} : 
    {children : React.ReactNode,session : Session | null}){
    return(
        <SessionProvider session={session} basePath="/chatapp/auth">
            {children}
        </SessionProvider>
    )
}