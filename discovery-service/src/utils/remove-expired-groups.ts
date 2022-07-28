// import { CronJob } from 'cron'

// import { heartService } from "../services/heart-service";
// import { ubioConnection } from "../../src/data-access";

// (async () => {

//     ubioConnection.on('open', async function () {
//         const job = new CronJob('* * * * *', async function () {
//             const expiryAge = process.env.MILLISECOND_EXPIRY_AGE || '86400000';
//             const deleteCount = await heartService.removeExpiredInstances(+expiryAge)
//             console.log('Expired instances - deleted count: ' + deleteCount);
//         });
        
//         job.start();


//     });

// })();