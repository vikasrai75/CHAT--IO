"use client";

import React, { use } from "react";
import {ClientData, Client } from "../../atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { combineClasses } from "@/app/chatapp/components/utitli/helpers";
import { useWebSocket } from "../../WebsocketProvider";
import Button from "@/app/chatapp/components/ui/button";
import axios from "axios";

type Message = {
    message ?: string,
    sender_email : string,  
    reciever_email : string,
    date ?: Date
    fromSender ?: boolean,
    type : "join" | "message" | "leave",
}

type MessageList = {
    [key : string] : Array<Message>
}


export default function ChatApp({userList,user} : {userList : Array<Client>,user : string}){
    return (
        <div className="w-full h-full flex flex-col md:flex-row">
            <ChatAppSidebar  userList={userList}/>
            <ChatRoom user={user} />
        </div>
    )
}

function ChatAppSidebar({userList} : {userList : Array<Client>}){
    return(
        <div className="bg-blue-50 md:w-[12.2rem] lg:w-[19.2rem] overflow-hidden box-content md:relative absolute left-0 right-0">
            <div className="w-full h-auto md:w-52 lg:w-80 overflow-x-scroll overflow-y-hidden md:py-2 px-4 md:h-full md:overflow-y-scroll md:overflow-x-hidden">
                <h3 className="font-bold py-2 text-left text-xl underline text-gray-700 select-none hidden md:block">Chat Members</h3>
                <ul className="mt-1 flex gap-1 md:block md:mt-2">
                    {userList.length ? userList.map((data)=>{
                        if(data.name && data.email){
                            return <ChatBarItems name={data.name} email={data.email} key={data.email} id={data.id} />
                        }
                      })  : <div className="relative text-gray-400 text-lg text-center top-10 font-medium">No User Found !</div>
                   } 
                </ul>
            </div>
        </div>
    )
}

function ChatBarItems({name,email,id} : {name : string,id : string,email ?: string}){
    const [client,setClient] = useRecoilState<Client>(ClientData);
    function setCurrentClient({name,email,id} : Client){
        setClient({name,email,id})
    }
    return (
        <li  onClick={() => setCurrentClient({name,email,id})} key={email}
        className={combineClasses("border-b-blue-100 my-1 px-3 py-3 text-center font-medium border-2 border-transparent text-lg hover:bg-blue-100 rounded-md select-none hover:border-blue-100 text-gray-600",client.email == email ? "border-2 border-blue-500  hover:border-blue-500" : "")} title={email ?? ''}>
            {name}
        </li>
    )
}

function ChatRoom({user} : {user : string}){
    const {ws,status} = useWebSocket();
    console.log("websocket status is ",status);
    const [messagesList,setMessageList] = React.useState<MessageList>({});
    const clientEmailData = useRecoilValue(ClientData);

    const addMessage = (message : Message) => {
        setMessageList((list)=> {
            let nlist = {} as MessageList;
            let email = message.reciever_email;
            for(let key in list){
                if(list.hasOwnProperty(key)){
                    nlist[key] = [...list[key]];
                }
            }
            if(!(message.sender_email === user)){
                email = message.sender_email;
            }
            nlist[email] = nlist[email] ?? [];
            nlist[email].push(message);
            console.log(nlist);
            return nlist;
        });
    }

    const fetchChats = function (asignal : any){
        axios.get(`http://localhost:4000/api/chat/fetchchats`,{
            params : {
                user : user,
                client : clientEmailData.email,
            },
            signal : asignal,
        })
        .then((resp) => {
            const data = JSON.parse(resp.data);
            let clientMsg = messagesList[clientEmailData.email as string] ?? [];
            if(! clientMsg.length){
                clientMsg = [...data];
                setMessageList({...messagesList,[clientEmailData.email as string] : clientMsg});
            }
            
        }).catch((err) => {
            console.log("there is an client error ",err)
        });
    }

    React.useEffect(()=>{
        window.addEventListener("beforeunload",()=>{
            ws.send(JSON.stringify({type : "close",sender_email : user}));
        });
    },[]);

    React.useEffect(() => {
        if (clientEmailData.email && ws) {
            let aborter = new AbortController();
            fetchChats(aborter.signal);
            ws.send(JSON.stringify({
                sender_email: user,
                reciever_email: clientEmailData.email,
                id : clientEmailData.id,
                type: "join",
            } as Message));
            return () => {
                if (ws) {
                    aborter.abort();
                }
            }
        }
    }, [clientEmailData.email]);

    return(
        clientEmailData.email ? 
            <Chat user={user} 
                  client={clientEmailData}
                  ws={ws}
                  messages={messagesList[clientEmailData.email] ?? []}
                  status={status} 
                  addMessage = {addMessage} /> : null
    )
}

function Chat({user,client,messages,ws,status,addMessage} : 
    {user : string,client : Client,messages : Array<Message>,ws : WebSocket,status : "open" | "close",addMessage : (message : Message) => void}){
    const msgRef = React.useRef<HTMLDivElement>(null);

    if(status == "close"){
        console.log("socket is closed...");
    }

    const handleIncomingMsg = (ev : {data : string})=>{
        const msg : Message = JSON.parse(ev.data);
        addMessage(msg);
    }

    const  scrollToBottom = ()=>{
        msgRef.current?.scrollTo(0,msgRef.current.scrollHeight);
    }

    const sendMessage = (msg : string) => {
        ws && ws.send(JSON.stringify({
            message : msg,
            reciever_email : client.email,
            sender_email : user,
            type : 'message',
            id : client.id,
        } as Message));
    }

    React.useEffect(()=>{
        if(ws){
            ws.addEventListener("message",handleIncomingMsg);
            return () => ws.removeEventListener("message",handleIncomingMsg);
        }
    },[]);

    return(
        <div className="pt-6 md:pt-0 flex-auto scroll_thin overflow-y-scroll scroll_thin flex scroll-smooth" ref={msgRef} >
            <div className="mt-auto w-full mx-4">
                { messages.map((elem,index)=>{
                    if(messages.length && messages.length - 1  === index ){
                        window.setTimeout(()=> scrollToBottom(),0);
                    }
                    return <Message msg={elem} fromSender={!(elem.sender_email === user)} key={index} />
                })}
                <div className="mb-24"></div>
            </div>
            <MessageSendBar addMessage={addMessage} sendMessage = {sendMessage} user={user} client={client.email as string}>
                send
            </MessageSendBar>
        </div>
    )
}

function Message({msg,fromSender} : {msg : Message,fromSender ?: boolean}){
    return(
        <div className={combineClasses(fromSender ? "bg-white mr-auto" : "bg-blue-600 ml-auto","shadow-md border-2 py-2 px-3 my-3 select-none w-fit rounded-md max-w-[30ch] font-medium")}>
            <span>{msg.message}</span>
        </div>
    )
}

function MessageSendBar({children ,addMessage,sendMessage,user,client} : 
    {children : React.ReactNode,addMessage : (msg : Message) => void,sendMessage : (msg : string)=> void,user:string,client : string}){
    const [msg,setMsg] = React.useState<string>('');
    const [focus,setFocus] = React.useState<boolean>(false);

    function handleClick(){
        addMessage({
            message : msg,
            sender_email : user,
            reciever_email : client,
        } as Message);
        setMsg('');
        setFocus(false);
        sendMessage(msg);
    }
    return(
        <div className="fixed bottom-0 sm:w-[340px]" onFocus={() => setFocus(true)} onBlur={()=> setFocus(false)}>
            <textarea rows={focus ? 4 : 2} placeholder="type text here....." value={msg} onChange={(ev) => setMsg(ev.target.value)}
              className="sm:w-[320px] py-2 scroll_thin text-xl placeholder:text-xl text-gray-500 font-semibold border-2 rounded-md border-blue-600 / 
              px-3 text-justify resize-none w-full hover:ring-2 hover:ring-blue-400 mx-4 outline-none focus:border-blue-400">
            </textarea>
            <Button className="float-right w-15 h-full bg-blue-300/50 h-15 rounded-full absolute right-0 sm:right-5 bottom-3 hover:bg-blue-500 active:bg-blue-700 active:text-white py-1" 
              onClick={handleClick} disabled={msg ? false : true}>
                {children}
            </Button>
        </div>
    )
}