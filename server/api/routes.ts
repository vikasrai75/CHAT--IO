import { Request,Response } from "express";
import SupaBaseDB from "./supabaseDB";
import axios from "axios";
import bcrypt from "bcryptjs";
import type { WebSocket } from "ws";
import RedisDB from "./redis";
import queue from "./queue";


export type Message = {
    message ?: string,
    sender_email : string,  
    reciever_email : string,
    date ?: Date
    type : "join" | "message" | "leave" ,
    id : string,
};

const db = new SupaBaseDB();
const rs = new RedisDB();

export async function searchRoute(req : Request,res : Response){
    const queryString = req.originalUrl.slice(req.originalUrl.indexOf("?") + 1);
    const params = new URLSearchParams(queryString);
    let data;
    if(params.get("usr")){
        data =  await db.fetchData("UserCred",{
            query : "email,username",
        });
    }
    else if(params.get("usrList")){
        data = await db.fetchData("Users",{
            query : "id,rcvr_email( username,email )",
            condition : `sndr_email=${params.get("usrList")}`,
        });
        data = data.map((payload)=> ({
            name : payload.rcvr_email.username,
            email : payload.rcvr_email.email,
            id : payload.id,
        }));
    }
    else
    {
        data = await db.fetchData("UserCred",{
            query : "email,username",
            likePat : `${params.get('q')}%`,
            likeCol : "email",
        });
    }
    if(data.length){
       return res.status(200).json(data);
    }
    return res.status(204).json([]);
}

export async function addClientRoute(req : Request,res : Response){
    const data = req.body;
    const response = await db.insertData([
        {sndr_email : data.sndr_mail,rcvr_email : data.rcvr_mail},
        {sndr_email : data.rcvr_mail,rcvr_email : data.sndr_mail}],
    "Users");
    if(response){
       return res.status(201).end();
    }
    else
    {
        return res.status(400).end();
    }
}

export async function registerUser(req : Request,res : Response){
    const formData = req.body;
    const response = await axios.get("http://localhost:3000/chatapp/auth/csrf");
    const token = response.data.csrfToken;
    if(token !== formData['auth_token']){
        if(formData['type'] == "auth2"){
            formData['password'] = "AUTH_CREATED";
        }
        else
        {
            let salt = await bcrypt.genSalt(12);
            let encPassword = await bcrypt.hash(formData['password'],salt);
            formData['password'] = encPassword;
        }
        const result = await db.insertData({
            email : formData['email'],
            password : formData['password'],
            username : formData['username'],
        },"UserCred");
        if(result){
            res.status(201);
            return res.send();
        }
    }
    res.status(400);
    return res.send();
};

export async function loginUser(req : Request,res : Response){
    const formData = req.body;
    const response = await axios.get("http://localhost:3000/chatapp/auth/csrf");
    const token = response.data.csrfToken;
    if(token !== formData['auth_token']){
        const data = await db.fetchData("UserCred",{
            query : "*",
            condition : `email=${formData.email}`,
        });
        let isPasswordMatch = await bcrypt.compare(formData['password'],data[0].password);
        if(data && data[0].email == formData['email'] && isPasswordMatch){
            res.status(200);
            return res.json({
                clientAuthenticated : true,
                user : {
                    email : data[0].email,
                    userid : data[0].userid,
                    created_at : data[0].created_at,
                    name : data[0].username,
                }
            });
        }
    }
    return res.status(400).send();
}

export function chat(ws : WebSocket){
    ws.on("message",(data)=>{
        const msg : Message = JSON.parse(data.toString());
        console.log("a message is arrived ",msg);
    
        if(msg.type == "join"){
            rs.subscribe(msg.sender_email,msg.reciever_email,msg.id,ws);
        }

        if(msg.type == "message"){
            queue.add("chatio:msg:chat",msg);
            rs.publishMessage(msg.reciever_email,data.toString());
        }

        if(msg.type == "leave"){
            rs.unSubscribe(msg.sender_email);
        }
    })
}

export async function fetchChats(req : Request,res : Response){
    const queryString = req.originalUrl.slice(req.originalUrl.indexOf("?") + 1);
    const params = new URLSearchParams(queryString);
    if(params.get('user') && params.get("client")){
        let data = await db.fetchData("Users",{
            query : "rcvr_email,sndr_email,UsrMsg!inner(msg,id)",
            orderBy : "id",
            ascending : true,
            or: `and(rcvr_email.eq.${params.get('user')},sndr_email.eq.${params.get('client')}),and(rcvr_email.eq.${params.get('client')},sndr_email.eq.${params.get('user')})`,
        });
        res.status(200);
        let filteredData = data.map((elem)=>{
            return elem.UsrMsg.map((chat : any)=> 
                ({sender_email : elem.sndr_email,reciever_email : elem.rcvr_email,message : chat.msg,id : chat.id}));
        });
        if(filteredData.length){
            filteredData = (filteredData.length == 1 ? [...filteredData[0]] : [...filteredData[0],...filteredData[1]]).sort((a,b) => a.id > b.id ? 1 : -1);
        }
        res.setHeader("content-type",'application/json');
        res.json(JSON.stringify(filteredData));
        return;
    }
    res.status(400);
    res.send();
}