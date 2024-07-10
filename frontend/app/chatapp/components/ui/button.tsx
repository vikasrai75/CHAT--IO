import React from "react";
import { combineClasses } from "../utitli/helpers";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement,ButtonProps>(({
    className,children,...props
},ref)=>{
    return(
        <button ref={ref} {...props} 
        className={combineClasses("active:text-blue-400 bg-blue-600 text-white text-base px-4 py-2 font-medium rounded text-center",className)}>
            {children}
        </button>
    )
})


Button.displayName = "Button";

export default Button;