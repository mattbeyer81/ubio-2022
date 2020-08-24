# Backend Developer Technical Test

Hi there!

I'm excited about being considered to join ub.io's small team of dedicated engineers.

Below you will find the documentation to the technical test that will help you understand my ability to write clean concise code, which is easy to reason about, maintain and support.

You will see my approach to naming (because we all know how hard naming is!) and structuring the entities around my codebase, as well as testing and documenting them.

Good luck installing, testing and running this service, and I looking forward to being welcomed aboard.
If you get stuck, or have any questions don't hestitate to give me a call on 07967 337442 or email me at `matthewebeyer@hotmail.com`


## Requirements

* Docker
* Git


## Installation

`git clone https://gitlab.com/matthewbeyer/ubio.git`

`cd ubio`

`MILLISECOND_EXPIRY_AGE=<NUMBER_MILLISECONDS> docker compose-up`

e.g:

`MILLISECOND_EXPIRY_AGE=10000 docker-compose up`


The service periodically removes expired instances. The "age" of the most recent heartbeat of an instance to be considered expired is configurable with environment variable `MILLISECOND_EXPIRY_AGE` and has a default value of 86400000 milliseconds (1 day).

This will start a node HTTP server listening on port 3000.

## Testing

This will run a series of tests demonstrating the use of the API.

* (To enter the docker container) `docker exec -it ubio_discoveryservice_1 sh`
* `npm test -- --verbose`


## Endpoints as documented in https://github.com/ubio/technical-challenges/tree/master/backend

To play with this API:

`docker exec -it ubio_discoveryservice_1 sh` 

...and then follow curl examples below:


#### POST http://localhost:3000/:group/:id
* e.g: `curl -XPOST 'http://localhost:3000/particle-detector/e335175a-eace-4a74-b99c-c6466b6afadd' -w "\n"`

#### DELETE http://localhost:3000/:group
* e.g. `curl -XDELETE 'http://localhost:3000/particle-detector/e335175a-eace-4a74-b99c-c6466b6afadd' -w "\n"`


#### GET http://localhost:3000
* e.g: `curl -XGET 'http://localhost:3000' -w "\n"`


#### GET http://localhost:3000/:group
* e.g. `curl -XGET 'http://localhost:3000/particle-detector' -w "\n"`


## Clean up

To start clean-up utilty from your machine:

* `docker exec -it ubio_discoveryservice_1 sh`
* `npm run remove-expired-groups`

To stop clean-up utitilty (from with container):

* `ps -a`
* Find PID of COMMAND `node build/src/utils/remove-expired-groups.js`
* `kill <PID>`

## Naming

### Application and Group
From the spec, the main entity was considered to an `application`. Each application belonged to a different type of `group`.

### id property of the instance

The instance in the spec has a property called `id` which is a unique identifier.
mongodb generally uses the id property to create its own unique primary key for each document. Whilst it appeared that it is possible to use a custom value for id, this was not possible using the chosen mongo wrapper, mongoose. Instead a property called applicationId was used to store the id provided by the client.

## Code structure

Within `discovery-service/src`:
* server.ts, app.ts, `controllers`, `routers` - used express.js to create the node server and handle http requests, routes, and responses.
* `services` handled the business logic, using the application `model` and mongoose to modify and update the mongdb database. The core business logic takes place in `src/services/application-service.ts`. This functionality is tested in `__tests__/services/application-service.test.ts`


Within `__tests__`:
* jest was used to test each of these layers


## Known Issues/Areas for development

### Node v10 vs v12

Several issues were encounted to do with importing node modules using node v12, so unfortunately node v10 was used instead.

### Cron

Much time was spent time to get the alpine linux container to fire cronjobs. Despite experience and familarity using cron, given the time constraint it was decided to use an npm package called `cron`. This was a less than solution but functional solution. 

### Mongo transactions

Ideally the solution would have use mongodb v4's transaction feature to easily create and rollback data during testing. However, much time was spend creating replica sets and run queries using replica sets but this was unsuccessful.

### gitlab-ci.yml

The gitlab-ci.yml is intended only for demonstrative purposes only.

