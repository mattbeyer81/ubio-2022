import { app } from "./app";

export default class Server {
    constructor() {
        const port = 3000
        app.listen(port, () => {
            console.log(`Listening at http://localhost:${port}`)
        })
    }
}