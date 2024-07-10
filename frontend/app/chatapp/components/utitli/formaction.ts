"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";
import { redirect } from "next/navigation";

export default async function submitForm(formdata : FormData){
    const data = Object.fromEntries(formdata);
    const csrf_token = data.auth_token;
    const cookieJar = cookies();
    const csrf_cookie = (cookieJar.get("next-auth.csrf-token")?.value)?.split("|")[0];
    if(csrf_cookie === csrf_token){
        delete data['rtyppassword'];
        const payload = await axios.post("http://localhost:4000/api/auth/register",data);
        if(payload.status === 201){
            return redirect("/chatapp/Login/");
        }
        else
        {
            return redirect("/chatapp/Signup/");
        }
    }
    return redirect("/chatapp/Signup/");

}