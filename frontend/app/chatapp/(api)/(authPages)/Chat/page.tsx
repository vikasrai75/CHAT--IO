"use client";


import React from "react";
import { useSession } from "next-auth/react";
import { Client } from "../../atom";
import ChatApp from "./ChatApp";
import axios from "axios";
import addLoginUser from "@/app/chatapp/components/utitli/addLoginUser";

export default function MainChatApp(){
    const session = useSession();
    const [userList,setUserList] = React.useState<Array<Client>>([]);
    const abort = new AbortController();

    function fetchUsers(email : string){
        axios({
            url : "http://localhost:4000/api/usr/search",
            params : {
                usrList : email,
            },
            signal : abort.signal,
        }). 
        then((resp)=>{
            if(resp.status == 200){
                const data = resp.data
                if(resp.data.length){
                    setUserList(data);
                }
            }
            else
            {
                console.log("userlist could not fetched");
            }
        }). 
        catch((reason)=> console.error(reason));
    }
    React.useEffect(()=>{
        if(session.data?.user){
            addLoginUser();
            fetchUsers(session.data.user.email ?? '');
        }
        return () => abort.abort();
    },[session.data?.user]);
    return(
        <>
            {<ChatApp userList = {userList} user={session.data?.user?.email ?? ""} />}
        </>
    )
}