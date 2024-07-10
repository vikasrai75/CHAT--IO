"use client";

import React, { FormHTMLAttributes } from "react";
import { combineClasses } from "../utitli/helpers";
import Link from "next/link";
import Button from "./button";
import submitForm from "../utitli/formaction";
import axios from "axios";

type FormProps = FormHTMLAttributes<HTMLFormElement>

export default function SignUpForm({className,method,action,...props} : FormProps){
    const [password,setPassword] = React.useState<string>('');
    const [retypPassword,setRetypPassword] = React.useState<string>('');
    const [authToken,setAuthToken] = React.useState<string>('');
    React.useEffect(()=>{
        axios("/chatapp/auth/csrf"). 
        then((resp)=>{
            if(resp.status == 200){
                setAuthToken(resp.data.csrfToken);
            }
            else
            {
                console.log("csrf could not fetched becouse ",resp.status)
            }
        }). 
        catch((err) => console.error);
    },[]);

    function handlePasswordChange(ev : React.ChangeEvent<HTMLInputElement>){
        setPassword(ev.target.value);
    }

    function handleRtypPasswordChange(ev : React.ChangeEvent<HTMLInputElement>){
        setRetypPassword(ev.target.value);
    }
    return(
        <form {...props} action={submitForm} 
         className={combineClasses("flex flex-col gap-4 p-4 justify-center *:box-border", className)}>
            <input type="text" name="auth_token" defaultValue={authToken} hidden />
            <span>
                <label htmlFor="username" className="mb-2 inline-block text-base font-medium">Username</label>
                <input type="text"
                    autoCorrect="false"
                    autoCapitalize="false"
                    name="username"
                    id="username"
                    placeholder="Username"
                    defaultValue={''}
                    className="border w-full p-1 focus:outline-none focus:ring-1 rounded-sm focus:ring-blue-300 text-slate-600"
                    required />
            </span>
            <span>
                <label htmlFor="email" className="mb-2 inline-block text-base font-medium">Email</label>
                <input type="email"
                    autoCorrect="false"
                    autoCapitalize="false"
                    name="email"
                    id="email"
                    placeholder="Email"
                    defaultValue={''}
                    className="border w-full p-1 focus:outline-none focus:ring-1 rounded-sm focus:ring-blue-300 text-slate-600"
                    required />
            </span>
            <span>
                <label htmlFor="password" className="mb-2 inline-block text-base font-medium">Password</label>
                <input type="password"
                    autoCorrect="false"
                    autoCapitalize="false"
                    name="password"
                    id="password"
                    placeholder="password"
                    value={password}
                    onChange={handlePasswordChange}
                    min={12}
                    max={70}
                    className="border w-full p-1 focus:outline-none focus:ring-1 focus:ring-blue-300 rounded-sm text-slate-600"
                    required />
            </span>
            <span>
                <label htmlFor="rtyppassword" className="mb-2 inline-block text-base font-medium">Re-enter Password</label>
                <input type="password"
                    autoCorrect="false"
                    autoCapitalize="false"
                    name="rtyppassword"
                    id="rtyppassword"
                    placeholder="password"
                    value={retypPassword}
                    onChange={handleRtypPasswordChange}
                    min={12}
                    max={70}
                    className="border w-full p-1 focus:outline-none focus:ring-1 focus:ring-blue-300 rounded-sm text-slate-600"
                    required />
            </span>
            {password !== retypPassword ? 
                <span className="text-red-500 text-base font-medium">
                   * password did not match
                </span> :
            ""}
            <Button disabled={password !== retypPassword || !authToken} 
                    className={combineClasses("border-2 px-3 capitalize w-full shadow hover:shadow-md hover:bg-blue-700 disabled:bg-gray-500","")}>
                Register User
            </Button>
            <span className="py-2 text-gray-600">
                Already have account ? <Link href={"/chatapp/Login/"} title="sign up" className="text-blue-600 underline ml-1">Login</Link>
            </span>
        </form>
    )
}