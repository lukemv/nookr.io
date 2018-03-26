## nook.io


**Local Development - Auxiliary services**

* [MongoDB](https://www.mongodb.com/) is a popular NoSQL database which is fairly straight forward to get started with
* [Redis](https://redis.io/) is an in-memory data store




**When to use what (in the context of this app only)?**

* For data that needs to persist, use MongoDB. Examples include cached books and user profile data
* In situations where it doesn't matter if you lose the data, use redis. Examples include cached data and user session information.




**Running the services locally**

For local running of services, a `docker-compose.yml` file has been added to the root of the project. To bring up the services, ensure that you have a terminal session in the root of the project and use the command

```
$ docker-compose up -d
```

This will bring the containers online. 



**Accessing the services locally**

There are several tools which are appropriaate for accessing redis and node, this is beyond the scope of this document however here are  some examples for OSX

* Redis: [redis-cli](https://redis.io/topics/rediscli)
* Redis: [redis-desktop-manager](https://redisdesktop.com/)
* Redis: [medis](https://github.com/luin/medis)
* Mongo: [Robo 3T][https://robomongo.org/]




**Accessing the services remotely**

Add your ip address to the `nookr-network-security-operators` security group and use `srv.nookr.io` as the host name. Access using the same tooling that you would use locally

**MongoDB:** mongodb://srv.nookr.io/nookr

**Redis:** srv.nookr.io:6379 

e.g. `redis-cli -h srv.nookr.io`