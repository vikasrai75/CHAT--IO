"use client";

import axios from "axios";
import React, { MouseEvent } from "react";
import {FaSearch} from "react-icons/fa";
import {IoIosCloseCircle} from "react-icons/io"
import Button from "./button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type user = {
    name : string,
    email : string,
}

export default function AppSearchBar({className} : {className ?: string}){
    const [search,setSearch] = React.useState<string>("");
    const [items,setItems] = React.useState<Array<user>>([]);
    const session = useSession();
    const router = useRouter()

    function handleSearchChange(ev : React.ChangeEvent<HTMLInputElement>){
        setSearch(ev.target.value);
    }

    function handleRequestedUser(name : string,email : string){
        axios.post("http://localhost:4000/api/usr/add",{
            sndr_mail : session.data?.user?.email,
            rcvr_mail : email,
        }). 
        then((resp)=>{
            if(resp.status === 201){
                router.refresh();
                console.log("refresh is called");
            }
        }). 
        catch((err)=> console.log);
    }

    const handleSearch = ()=>{
        console.log("search is called");
        axios.get("http://localhost:4000/api/usr/search",{
            params : {
                q : search
            },
        }). 
        then((resp)=>{
            if(resp.status == 200 && resp.data.length){
                console.log(resp.data);
                console.log(resp.data.filter((ele : {email : string,name : string}) =>
                    ele.email !== session.data?.user?.email
                 ));
                setItems(resp.data.filter((ele : {email : string,name : string}) =>
                   ele.email !== session.data?.user?.email
                ));
            }
        }). 
        catch((err)=> console.log);
    };
    return(
        <form action="" onSubmit={(ev) => ev.preventDefault()} className="w-64 md:w-96 relative hidden md:inline-block">
            <input type="text"
                   value={search} 
                   placeholder="search users"
                   autoCorrect="false"
                   autoCapitalize="false"
                   onChange={handleSearchChange}
                   className="w-full h-auto text-slate-600 font-sans py-1 overflow-hidden px-2 text-lg shadow border border-blue-500 rounded-md outline-none focus:ring-1 focus:ring-blue-400" />           
            <label htmlFor="search" className="absolute right-4 top-[6px] text-2xl text-blue-500 hover:text-blue-600 border-2 border-transparent active:text-blue-400">
                {items.length ? <div onClick={()=> setItems([])}><IoIosCloseCircle /></div> :
                 <div onClick={handleSearch}><FaSearch /></div>}
            </label>
            {items.length ? 
             <SearchList>
                {items.map((val)=>{
                    return <SearchItem key={val.email} item={val} handleRequestChange={handleRequestedUser} />
                })}
             </SearchList> : null}
        </form>
    )
}

function SearchList({children} : {children : React.ReactNode}){
    return(
        <div className="w-full h-auto box-content absolute top-10 left-[-0.7rem] overflow-hidden border-">
          <ul className="ml-3 shadow-md w-full max-h-64 bg-blue-50/90 rounded-md last:border-none first:border-none *:py-2 *:px-2 *:border-t-2 / 
                         overflow-x-hidden overflow-y-scroll">
                {children}
          </ul>
        </div>
    )
}

function SearchItem({item,handleRequestChange} : {item : user,handleRequestChange : (name : string,email : string) => void}){
    return(
        <li className="flex items-center justify-between max-w-full overflow-x-hidden">
            <span className=" text-slate-700 w-[24ch] select-none overflow-hidden text-ellipsis text-lg">
                {item.email}
            </span>
            <Button className="py-1 bg-blue-400 hover:bg-blue-500" onClick={()=> handleRequestChange(item.name,item.email)}>request</Button>
        </li>
    )
}