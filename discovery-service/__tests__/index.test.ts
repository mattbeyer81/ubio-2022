
import Axios from "axios"
import { Registration } from "../src/responses";

it('Register application for first time', async done => {
    const applicationId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
    let applicationIdResult: string = '';
    try {
        const response = await Axios.post('http://localhost:3000/particle-detector/' + applicationId);
        const applicationInstance: Registration = response.data;
        applicationIdResult = applicationInstance.id
    } catch(e) {
        console.error('There was an error creating group')
    }
    expect(applicationId).toBe(applicationIdResult)
    done()
})
