import { Job } from "bullmq";
import SupaBaseDB from "./supabaseDB"
import { Message } from "./routes";


interface MessageJob extends Job{
    data : Message,
}

const db = new SupaBaseDB();
const processor = async function(job : MessageJob){

    console.log("try to insert data");
    const resp = await db.insertData({
        chat_id : job.data.id,
        msg : job.data.message,
    },"UsrMsg");

    if(! resp){
        throw Error(`message failed with error msg ${JSON.stringify(job.data)}`);
    }
}


export default processor;
