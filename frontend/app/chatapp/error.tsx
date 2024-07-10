"use client";

import React from "react";


export default function error({error,reset} :
     {error : Error & {digest : any},reset : () => void}){
    React.useEffect(()=>{
        console.log(error.message);
        reset();
    },[error]);
    return(
        <></>
    )
}