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

    let groupBeforeCreation: GroupModel | null = null;
    let groupAfterCreation: GroupModel | null = null;

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
    expect(groupAfterCreation && groupAfterCreation.groupId).toBe(groupId);
    done();

})

it('Update already created Group', async done => {

    const groupId = 'e335175a-eace-4a74-b99c-c6466b6afadd'
    ubioConnection.states.connected
    let groupBeforeCreation: GroupModel | null = null;
    let groupAfterCreation: GroupModel | null = null;
    let groupAfterUpdate: GroupModel | null = null;

    const collection = uuidv4();
    const groupService = new GroupService(collection);
    try {
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

    } catch (e) {
        console.error('Creating group')
    }

    await groupService.Group.collection.drop();
    expect(groupBeforeCreation).toBe(undefined);
    expect(groupAfterCreation && groupAfterCreation.groupId).toBe(groupId);

    expect(groupAfterCreation && groupAfterCreation.createdAt).toBe(groupAfterUpdate && groupAfterUpdate.createdAt);
    // expect(groupAfterCreation && groupAfterCreation.updatedAt).toBeLessThan(groupAfterUpdate.updatedAt);

    done();

})

it('Delete', async done => {

    const groupId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
    const group = 'particle-detector';

    let groupBeforeDelete: GroupModel | null = null;
    let groupAfterDelete: GroupModel | null = null;
    let deletedCount: number = 0;

    const collection = uuidv4();
    const groupService = new GroupService(collection);
    try {
        await groupService.create(
            group,
            groupId,
            {
                "foo": 1
            });

        groupBeforeDelete = await groupService.Group.findOne({ groupId });
        deletedCount = await groupService.delete(group, groupId);
        groupAfterDelete = await groupService.Group.findOne({ groupId });


    } catch (e) {
        console.error('Creating group')
    }
    await groupService.Group.collection.drop();

    expect(groupBeforeDelete).not.toBe(undefined);
    expect(groupAfterDelete).toBe(null);
    expect(deletedCount).toBe(1);


    done();

})

it('Get instances by group', async done => {

    const group = 'particle-detector';

    let groupsBeforeCreation: GroupModel[] = [];
    let groupsAfterCreation: GroupModel[] = [];

    const collection = uuidv4();
    const groupService = new GroupService(collection);
    try {

        groupsBeforeCreation = await groupService.getInstancesByGroup(group);

        await groupService.create(group, uuidv4());
        await groupService.create(group, uuidv4());

        groupsAfterCreation = await groupService.getInstancesByGroup(group);


    } catch (e) {
        console.error('Getting instances by group')
    }
    await groupService.Group.collection.drop();

    expect(groupsBeforeCreation.length).toBe(0);
    expect(groupsAfterCreation.length).toBe(2);


    done();

})

it('Get summmary', async done => {

    const group1 = 'particle-detector';
    const group2 = 'not-particle-detector';

    let group1FirstCreated: GroupModel;
    let group1LastUpdate: GroupModel;

    let group2FirstCreated: GroupModel;
    let group2LastUpdate: GroupModel;

    let summary: any;

    const collection = uuidv4();
    const groupService = new GroupService(collection);
    try {

        group1FirstCreated = await groupService.create(group1, uuidv4());
        group1LastUpdate = await groupService.create(group1, uuidv4());

        group2FirstCreated = await groupService.create(group2, uuidv4());
        await groupService.create(group2, uuidv4());
        await groupService.create(group2, uuidv4());
        group2LastUpdate = await groupService.create(group2, uuidv4());

        summary = await groupService.getSummary();

    } catch (e) {
        console.error('Getting instances by group')
    }

    await groupService.Group.collection.drop();
    const [group1Summary, group2Summary] = summary;

    expect(group1Summary._id).toBe(group1)
    expect(group2Summary._id).toBe(group2)

    // expect(group1Summary.createdAt).toBe(group1FirstCreated.createdAt)
    // expect(group1Summary.updatedAt).toBe(group1LastUpdate.updatedAt)

    // expect(group2Summary.createdAt).toBe(group2FirstCreated.createdAt)
    // expect(group2Summary.updatedAt).toBe(group2LastUpdate.updatedAt)

    expect(group2Summary.instances).toBe(4)
    expect(group1Summary.instances).toBe(2)


    done();

})

it('Remove expired 1000ms old instance - because it is more than 500ms old', async done => {

    const group = 'particle-detector';

    const collection = uuidv4();
    const groupService = new GroupService(collection);
    let deletedCount: number = 0;

    try {
        await groupService.create(group, uuidv4());
        await new Promise(resolve => setTimeout(resolve, 1000));

        deletedCount = await groupService.removeExpiredInstances(500)
    } catch (e) {
        e
    }

    await groupService.Group.collection.drop();
    expect(deletedCount).toBe(1)
    done()
})

it('Do not remove 1000ms old instance - because it is more than 2000ms old', async done => {

    const group = 'particle-detector';

    const collection = uuidv4();
    const groupService = new GroupService(collection);
    let deletedCount: number = 0;

    try {
        await groupService.create(group, uuidv4());
        await new Promise(resolve => setTimeout(resolve, 1000));

        deletedCount = await groupService.removeExpiredInstances(2000)
    } catch (e) {
        e
    }

    await groupService.Group.collection.drop();
    expect(deletedCount).toBe(0)
    done()
})


afterAll(async done => {
    await ubioConnection.close();
    done();
})