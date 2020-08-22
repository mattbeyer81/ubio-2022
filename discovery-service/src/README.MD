# Backend Developer Technical Test

Hi there!

I'm excited about being considered to join ub.io's small team of dedicated engineers.

Below you will find documentation to the technical test that will help you understand my ability to write clean concise code, which is easy to reason about, maintain and support.

You will see my approach to naming (because we all know how hard naming is!) and structuring the entities around my codebase, as well as testing and documenting them.

Good luck I installing, testing and running this service, and I looking forward to being welcomed aboard.

## Installation

`git clone https://gitlab.com/matthewbeyer/ubio.git`

`cd ubio`

`MILLISECOND_EXPIRY_AGE=<NUMBER_MILLISECONDS> docker compose-up`

The service periodically removes expired instances. The "age" of the most recent heartbeat of an instance to be considered expired is configurable with environment variable `NUMBER_MILLISECONDS` and have a default value of 10000 milliseconds.

This will start a node HTTP server listening on port 3000.

## Testing

`docker exec ubio_discoveryservice_1 sh -c "npm test"`


### Endpoints


POST
* http://localhost:3000/`<GROUP>`/`<ID>`


DELETE
* http://localhost:3000/:group


GET
* http://localhost:3000/

GET
* http://localhost:3000/


GET
* http://localhost:3000/<GROUP>



## Implementation Decisions.

* Node v10!
* groupId vs mongodb _id
* npm cron vs linux cron


## Submitting solution

- Optional: Deploying the solution to some public service like Glitch
- Optional: Showing a green CI page would also be beneficial
