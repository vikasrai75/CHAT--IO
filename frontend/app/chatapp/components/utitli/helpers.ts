import clsx from "clsx";
import {twMerge} from "tailwind-merge";
import { type ClassValue } from "clsx";


export function combineClasses(...inputValues : ClassValue[]){
    let classes = inputValues.filter((val) => !!val);
    if(classes.length == 1){
        return clsx(classes);
    }
    else
    {
        return twMerge(clsx(...classes));
    }
}