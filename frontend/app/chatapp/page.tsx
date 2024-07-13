import img from "@/public/137.png";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { permanentRedirect } from "next/navigation";

export default async function Page(){
    const session = await getServerSession();
    if(session?.user){
        permanentRedirect("/chatapp/Chat");
    }
    return(
        <div className="sm:px-6 sm:pt-2 md:px-8 px-4 w-full overflow-hidden h-full flex items-center gap-6 pt-8">
            <div className="flex-1">
               <p className="lg:text-[3.5rem]/[4rem] text-[2.2rem]/[3rem] font-bold font-robo text-gray-600">
                    Oc-chat made to scaled on large servers.
                </p>
                <p className="text-lg lg:text-xl  font-robo font-semibold text-gray-500 text-justify pt-6">
                    Discover the new way to connect effortlessly with friends and loved ones through our innovative
                    chat application. With sleek design and intuitive features, staying in touch has never been easier.
                    Share moments, express yourself with emojis, and enjoy seamless conversations anytime, anywhere.
                    Join thousands who have already embraced the future of messaging. Download our app today and start
                    chatting in a whole new way!
                </p>
                <div>
                    <Link href="/chatapp/Signup/" className="px-4 mt-6 rounded-full py-2 text-center inline-block font-bold bg-blue-600 text-white hover:bg-blue-400">
                        sign up for free
                    </Link>
                </div>
                <p className="text-sm text-gray-400 pt-4">
                    Create account now and start chatting.
                </p>
            </div>
            <div className="flex-1 hidden md:inline-block">
                <Image src={img} alt="chat image" className="h-full w-full"/>
            </div>
        </div>
    )
} 