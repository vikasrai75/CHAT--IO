"use client";

import React, { FormEvent, HTMLAttributes } from "react";
import { combineClasses } from "../utitli/helpers";
import { signIn } from "next-auth/react";
import Button from "./button";
import Link from "next/link";

type FormProps = HTMLAttributes<HTMLFormElement>;

export default function AuthForm({className,action,method,...props} :
     {className ?: string,action ?: string,method ?: string,props ?: FormProps}){
      function handleFormSubmit(ev : FormEvent<HTMLFormElement>){
         const formdata = new FormData(ev.currentTarget);
         signIn("credentials",{
            email : formdata.get("email"),
            password : formdata.get("password"),
            callbackUrl : "/chatapp/Chat/",
         });
         ev.preventDefault()
         return false;
      }
    return(
      <div>
        <h1 className="font-bold text-3xl text-gray-700 underline font-sans text-center pb-6">Account Login</h1>
        <form action={action} method={method} {...props} onSubmit={handleFormSubmit}
               className={combineClasses("flex flex-col gap-4 p-4 justify-center *:box-border",className)}>
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
                       required/>
            </span>
            <span>
                <label htmlFor="password" className="mb-2 inline-block text-base font-medium">Password</label>
                <input type="password" 
                       autoCorrect="false"
                       autoCapitalize="false"
                       name="password"
                       id="password"
                       placeholder="password"
                       defaultValue={''}
                       className="border w-full p-1 focus:outline-none focus:ring-1 focus:ring-blue-300 rounded-sm text-slate-600" 
                       required />
            </span>
            <Button className="border-2 px-3 capitalize w-full shadow hover:shadow-md hover:bg-blue-700" >Login</Button>
            <span className="py-2 text-gray-600">
               Don't have account ? <Link href={"/chatapp/Signup/"} title="sign up" className="text-blue-600 underline ml-1">sign up</Link>
            </span>
            <div className="inline-block w-full border-b-2 border-gray-400 text-gray-600 relative">
              <span className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 bg-white px-2 text-lg text-gray-600">or</span>
            </div>
            <span>
                <Button onClick={()=> signIn("github",{callbackUrl : "/chatapp/Chat/"})} className="border-2 px-3 capitalize w-full shadow hover:shadow-md bg-black/85 hover:bg-black">
                    sign in with github 
                    <Icon433Github className="inline-block size-5 ml-2"/>
                </Button>
            </span>
            <span>
                <Button  onClick={()=> signIn("google",{callbackUrl : "/chatapp/Chat/"})} className="border-2 px-3 capitalize w-full shadow hover:shadow-md bg-white/85 hover:bg-white text-black">
                    sign in with google
                    <IconGoogleCircle className="inline-block size-5 ml-2"/>
                </Button>
            </span>
        </form>
      </div>
    )
}


function Icon433Github(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        height="1em"
        width="1em"
        {...props}
      >
        <path
          fill="currentColor"
          d="M8 .198a8 8 0 00-2.529 15.591c.4.074.547-.174.547-.385 0-.191-.008-.821-.011-1.489-2.226.484-2.695-.944-2.695-.944-.364-.925-.888-1.171-.888-1.171-.726-.497.055-.486.055-.486.803.056 1.226.824 1.226.824.714 1.223 1.872.869 2.328.665.072-.517.279-.87.508-1.07-1.777-.202-3.645-.888-3.645-3.954 0-.873.313-1.587.824-2.147-.083-.202-.357-1.015.077-2.117 0 0 .672-.215 2.201.82A7.672 7.672 0 018 4.066c.68.003 1.365.092 2.004.269 1.527-1.035 2.198-.82 2.198-.82.435 1.102.162 1.916.079 2.117.513.56.823 1.274.823 2.147 0 3.073-1.872 3.749-3.653 3.947.287.248.543.735.543 1.481 0 1.07-.009 1.932-.009 2.195 0 .213.144.462.55.384A8 8 0 008.001.196z"
        />
      </svg>
    );
  }
  
  
  function IconGoogleCircle(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox="0 0 1024 1024"
        fill="currentColor"
        height="1em"
        width="1em"
        {...props}
      >
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm167 633.6C638.4 735 583 757 516.9 757c-95.7 0-178.5-54.9-218.8-134.9C281.5 589 272 551.6 272 512s9.5-77 26.1-110.1c40.3-80.1 123.1-135 218.8-135 66 0 121.4 24.3 163.9 63.8L610.6 401c-25.4-24.3-57.7-36.6-93.6-36.6-63.8 0-117.8 43.1-137.1 101-4.9 14.7-7.7 30.4-7.7 46.6s2.8 31.9 7.7 46.6c19.3 57.9 73.3 101 137 101 33 0 61-8.7 82.9-23.4 26-17.4 43.2-43.3 48.9-74H516.9v-94.8h230.7c2.9 16.1 4.4 32.8 4.4 50.1 0 74.7-26.7 137.4-73 180.1z" />
      </svg>
    );
  }
  
