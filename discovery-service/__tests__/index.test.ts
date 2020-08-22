
import Axios from "axios"

it('Create Group', async done => {
    const groupId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
    let groupIdResult: string = '';
    try {
        const response = await Axios.post('http://localhost:3000/particle-detector/' + groupId);
        groupIdResult = response.data.groupId;
    } catch(e) {
        console.error('There was an error creating group')
        e
    }
    expect(groupId).toBe(groupIdResult) 
    done()
})
