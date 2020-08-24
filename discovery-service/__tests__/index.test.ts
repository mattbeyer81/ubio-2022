
import Axios from "axios"
import { Registration } from "../src/responses";

it('Register application instance for first time', async done => {
    const applicationId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
    let registration: Registration | null = null
    try {
        const response = await Axios.post('http://localhost:3000/particle-detector/' + applicationId, { foo: 1 });
        registration = response.data;
    } catch(e) {
        console.error('There was an error creating group')
    }
   
    if (registration) {
        expect(registration.id).toBe(applicationId)
        expect(registration.meta).toStrictEqual({ foo: 1 })
        done()

    }
})
