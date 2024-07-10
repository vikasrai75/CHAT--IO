"use client";

import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import Button from "./button";
import { useRouter } from "next/navigation";

export default function DialogBox({children,defaultOpen,Title,trgrBtn} : 
    {children : React.ReactNode,defaultOpen : boolean,Title : string,trgrBtn : React.ReactElement}){
        const router = useRouter();
        return(
            <Dialog.Root defaultOpen={defaultOpen} onOpenChange={(open) => !open && router.back()}>
                <Dialog.Trigger asChild>
                    {trgrBtn}
                </Dialog.Trigger>
                <Dialog.Portal> 
                    <Dialog.Overlay className="bg-white/95 w-full h-full absolute top-0 left-0 right-0 bottom-0">
                        <Dialog.Content 
                        className="w-fit shadow-md border-2 rounded-md relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-96">
                            <Dialog.Title className="text-2xl text-center my-4 font-bold text-slate-600">
                                {Title}
                            </Dialog.Title>
                           <Dialog.Close className="absolute top-0 right-0 m-0 hover:text-blue-600" asChild>
                               <Button className="px-2 py-2 bg-transparent text-slate-600" onClick={()=> router.back()}><IconClose /></Button>
                           </Dialog.Close>
                           {children}
                        </Dialog.Content>
                    </ Dialog.Overlay>
                </Dialog.Portal>
            </Dialog.Root>
        )
}

function IconClose(props : any) {
    return (
      <svg
        viewBox="0 0 512 512"
        fill="currentColor"
        height="25px"
        width="25px"
        {...props}
      >
        <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" />
      </svg>
    );
}
  