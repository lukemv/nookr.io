This is a static website which can be used to add any public content that might need to be referenced.

The project can be run in one of two ways.

Inside a container

```
docker-compose up
```

Or, as a standalone application:

```
./node_modules/.bin/harp server -i 0.0.0.0 -p 8083 src/
```

Note that the npm_modules contents will need to be different inside and outside of the container so you'll need to delete and re-create the folder if you want to alter the way you run the application.

```
$ rm -rf node_modules
$ npm install
```