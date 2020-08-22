import * as fs from "fs"
import { CronJob } from 'cron'

import { GroupService } from "../services/group-service";
import { ubioConnection } from "../../src/data-access";

(async () => {

    ubioConnection.on('open', async function () {
        const groupService = new GroupService();
        const job = new CronJob('* * * * * *', async function () {
            const expiryAge = process.env.MILLISECOND_EXPIRY_AGE || '10000';
            const deleteCount = await groupService.removeExpiredInstances(+expiryAge)
            let log = fs.readFileSync('./logs/remove-expired-groups').toString();
            log = log + '\n' + new Date().toString() + `Remove expired groups count: ${deleteCount}`;
            fs.writeFileSync('./logs/remove-expired-groups', log)
        });
        
        job.start();


    });

})();