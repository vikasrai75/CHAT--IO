import * as Avatar from "@radix-ui/react-avatar";
import React from "react";
import { combineClasses } from "../utitli/helpers";

type RootRef = React.ElementRef<typeof Avatar.Root>;
type RootProps = React.ComponentPropsWithoutRef<typeof Avatar.Root>;


const AvatarRoot = React.forwardRef<RootRef,RootProps>(({children,className,...props},ref)=>{
    return(
        <Avatar.Root {...props} ref={ref} 
        className={combineClasses("border-2 border-white w-12 h-12 rounded-full flex items-center justify-center shadow-md bg-blue-200",className)}>
            {children}
        </Avatar.Root>
    )
});


AvatarRoot.displayName = Avatar.Root.displayName;

type ImageRef = React.ElementRef<typeof Avatar.Image>;
type ImageProps = React.ComponentPropsWithoutRef<typeof Avatar.Image>;


const AvatarImage = React.forwardRef<ImageRef,ImageProps>(({children,className,...props},ref)=>{
    return(
        <Avatar.Image {...props} ref={ref} className={combineClasses("h-full w-full rounded-full overflow-hidden",className)}>
            {children}
        </Avatar.Image>
    )
});

AvatarImage.displayName = Avatar.Image.displayName;

type FallbackRef = React.ElementRef<typeof Avatar.Fallback>
type FallbackProps = React.ComponentPropsWithoutRef<typeof Avatar.Fallback>;

const AvatarFallback = React.forwardRef<FallbackRef,FallbackProps>(({children,className,...props},ref)=>{
    return(
        <Avatar.Fallback {...props} ref={ref} className={combineClasses("font-sans font-bold text-2xl select-none",className)} >
            {children}
        </Avatar.Fallback>
    )
})

AvatarFallback.displayName = Avatar.Fallback.displayName;


export {AvatarRoot,AvatarImage,AvatarFallback};