import { app } from "./app";

class Server {
    constructor() {
        const port = 3000
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        })
    }
}

export const server = new Server