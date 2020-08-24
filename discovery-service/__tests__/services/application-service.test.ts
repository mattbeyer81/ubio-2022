import { heartService, GroupNotProvidedError, ApplicationIdNotProvidedError } from "../../src/services/heart-service";
import { ubioConnection } from "../../src/data-access";
import { v4 as uuidv4 } from 'uuid';
import { HeartModel, Heart } from "../../src/models/heart-model";
import { Registration, Summary } from "../../src/responses";

beforeAll(done => {
    if (ubioConnection.readyState === 1) {
        done()
    } else {
        ubioConnection.on('open', async function () {
            await Heart.deleteMany({});
            done();
        });
    }
})

afterEach(async done => {
    await Heart.deleteMany({});
    done();
})


it('Register application instance for first time', async done => {

    const applicationId = uuidv4();

    let beforeCreation: HeartModel | null = null;
    let afterCreation: HeartModel | null = null;

    try {
        await heartService.register('particle-detector', applicationId);
        afterCreation = await Heart.findOne({ applicationId });

    } catch (e) {
        console.error('Creating registration')
    }

    expect(beforeCreation).toBe(null);
    expect(afterCreation && afterCreation.applicationId).toBe(applicationId);
    done();

})

it('Register applicationn instance for first time - with no group', async done => {

    const applicationId = uuidv4();

    try {
        await heartService.register(
            '',
            applicationId,
            {
                "foo": 1
            });

    } catch (e) {
        expect(e instanceof GroupNotProvidedError).toBe(true)
        done();
    }
})

it('Register applicationn instance for first time - with no id', async done => {

    try {
        await heartService.register(
            'foo-bar-group',
            '',
            {
                "foo": 1
            });

    } catch (e) {
        expect(e instanceof ApplicationIdNotProvidedError).toBe(true)
        done();
    }
})

it('Update already created Application', async done => {

    const applicationId = uuidv4();
    let beforeCreation: HeartModel | null = null;
    let afterCreation: HeartModel | null = null;
    let afterUpdate: Registration | null = null;

    try {
        await heartService.register(
            'particle-detector',
            applicationId,
            {
                "foo": 1
            });

        afterCreation = await Heart.findOne({ applicationId });

        afterUpdate = await heartService.register(
            'particle-detector',
            applicationId,
            {
                "foo": 1
            });

    } catch (e) {
        console.error('Updating registration')
    }

    if (afterUpdate && afterCreation) {
        expect(beforeCreation).toBe(null);
        expect(afterCreation.applicationId).toBe(applicationId);
        expect(afterCreation.createdAt).toBe(afterCreation && afterUpdate.createdAt);
        expect(afterCreation && afterCreation.updatedAt).toBeLessThan(afterUpdate.updatedAt);
        done();
    }

})

it('Delete', async done => {

    const applicationId = uuidv4();
    const group = 'particle-detector';

    let beforeDelete: HeartModel | null = null;
    let afterDelete: HeartModel | null = null;
    let deletedCount: number = 0;

    try {
        await heartService.register(
            group,
            applicationId,
            {
                "foo": 1
            });

        beforeDelete = await Heart.findOne({ applicationId });
        deletedCount = await heartService.delete(group, applicationId);
        afterDelete = await Heart.findOne({ applicationId });


    } catch (e) {
        console.error('Creating group')
    }

    expect(beforeDelete).not.toBe(undefined);
    expect(afterDelete).toBe(null);
    expect(deletedCount).toBe(1);

    done();

})


it('Delete - no group provided', async done => {
    try {
        await heartService.delete('', 'foo-bar-id');
    } catch (e) {
        expect(e instanceof GroupNotProvidedError).toBe(true)
        done();
    }
})

it('Delete - no id provided', async done => {
    try {
        await heartService.delete('foo-bar-id', '');
    } catch (e) {
        expect(e instanceof ApplicationIdNotProvidedError).toBe(true)
        done();
    }
})


it('Get summary 1', async done => {

    let summary: Summary | null = null;
    try {
        await Heart.insertMany([
            { applicationId: uuidv4(), group: 'foo-bar', createdAt: 1, updatedAt: 10 },
            { applicationId: uuidv4(), group: 'foo-bar', createdAt: 2, updatedAt: 20 },
            { applicationId: uuidv4(), group: 'foo-car', createdAt: 3, updatedAt: 30 },
            { applicationId: uuidv4(), group: 'foo-car', createdAt: 4, updatedAt: 40 },
            { applicationId: uuidv4(), group: 'foo-car', createdAt: 5, updatedAt: 50 },
        ])

        summary = await heartService.getSummary();

    } catch (e) {
        console.error('Getting instances by group')
    }

    if (summary) {
        const [group1Summary, group2Summary] = summary;

        expect(group1Summary.createdAt).toBe(1)
        expect(group1Summary.lastUpdatedAt).toBe(20)

        expect(group2Summary.createdAt).toBe(3)
        expect(group2Summary.lastUpdatedAt).toBe(50)

        expect(group1Summary.instances).toBe(2)
        expect(group2Summary.instances).toBe(3)
        done();
    }
})

it('Get summary 2', async done => {

    let summary: Summary | null = null;

    try {
        await Heart.insertMany([
            { applicationId: uuidv4(), group: 'foo-car', createdAt: 3, updatedAt: 30 },
            { applicationId: uuidv4(), group: 'foo-car', createdAt: 4, updatedAt: 140 },
            { applicationId: uuidv4(), group: 'foo-car', createdAt: 5, updatedAt: 50 },
            { applicationId: uuidv4(), group: 'foo-car', createdAt: 5, updatedAt: 50 },
            { applicationId: uuidv4(), group: 'foo-bar', createdAt: 1, updatedAt: 10 },
            { applicationId: uuidv4(), group: 'foo-bar', createdAt: 2, updatedAt: 120 },
            { applicationId: uuidv4(), group: 'foo-bar', createdAt: 2, updatedAt: 5 },
            { applicationId: uuidv4(), group: 'foo-bar', createdAt: 2, updatedAt: 20 },
            { applicationId: uuidv4(), group: 'foo-bar', createdAt: 2, updatedAt: 20 },
            { applicationId: uuidv4(), group: 'foo-bar', createdAt: 2, updatedAt: 20 },
        ])

        summary = await heartService.getSummary();

    } catch (e) {
        console.error('Getting instances by group')
    }

    if (summary) {
        const [group1Summary, group2Summary] = summary;

        expect(group1Summary.group).toBe('foo-bar')
        expect(group1Summary.createdAt).toBe(1)
        expect(group1Summary.lastUpdatedAt).toBe(120)

        expect(group2Summary.group).toBe('foo-car')
        expect(group2Summary.createdAt).toBe(3)
        expect(group2Summary.lastUpdatedAt).toBe(140)


        expect(group1Summary.instances).toBe(6)
        expect(group2Summary.instances).toBe(4)
        done();
    }
})

it('Get instances by group', async done => {

    const group = 'particle-detector';

    let registrationsBefore: Registration[] = [];
    let registrationsAfter: Registration[] = [];
    try {

        registrationsBefore = await heartService.getByGroup(group);

        await heartService.register(group, 'abc');
        await heartService.register(group, 'def');

        registrationsAfter = await heartService.getByGroup(group);

    } catch (e) {
        console.error('Getting instances by group')
    }

    expect(registrationsAfter[0].id).toBe('abc')
    expect(registrationsAfter[1].id).toBe('def')


    expect(registrationsBefore.length).toBe(0);
    expect(registrationsAfter.length).toBe(2);


    done();

})

it('Get instances by group - no group provided', async done => {

    try {
        await heartService.getByGroup('');
    } catch (e) {
        expect(e instanceof GroupNotProvidedError).toBe(true)
        done();
    }
})


it('Remove expired 1000ms old instance - because it is more than 500ms old', async done => {

    const group = 'particle-detector';

    let deletedCount: number = 0;
    await Heart.deleteMany({});
    try {
        await heartService.register(group, uuidv4());
        await new Promise(resolve => setTimeout(resolve, 1000));

        deletedCount = await heartService.removeExpiredInstances(500)
    } catch (e) {
        console.log('There was an error removing expired instances more than 500ms old')
    }

    expect(deletedCount).toBe(1)
    done()
})

it('Do not remove 1000ms old instance - because it is more than 2000ms old', async done => {

    const group = 'particle-detector';
    let deletedCount: number = 0;

    await Heart.deleteMany({ createdAt: { $gte: 0 } });
    try {
        await heartService.register(group, uuidv4());
        await new Promise(resolve => setTimeout(resolve, 1000));

        deletedCount = await heartService.removeExpiredInstances(2000)
    } catch (e) {
        console.log('There was an error removing expired instances more than 2000ms old')
    }

    expect(deletedCount).toBe(0)
    done()
})


afterAll(async done => {
    await ubioConnection.close();
    done();
})