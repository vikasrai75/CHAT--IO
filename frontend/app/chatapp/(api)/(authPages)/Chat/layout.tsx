"use client";

import React from "react";
import ProtectedRoute from "../ProtectedPage";
import { WebSocketProvider } from "../../WebsocketProvider";
import { RecoilRoot } from "recoil";

export default function ChatAppLayout({children} : {children : React.ReactNode}){
    return(
        <ProtectedRoute> 
            <RecoilRoot>
                <WebSocketProvider>
                    {children}
                </WebSocketProvider>
           </RecoilRoot>
        </ProtectedRoute>
    )
}