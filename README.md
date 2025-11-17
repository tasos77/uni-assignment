### uni-assignment
----
This project implements an end to end solution for users to claim gifts.

### Requirements
- bun runtime
- Docker compose

----
### Setup
- Clone the repository
```
git clone https://github.com/tasos77/uni-assignment
```

- Run project
```
cd uni-assignment
docker compose up -d
```
> **Info**
> The .env file for docker compose is provided in the root of the project. If you want to customize the environment variables, modify the file accordingly.

> **Info**\
> API documentation is available at: `http://localhost:3000/api/v1/docs`

> **Info**\
> Web App is available at: `http://localhost:3001/sign-up`
> In order to use the web app, you need to sign up first.

> **Info**\
> PgAdmin is available at: `http://localhost:8888`
> Set up pgadmin in order to inspect the db.

## Architecture
This API application combines elements of both Clean and Onion architectures richer than Onion but simpler than full Clean Architecture.
The main idea is a clear separation between business logic and infrastructure logic.

---

- Core (`/core`)
In this folder you will find the core business logic of the application.
In more detail, this folder contains the following subfolders:
- `usecases`: Application-specific use cases depending on services.
- `services`: Business services depending on repositories.
- `repositories`: Abstractions that depend on entities.
- `entities`: Pure domain models.
> **Dependency flow: Usecases<-Services<-Repositories<-Entities**
---
- Infrastructure (`/infra`)
In this folder you will find the implementation logic of the application. That means that all the logic that is not related to specific modules or external packages is located here.
In more detail, this folder contains the following subfolders.
- `controllers`: (e.g. HTTP controller).
- `repositories`: Technical implementations of repositories..
- `services`: Technical implementations of services.
- `utils`:Utility functions and helpers.

### Assumptions and Trade offs
- Architecure\
I chose to implement all the core logic flow from the entities to usecases in order to ensure a clear separation of concerns and to make the code more maintainable. Maybe this approach is not the best because in some parts adds bloatware code that simply propagates the data or results without any processing.\
