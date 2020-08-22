import DiscoveryServer from "./server"
import { ubioConnection } from "./data-access";

ubioConnection.on('open', () =>  {
    console.log('Connected to mongo')
    new DiscoveryServer;
});