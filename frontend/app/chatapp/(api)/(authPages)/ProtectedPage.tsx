import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProtectedRoute({children} : {children : React.ReactNode}){
    const session = useSession();
    if(session.status !== "authenticated"){
        redirect("/chatapp/Login");
    }
    return(
        <>
           {children}
        </>
    )
}