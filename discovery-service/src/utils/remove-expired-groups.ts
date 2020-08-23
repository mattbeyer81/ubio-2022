import { CronJob } from 'cron'

import { applicationService } from "../services/application-service";
import { ubioConnection } from "../../src/data-access";

(async () => {

    ubioConnection.on('open', async function () {
        const job = new CronJob('* * * * * *', async function () {
            const expiryAge = process.env.MILLISECOND_EXPIRY_AGE || '10000';
            const deleteCount = await applicationService.removeExpiredInstances(+expiryAge)
            console.log('Expired instances - deleted count' + deleteCount);
        });
        
        job.start();


    });

})();