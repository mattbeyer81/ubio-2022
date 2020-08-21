import { GroupService } from "../services/group-service";

(async () => {
    const groupService = new GroupService();
    const expiryAge = process.env.MILLISECOND_EXPIRY_AGE || '10000';
    const deleteCount = await groupService.removeExpiredInstances(+expiryAge)
    console.log(`Remove expired groups count: ${deleteCount}`)
})();