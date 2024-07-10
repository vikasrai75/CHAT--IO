import { Queue, QueueOptions } from "bullmq";
import { config } from "dotenv";
import { redisConnection } from "./redis";

config();


const queueOptions = {
    connection : {...redisConnection},
    defaultJobOptions : {
        removeOnComplete : true,
        removeOnFail : true,
        attempts : 2,
    },
} as QueueOptions;


const queue = new Queue("chatio:msg",queueOptions);

export default queue;