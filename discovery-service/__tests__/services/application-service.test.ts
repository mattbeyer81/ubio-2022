import { applicationService, GroupNotProvidedError, ApplicationIdNotProvidedError } from "../../src/services/application-service";
import { ubioConnection } from "../../src/data-access";
import { v4 as uuidv4 } from 'uuid';
import { ApplicationModel, Application } from "../../src/models/application-model";
import { ResponseInstance } from "../../src/responses";

beforeAll(done => {
    if (ubioConnection.readyState === 1) {
        done()
    } else {
        ubioConnection.on('open', async function () {
            done();
        });
    }
})

it('Register applicationn instance for first time', async done => {

    const applicationId = 'e335175a-eace-4a74-b99c-c6466b6afadd'

    let groupBeforeCreation: ApplicationModel | null = null;
    let groupAfterCreation: ApplicationModel | null = null;

    try {
        const res = await applicationService.register(
            'particle-detector',
            applicationId,
            {
                "foo": 1
            });
        groupAfterCreation = await Application.findOne({ applicationId });
        await Application.collection.drop();

    } catch (e) {
        console.error('Creating group')
    }

    expect(groupBeforeCreation).toBe(null);
    expect(groupAfterCreation && groupAfterCreation.applicationId).toBe(applicationId);
    done();

})

it('Register applicationn instance for first time - with no group', async done => {

    const applicationId = 'e335175a-eace-4a74-b99c-c6466b6afadd'

    try {
        await applicationService.register(
            '',
            applicationId,
            {
                "foo": 1
            });

    } catch (e) {
        expect(e instanceof GroupNotProvidedError).toBe(true)
    }

    done();

})

it('Register applicationn instance for first time - with no id', async done => {

    const applicationId = 'e335175a-eace-4a74-b99c-c6466b6afadd'

    try {
        await applicationService.register(
            'foo-bar-group',
            '',
            {
                "foo": 1
            });

    } catch (e) {
        expect(e instanceof ApplicationIdNotProvidedError).toBe(true)
    }

    done();

})

it('Update already created Application', async done => {

    const applicationId = 'e335175a-eace-4a74-b99c-c6466b6afadd'
    ubioConnection.states.connected
    let groupBeforeCreation: ApplicationModel | null = null;
    let groupAfterCreation: ApplicationModel | null = null;
    let groupAfterUpdate: ResponseInstance | null = null;

    try {
        await applicationService.register(
            'particle-detector',
            applicationId,
            {
                "foo": 1
            });

        groupAfterCreation = await Application.findOne({ applicationId });

        groupAfterUpdate = await applicationService.register(
            'particle-detector',
            applicationId,
            {
                "foo": 1
            });

    } catch (e) {
        console.error('Creating group')
    }

    await Application.collection.drop();
    expect(groupBeforeCreation).toBe(null);
    expect(groupAfterCreation && groupAfterCreation.applicationId).toBe(applicationId);

    expect(groupAfterCreation && groupAfterCreation.createdAt).toBe(groupAfterUpdate && groupAfterUpdate.createdAt);
    // expect(groupAfterCreation && groupAfterCreation.updatedAt).toBeLessThan(groupAfterUpdate && groupAfterUpdate.updatedAt);

    done();

})

it('Delete', async done => {

    const applicationId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
    const group = 'particle-detector';

    let applicationBeforeDelete: ApplicationModel | null = null;
    let applicationAfterDelete: ApplicationModel | null = null;
    let deletedCount: number = 0;

    try {
        await applicationService.register(
            group,
            applicationId,
            {
                "foo": 1
            });

        applicationBeforeDelete = await Application.findOne({ applicationId });
        deletedCount = await applicationService.delete(group, applicationId);
        applicationAfterDelete = await Application.findOne({ applicationId });


    } catch (e) {
        console.error('Creating group')
    }
    await Application.collection.drop();

    expect(applicationBeforeDelete).not.toBe(undefined);
    expect(applicationAfterDelete).toBe(null);
    expect(deletedCount).toBe(1);


    done();

})


it('Delete - no group provided', async done => {
    try {
        await applicationService.delete('', 'foo-bar-id');
    } catch (e) {
        expect(e instanceof GroupNotProvidedError).toBe(true)
        done();
    }
})

it('Delete - no id provided', async done => {
    try {
        await applicationService.delete('foo-bar-id', '');
    } catch (e) {
        expect(e instanceof ApplicationIdNotProvidedError).toBe(true)
        done();
    }
})


it('Get summary', async done => {

    const group1 = 'particle-detector';
    const group2 = 'not-particle-detector';

    let group1FirstCreated: ResponseInstance;
    let group1LastUpdate: ResponseInstance;

    let group2FirstCreated: ResponseInstance;
    let group2LastUpdate: ResponseInstance;

    let summary: any;

    try {

        group1FirstCreated = await applicationService.register(group1, uuidv4());
        group1LastUpdate = await applicationService.register(group1, uuidv4());

        group2FirstCreated = await applicationService.register(group2, uuidv4());
        await applicationService.register(group2, uuidv4());
        await applicationService.register(group2, uuidv4());
        group2LastUpdate = await applicationService.register(group2, uuidv4());

        summary = await applicationService.getSummary();

    } catch (e) {
        console.error('Getting instances by group')
    }

    await Application.collection.drop();
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

it('Get instances by group', async done => {

    const group = 'particle-detector';

    let groupsBeforeCreation: ApplicationModel[] = [];
    let groupsAfterCreation: ApplicationModel[] = [];

    try {

        groupsBeforeCreation = await applicationService.getByGroup(group);

        await applicationService.register(group, uuidv4());
        await applicationService.register(group, uuidv4());

        groupsAfterCreation = await applicationService.getByGroup(group);

    } catch (e) {
        console.error('Getting instances by group')
    }
    await Application.collection.drop();

    expect(groupsBeforeCreation.length).toBe(0);
    expect(groupsAfterCreation.length).toBe(2);


    done();

})

it('Get instances by group - no group provided', async done => {

    try {
        await applicationService.getByGroup('');
    } catch (e) {
        expect(e instanceof GroupNotProvidedError).toBe(true)
        done();
    }

})


it('Remove expired 1000ms old instance - because it is more than 500ms old', async done => {

    const group = 'particle-detector';

    let deletedCount: number = 0;

    try {
        await applicationService.register(group, uuidv4());
        await new Promise(resolve => setTimeout(resolve, 1000));

        deletedCount = await applicationService.removeExpiredInstances(500)
    } catch (e) {
        e
    }

    await Application.collection.drop();
    expect(deletedCount).toBe(1)
    done()
})

it('Do not remove 1000ms old instance - because it is more than 2000ms old', async done => {

    const group = 'particle-detector';
    let deletedCount: number = 0;

    try {
        await applicationService.register(group, uuidv4());
        await new Promise(resolve => setTimeout(resolve, 1000));

        deletedCount = await applicationService.removeExpiredInstances(2000)
    } catch (e) {
        e
    }

    await Application.collection.drop();
    expect(deletedCount).toBe(0)
    done()
})


afterAll(async done => {
    await ubioConnection.close();
    done();
})