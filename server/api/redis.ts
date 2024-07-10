import { Redis, type RedisOptions } from "ioredis"
import WebSocket from "ws";
import { config } from "dotenv";

config();

type Client = {
    name : string,
    id : string,
}

export const redisConnection = {
    host: process.env['REDIS_HOST'],
    port: process.env['REDIS_PORT'],
    username: process.env['REDIS_USERNAME'],
    password: process.env['REDIS_PASSWORD'],
}

class RedisDB{
   #subConnection : Redis;
   #pubConnection : Redis;
   clients : Map<string,Client[]> = new Map();
   users : Map<string,WebSocket> = new Map();


    #defaultConnection() {
        return new Redis({...redisConnection} as RedisOptions);
    }

    #handleMessage(){
        const users  = this.users;
        return function (channel : string,message : string) {
            let ws = users.get(channel);
            if(ws){
                ws.send(message);
            }
        }
    }

    constructor(){
       this.#subConnection = this.#defaultConnection();
       this.#pubConnection = this.#defaultConnection();
       this.#subConnection.on("message",this.#handleMessage());
    }



    async subscribe(user : string,client : string,clintId : string,ws : WebSocket){
        try {
            let clients = this.clients.get(user) ?? [];
            if (!this.users.get(user)) {
                this.users.set(user, ws);
                await this.#subConnection.subscribe(user);
                this.#pubConnection.set(`user:${user}:online`, '1');
            }

            if(!clients.find((clnt)=>{ return clnt.name == client})){
                this.clients.set(user,[...clients,{name : client,id : clintId}]);
            }
        }
        catch(err){
            console.log("err in subscribe ",err);
        }
    }

    async unSubscribe(user : string){
        console.log('a unsubscribe request is arrived ....');
        try{
            await this.#subConnection.unsubscribe(user);
            this.users.get(user)?.close();
            this.users.delete(user);
            this.clients.delete(user);
            this.#pubConnection.del(`user:${user}:online`);
        }
        catch(err){
            console.log("err in unSubscribe ",err);
        }
    }

    async publishMessage(client : string,msg : string){
        const isClientOnline =await this.#pubConnection.get(`user:${client}:online`);
        if(isClientOnline){
            await this.#pubConnection.publish(client,msg);
        }
        else
        {
            console.log("client is not online");
        }
    }

}



export default RedisDB;

