import * as fs from "fs"
import { CronJob } from 'cron'

import { applicationService } from "../services/application-service";
import { ubioConnection } from "../../src/data-access";

(async () => {

    ubioConnection.on('open', async function () {
        const job = new CronJob('* * * * * *', async function () {
            const expiryAge = process.env.MILLISECOND_EXPIRY_AGE || '10000';
            const deleteCount = await applicationService.removeExpiredInstances(+expiryAge)
            let log = fs.readFileSync('./logs/remove-expired-groups').toString();
            log = log + '\n' + new Date().toString() + `Remove expired groups count: ${deleteCount}`;
            fs.writeFileSync('./logs/remove-expired-groups', log)
        });
        
        job.start();


    });

})();