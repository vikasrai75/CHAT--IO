import { combineClasses } from "../utitli/helpers";
import { signOut } from "next-auth/react";
import Button from "./button";

export default function LoginInfo({className} : {className ?: string}){
    return(
        <div className={combineClasses("z-50 h-14 flex flex-col items-center absolute right-0 my-6 mr-2 bg-transparent shadow-mdrounded text-center",className)}>
            <Button className="w-fit hover:bg-red-800 bg-red-600 font-bold" onClick={() => signOut()}>Log out</Button>
            <Button className="hover:bg-green-800 bg-green-600 mt-4 font-bold" onClick={() => {history.pushState(null,'',"/chatapp/Chat");history.go();}}>chat now</Button>
        </div>
    )
}