"use server";
import axios from "axios";
import { authOptions } from "../../auth/[...nextauth]/route";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";

export default async function addLoginUser(){
    const session = await getServerSession(authOptions);
    if(session){
        const user = await axios.get("http://localhost:4000/api/usr/search",{
            params : {
                q : session.user?.email
            }
        });
        if(user.status == 200 && user.data[0].email){
            return;
        }
        else
        {
            const cookieJar = cookies();
            const csrf_cookie = (cookieJar.get("next-auth.csrf-token")?.value)?.split("|")[0];
            const resp = await axios.post("http://localhost:4000/api/auth/register",{
                type : "auth2",
                email : session.user?.email,
                username : session.user?.name,
                auth_token  : csrf_cookie,
            });
            if(resp.status !== 201){
                throw Error("user can not be created");
            }
        }
    }
}