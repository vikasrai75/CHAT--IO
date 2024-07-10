import express from "express";
import cors from "cors";
import { addClientRoute,searchRoute,registerUser,loginUser,chat,fetchChats} from "./api/routes";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import {  Worker } from "bullmq";
import { redisConnection } from "./api/redis";
import processor from "./worker";


const app = express();
const server = createServer(app);
const wsServer = new WebSocketServer({
    server : server,
    path : "/chat",
});

const queueWorker = new Worker("chatio:msg",processor,{
    connection : {
        host : redisConnection.host,
        port : redisConnection.port as any,
        username : redisConnection.username,
        password : redisConnection.password,
    }
});

wsServer.on("connection",chat);

app.use(cors({origin  : "http://localhost:3000"}));
app.use(express.json());


app.get("/api/usr/search",searchRoute);
app.get("/api/chat/fetchchats",fetchChats);
app.post("/api/usr/add",addClientRoute);
app.post("/api/auth/register",registerUser);
app.post("/api/auth/login",loginUser);

server.listen(4000,"localhost");

queueWorker.on("error",(err)=>{
    console.log("from queue ",err.message);
})