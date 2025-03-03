# Bsky Shock Bot 

This bot is just an example and template for using the openshock integration

## Bot setup
***The bot is not ready or published yet.*** This is just me doing the initial work in preparation for it, this part of the docs will likely be moved to the bot repo.

### Configure environment
In the directory you'll be running the bot, create a directory named "sessionData" (or change the directory with the env variable `SESSION_DATA_PATH`) \
Then, create a file named `.env` with the necessary variables

```.dotenv
JETSTREAM_URL=ws://jetstream:6008/subscribe
#JETSTREAM_URL=ws://localhost:6008/subscribe



SHOCKBOT_BSKY_HANDLE=
# USE AN APP PASSWORD
SHOCKBOT_BSKY_PASSWORD=

OPENSHOCK_API_TOKEN=

#SESSION_DATA_PATH=

# Optional parameters depending on how you'll run the bot
#OPTIONAL_URL=

```



### Build and configure locally

#### Prerequisites

**Bun** - Bun has a really easy [install guide](https://bun.sh/docs/installation)! I work in a WSL setup, so I'm "using linux", but this should work on regular ol' windows too

**IDE** - Any Typescript IDE should do, use your favorite. I use Jetbrains IDEs for everything, so I'm using WebStorm (which just recently became free for personal use) #NotSponsored(ButIShouldBe)

**Git** - To clone the repo

#### Clone repo

`git clone git@github.com:juni-b-queer/bsky-remind-me-bot.git` \
`cd bsky-shock-bot`

Add the `.env` file from earlier into this directory

#### Docker compose (recommended)

Create a file `docker-compose.yml` and add the following YAML
```yaml
services:
  bskyshockbot:
    depends_on:
      - jetstream
    build: .
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - ./sessionData:/sessionData
    networks:
      - bskybotnetwork

  jetstream:
    image: {CONTAINER}
    container_name: jetstream
    restart: unless-stopped
    environment:
      - CURSOR_FILE=/data/cursor.json
    ports:
      - "6008:6008"
    volumes:
      - ./data:/data
    networks:
      - bskybotnetwork

networks:
  bskybotnetwork:
    driver: bridge

```

To start the bot, run `docker compose up`

To run it without logs, run `docker compose up -d`. Stop it with `docker compose down`

#### Docker CLI

Create the network `docker network create -d bridge bsky-bot-network`

Run Jetstream `docker run -e CURSOR_FILE=/data/cursor.json -v ./data:/data --network bsky-bot-network --name jetstream -d {CONTAINER}`

Build the container with `docker build . -t $USER/bsky-shock-bot`

Run the built container with `docker run --env-file .env -v ./sessionData:/sessionData --network bsky-bot-network $USER/bsky-shock-bot`



#### Edit the handlers
*WIP*

The bot can be edited! It's not built and ready yet, but it will be soon!
I'll add some easy to edit basic functionality to it so that you can tweak it for your needs.

#### Run in development

*WIP*

`docker compose up -d jetstream`

`bun run ./src/index.ts`



### Docker setup

Will I get around to making and publishing a basic bot? Or will building and running from source be the only way? \
*The world my never know*

#### Pull the image

#### Run the bot container on the command line

#### Run the bot with a docker compose file

