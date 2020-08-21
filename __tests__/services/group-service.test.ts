import { GroupService } from "../../src/services/group-service";
import { ubioConnection } from "../../src/data-access";
import { v4 as uuidv4 } from 'uuid';
import { GroupModel } from "../../src/models/group-model";

beforeAll(done => {
    if (ubioConnection.readyState === 1) {
        done()
    } else {
        ubioConnection.on('open', async function () {
            done();
        });
    }
})

it('Create Group', async done => {

    const groupId = 'e335175a-eace-4a74-b99c-c6466b6afadd'

    let groupBeforeCreation: GroupModel;
    let groupAfterCreation: GroupModel;

    try {
        const collection = uuidv4();
        const groupService = new GroupService(collection);
        await groupService.create(
            'particle-detector',
            groupId,
            {
                "foo": 1
            });

        groupAfterCreation = await groupService.Group.findOne({ groupId });
        await groupService.Group.collection.drop();

    } catch (e) {
        console.error('Creating group')
    }

    expect(groupBeforeCreation).toBe(undefined);
    expect(groupAfterCreation.groupId).toBe(groupId);
    done();

})

it('Update already created Group', async done => {

    const groupId = 'e335175a-eace-4a74-b99c-c6466b6afadd'
    ubioConnection.states.connected
    let groupBeforeCreation: GroupModel;
    let groupAfterCreation: GroupModel;
    let groupAfterUpdate: GroupModel;

    try {
        const collection = uuidv4();
        const groupService = new GroupService(collection);
        await groupService.create(
            'particle-detector',
            groupId,
            {
                "foo": 1
            });

        groupAfterCreation = await groupService.Group.findOne({ groupId });

        groupAfterUpdate = await groupService.create(
            'particle-detector',
            groupId,
            {
                "foo": 1
            });


        await groupService.Group.collection.drop();

    } catch (e) {
        console.error('Creating group')
    }

    expect(groupBeforeCreation).toBe(undefined);
    expect(groupAfterCreation.groupId).toBe(groupId);

    expect(groupAfterCreation.createdAt).toBe(groupAfterUpdate.createdAt);
    expect(groupAfterCreation.updatedAt).toBeLessThan(groupAfterUpdate.updatedAt);

    done();


})