import * as collapsible from "@radix-ui/react-collapsible";
import React from "react";

type CollapsibleRootRef = React.ElementRef<typeof collapsible.Root>
type CollapsibleRootProps = React.ComponentPropsWithoutRef<typeof collapsible.Root>

const CollapsibleRoot = React.forwardRef<CollapsibleRootRef,CollapsibleRootProps>(({className,children,...props},ref)=>{
    return(
        <collapsible.Root className={className} {...props}>
            {children}
        </collapsible.Root>
    )
});


type CollapsibleTriggerRef = React.ElementRef<typeof collapsible.Trigger>
type CollapsibleTriggerProps = React.ComponentPropsWithRef<typeof collapsible.Trigger>

const CollapsibleTrigger = React.forwardRef<CollapsibleTriggerRef,CollapsibleTriggerProps>(({className,children},ref)=>{
    return(
        <collapsible.Trigger className={className} asChild={true} >
            {children}
        </collapsible.Trigger>
    )
});

type CollapsibleContentRef = React.ElementRef<typeof collapsible.Content>
type CollapsibleContentProps = React.ComponentPropsWithoutRef<typeof collapsible.Content>

const CollapsibleContent = React.forwardRef<CollapsibleContentRef,CollapsibleContentProps>(({className,children,...props},ref)=>{
    return(
        <collapsible.Content className={className} {...props}>
            {children}
        </collapsible.Content>
    )
});

export {CollapsibleContent,CollapsibleRoot,CollapsibleTrigger};

