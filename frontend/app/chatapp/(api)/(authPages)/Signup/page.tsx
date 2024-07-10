import SignUpForm from "@/app/chatapp/components/ui/SingupForm";

export default function SingUp(){
    return(
        <div className="w-full h-full flex justify-center items-center">
            <div>
               <h1 className="text-2xl font-bold underline pb-3 text-center text-gray-600">Create an Account</h1>
               <SignUpForm className="w-72 border-2 rounded-lg md:w-96 md:p-6 *:w-full" />
            </div>
        </div>
    )
}

