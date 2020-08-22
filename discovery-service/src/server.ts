import * as http from "http";

import { app } from "./app";

export default class Server {
    server: http.Server;
    constructor() {
        const port = 3000
        this.server = app.listen(port, () => {
            console.log(`Listening at http://localhost:${port}`)
        })
    }
}