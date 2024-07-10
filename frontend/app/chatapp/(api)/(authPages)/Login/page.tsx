import AuthForm from "@/app/chatapp/components/ui/Authform"

export default function SignIn(){
    return(
        <div className="w-full h-full flex justify-center items-center">
            <AuthForm className="w-72 border-2 rounded-lg md:w-96 md:p-6" />
        </div>
    )
}