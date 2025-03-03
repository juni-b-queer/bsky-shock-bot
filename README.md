# Bsky Shock Bot 

This bot is just an example and template for using the openshock integration

For openshock diy setup, see the docs in the [bsky-event-handlers repo](https://github.com/juni-b-queer/bsky-event-handlers/blob/beta/src/integrations/openshock/examples/OpenShockDIYGuide.md)

## Bot setup
***The bot is a work in progress*** \
There are five built in handlers, but you can add more!


### Build and configure locally

#### Prerequisites

**Bun** - Bun has a really easy [install guide](https://bun.sh/docs/installation)! I work in a WSL setup, so I'm "using linux", but this should work on regular ol' windows too

**IDE** - Any Typescript IDE should do, use your favorite. I use Jetbrains IDEs for everything, so I'm using WebStorm (which just recently became free for personal use) #NotSponsored(ButIShouldBe)

**Git** - To clone the repo

### Clone repo

`git clone git@github.com:juni-b-queer/bsky-remind-me-bot.git` \
`cd bsky-shock-bot`


### Configure environment
In the directory you'll be running the bot, create a directory named "sessionData" (or change the directory with the env variable `SESSION_DATA_PATH`) \
Then, create a file named `.env` with the necessary variables

```.dotenv
# This value when running in docker
JETSTREAM_URL=ws://jetstream:6008/subscribe

# This value when running in dev/locally
#JETSTREAM_URL=ws://localhost:6008/subscribe

SHOCKBOT_BSKY_HANDLE=
# USE AN APP PASSWORD
SHOCKBOT_BSKY_PASSWORD=

OPENSHOCK_API_TOKEN=

#SESSION_DATA_PATH=


```

In `./src/index.ts`, you'll see the handlers
```typescript
const ShockOnLikeHandler = new MessageHandler(
    [LikeOfUser.make()],
    [OpenshockShockAction.make(
        openshockClient,              // An instance of OpenshockClient
        ['device1', 'device2'],  // Static list of shocker IDs
        25,                  // Intensity: 25%
        1000,                // Duration: 1 second
        true,                // Exclusive mode enabled
    )],
    shockBotAgent
)
```
In order for the action to work, you'll need to change the values in the list of shocker IDs to the actual IDs of the shockers you want to use.


### Edit the handlers
*WIP*

The bot can be edited!
I'll add some easy to edit basic functionality to it so that you can tweak it for your needs.

The pre-existing handlers included are
- Shock when someone replies to you
- Shock when you post
- Shock when someone likes a post of yours
- Shock when someone likes a specific post
- Vibrate when someone follows you

### Run in development
Start jetstream \
`docker compose up -d jetstream`

Start the bot \
`bun run ./src/index.ts`

### Building and running as a container
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

### Pre-built container setup
*WIP*

Will I get around to making and publishing a basic bot? Or will building and running from source be the only way? \
*The world my never know*

#### Pull the image

#### Run the bot container on the command line

#### Run the bot with a docker compose file
