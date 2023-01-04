# code-grader

## Running the application

Prerequisites: Docker and docker-compose. Check out
[Docker Desktop](https://www.docker.com/products/docker-desktop/) if you have
not them installed

1. Create the grader docker image
  If you don't have grader-image in as Docker container then:
  1.1. Go to grader-image folder
  1.2. Build the container

```bash
  docker build -t grader-image .
```

2. Go to folder containing the docker-compose.yml and run the docker compose
   function

```bash
docker-compose up --build
```

or

```bash
docker-compose build --no-cache
docker-compose up
```

!! If your system has containers with same names than the ones in the
docker-compose, rename the container names and start again.

3. Wait until **flyway** has loaded.

The actual website is available faster than the actual database when first
running the program. Please wait until flyway notifies you about it successfully
migrating to version 1 of database.

3. Open the application in [http://localhost:8000](http://localhost:8000) If any
   of the steps fails, please close the container instance and repeat these
   steps. If API did not start with the first try, try running
   `docker-compose up --build` again.

## Running the tests

In order to run the tests, the application needs to be running. Tests can be
found in load_test folder.

1. Go to load_test folder.
2. Run the tests in docker.

```bash
docker run --rm -i --network=host grafana/k6 run - <main_page.js
docker run --rm -i --network=host grafana/k6 run - <submit.js
```

## Performance test results

| test                | average (ms) | media (ms) | 95th (ms) | 99th (ms) |
| ------------------- | ------------ | ---------- | --------- | --------- |
| "main page" /       | 76.55        | 69.6       | 128.05    | 167.74    |
| "api endpoint" /api | 28.6         | 25.86      | 52.01     | 71.41     |

## Core Web Vitals

| page                                  | performance | accessibility | best practices | SEO | PWA |
| ------------------------------------- | ----------- | ------------- | -------------- | --- | --- |
| "main page" /                         | 86          | 97            | 92             | 89  | -   |
| "exercise page" /exercises/exercise-1 | 100         | 84            | 92             | 89  | -   |
