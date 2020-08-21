
import Axios from "axios"

import { server } from "../src/server"

it('Foo', async done => {
    const response = await Axios.get('http://localhost:3000/');
    response
    done();
})
