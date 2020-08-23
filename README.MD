# Backend Developer Technical Test

Hi there!

I'm excited about being considered to join ub.io's small team of dedicated engineers.

Below you will find documentation to the technical test that will help you understand my ability to write clean concise code, which is easy to reason about, maintain and support.

You will see my approach to naming (because we all know how hard naming is!) and structuring the entities around my codebase, as well as testing and documenting them.

Good luck installing, testing and running this service, and I looking forward to being welcomed aboard.
If you get stuck, or have any questions don't hestitate to give me a call on 07967 337442


## Requirements

Docker


## Installation

`git clone https://gitlab.com/matthewbeyer/ubio.git`

`cd ubio`

`MILLISECOND_EXPIRY_AGE=<NUMBER_MILLISECONDS> docker compose-up`

e.g:

`MILLISECOND_EXPIRY_AGE=10000 docker compose-up`


The service periodically removes expired instances. The "age" of the most recent heartbeat of an instance to be considered expired is configurable with environment variable `NUMBER_MILLISECONDS` and has a default value of 10000 milliseconds.

This will start a node HTTP server listening on port 3000.

## Testing

`docker exec ubio_discoveryservice_1 sh -c "npm test -- -v"`


### Endpoints

To play in the playgroud:

`docker exec -it ubio_discoveryservice_1 sh` 

...and then follow curl examples below:


#### POST
http://localhost:3000/`<GROUP>`/`<ID>`

e.g:

`curl -XPOST 'http://localhost:3000/particle-detector/e335175a-eace-4a74-b99c-c6466b6afadd' -w "\n"`

#### DELETE
http://localhost:3000/:group

e.g.

`curl -XDELETE 'http://localhost:3000/particle-detector/e335175a-eace-4a74-b99c-c6466b6afadd' -w "\n"`


#### GET
http://localhost:3000/

e.g:

`curl -XPOST 'http://localhost:3000' -w "\n"`


#### GET
* http://localhost:3000/<GROUP>

e.g.

`curl -XGET 'http://localhost:3000/particle-detector/e335175a-eace-4a74-b99c-c6466b6afadd' -w "\n"`



## Clean up

To start clean-up utilty from your machine:

* `docker exec -it ubio_discoveryservice_1 sh`
* `npm run remove-expired-groups`

To stop clean-up utitilty (from with container):

* `ps -a`
* Find PID of COMMAND `node build/src/utils/remove-expired-groups.js`
* `kill <PID>`

## Implementation Decisions.

* Node v10!
* groupId vs mongodb _id
* npm cron vs linux cron


## Submitting solution

- Optional: Deploying the solution to some public service like Glitch
- Optional: Showing a green CI page would also be beneficial
