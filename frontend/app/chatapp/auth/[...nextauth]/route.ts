import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";
import axios from "axios";


const authOptions : NextAuthOptions  = {
        providers : [
            GithubProvider({
                clientId : process.env["GITHUB_CLIENT_ID"] ?? '',
                clientSecret : process.env['GITHUB_CLIENT_SECRET'] ?? '',
            }),
            GoogleProvider({
                clientId : process.env["GOOGLE_CLIENT_ID"] ?? '',
                clientSecret : process.env['GOOGLE_CLIENT_SECRET'] ?? '',
            }),
            CredentialsProvider({
                name : 'credentials',
                credentials : {},
                async authorize(credentials : any,req){
                    const csrf_token = req.body?.csrfToken;
                    credentials['auth_token'] = csrf_token;
                    try{
                        const response = await axios.post("http://localhost:4000/api/auth/login",credentials);
                        if(response.status == 200){
                            if(response.data.clientAuthenticated == true){
                                return response.data.user;
                            }
                        }
                    }
                    catch(err){
                        console.log("there is an error occurs",err);
                    }
                    return null;
                }
            }),
        ],
        pages:{
            signIn : "/chatapp/Login",
        },
        session : {
            strategy : "jwt",
            maxAge : 60 * 60 * 24,
            updateAge : 60 * 60 * 24,
        },
        jwt : {
            maxAge : 60 * 60 * 60,
        },
        callbacks : {
            async redirect(params){
                if(params.url.startsWith("/")){
                    return new URL(params.url,params.baseUrl).href;
                }
                return params.url;
            }
            // signIn({user,profile,account,email,credentials}){
            //     console.log("signin is called");
            //     console.log(user,profile,account);
            //     return true;
            // },
            // session({token,session,newSession,trigger,user}){
            //     console.log("session page",token);
            //     console.log(token,session,newSession);
            //     return session
            // },
            // jwt({token,user,account,profile,trigger,isNewUser}){
            //     console.log("jwt page");
            //     console.log(token,user,account);
            //     return token;
            // },
        }
};

const handler = NextAuth(authOptions);

export {handler as GET ,handler as POST};
export {authOptions};