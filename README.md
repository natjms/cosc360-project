# COSC360 project

Team members: Estella Arnott (79989893), Megan Dava (48785497), Ailish Curran (69558252), Nat Scott (31533524)

## Setup

Create a .env file in the `/backend` directory. This can be done by cloning the example.env file:

on MacOS/Linux:
```
cd backend; cp example.env .env
```

## Run

To run the site, run
```
docker compose up
```
in a terminal window in the base directory. By default, the site will run at http://localhost:5173/.

## Test

To run the test suite, run
```
docker exec -ti library-backend npm run test
```
once the docker container is running. (press d to detach or use a separate terminal window)
