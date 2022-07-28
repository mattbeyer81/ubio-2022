import { connect } from "mongoose";
import { app } from "./app";

export const port = 3000;
export const server = app.listen(port, async () => {
    console.log('Listening on port: ' + port);
    try {
        await connect('mongodb://localhost:27017/test');
        console.log('Connected to mongodb');
    } catch (e)
    {
        console.log('Failed to connect to mongodb')
    }
});
