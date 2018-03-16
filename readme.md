## nook.io

The nook.io project consists of three main services

* **ui** - A VueJS experience
* **proxy** - An nginx proxy
* **api** - An ExpressJS application

Prerequisites required for development (and early demo):
* [The docker engine](https://docs.docker.com/install/)
* [NodeJS v8+](https://nodejs.org/en/download/)

The development environment is designed to work on a Unix like operating system. Windows development is currently not supported.

### Quick Start

Ensure that [docker is installed](https://docs.docker.com/install/)

Ensure that nodeJS is up to date by running `node —version` in a bash terminal. The version should be > v8.*

Run npm install in the api directory to install node modules

```
$ cd ./app/api
$ npm install
```

Run npm install in the ui directory to install node modules.

```
$ cd ./app/ui
$ npm install
```

Run all containers:

```
$ cd ./app
$ docker-compose up
```

The application will be avaiable on the following URL's

* http://localhost/ - Will hit the nginx container, the base path `/` will display the UI application.
* http://localhost/health - Will hit the nginx container, the path `/health` will return static JSON.
* http://localhost/api/v1/ - Will hit the api container.

### API Development

The api is a NodeJS express application.

The `docker-compose.yml` will map the api directory as a volume inside the api docker container. When changes are made to files on the local file system (during development), the nodemon application running within the container should detect the file system event notification and trigger a restart of the application within the container. This means that changes to the api should be available via the reverse proxy url's on the fly when running docker-compose.

When running docker-compose the api is available either via 

* The reverse proxy URL `http://localhost/api/v1/` 
* Directly `http://localhost:8082`



**Debugging the API**

A VSCode launch configuration has been included for convenience. It can be initiated by selecting the `Debug API` launch configuration and clicking start.

The currently debugging instance of the application is accessible via `http://localhost:8080`



### UI Development

When docker-compose is running, the container running the UI will run `npm run dev`. See details of what this does in the `package.json` file of the ui folder.

The UI can be developed in any envirionment suitable for Javascript web development. NodeJS and npm are required to install dependencies.

Dependencies can be installed using the following commands:

```
cd ./ui
npm install
npm run dev
```

Note: There may be some issues that arise during development because npm modules are being installed on the host system, but are run in the container. This will be addressed in future releases.

**Running and accessing the UI via the container**

UI will serve static content via it's own web service. When the nginx proxy URL `http://localhost` is used, the UI is both the base path `/` and any unmatching paths (currently all paths that don't match the regex `/api/v1/.*`). The UI conatiner can also be hit directly on `http://localhost:8080`. The application will automatically compile when files are changed. Use ⌘+⇧+R to update the browser.

**Running and accessing the UI directly on the host dev machine**

The VueJS app skeleton has several scripts located in `ui/build`. These can be invoked directly using npm commands. See `ui/package.json` for details. `npm run dev` can be run from a terminal on the development machine to run the application locally. It will be accessible via `http://localhost:8080` when run in this way. The application will automatically compile when files are changed.  Use ⌘+⇧+R to update the browser.



Other Notes:

The UI is a VueJS application. It was initially bootstrapped using the following command:

```
$ npm install -g vue-cli
$ vue init pwa vue-pwa
```

