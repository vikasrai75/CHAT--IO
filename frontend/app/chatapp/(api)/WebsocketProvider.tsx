"use client";

import React, { createContext } from "react";

type WS_STATE = {
    ws : WebSocket,
    status : "open" | "close",
}

const WebsocketContext = createContext<WS_STATE>({status : "close"} as WS_STATE);

function WebSocketProvider({children} : {children : React.ReactNode}){
    const [ws,setWs] = React.useState<WS_STATE>({status : "close"} as WS_STATE);
    const retry = React.useRef(0);
    React.useEffect(()=>{
        var websocket = new WebSocket("ws://localhost:4000/chat");
        const handleConnect = ()=>{
            setWs({
                ws : websocket,
                status : "open",
            });
        };
        const handleClose = ()=>{
            handleError();
            if(retry.current < 2){
                window.setTimeout(()=>{
                    try{
                        websocket = new WebSocket("ws://localhost:4000/chat");
                    }
                    catch(err){
                        console.log(err)
                    }
                    finally{
                        ++retry.current;
                    }
                },1000);
            }
        };
        const handleError = ()=>{
            setWs({
                status : "close",
            } as WS_STATE);
        };

        websocket.addEventListener("open",handleConnect);
        websocket.addEventListener("close",handleClose);
        websocket.addEventListener("error",handleError);
        return ()=>{
            console.log("it is rerenderd as a recoil state changes");
            websocket.removeEventListener("open",handleConnect);
            websocket.removeEventListener("close",handleClose);
            websocket.removeEventListener("error",handleError);
            websocket.close();
        }
    },[]);
    return(
        <WebsocketContext.Provider value={ws} >
            {children}
        </WebsocketContext.Provider>
    )
}

const useWebSocket = function(){
    const value = React.useContext(WebsocketContext)
    return value;
}

export {WebSocketProvider,useWebSocket};