import {
    BadBotHandler,
    DebugLog,
    GoodBotHandler,
    HandlerAgent,
    InputEqualsValidator,
    JetstreamSubscription,
    LogMessageAction,
    ReplyingToBotValidator,
    MessageHandler,
    IntervalSubscription,
    IntervalSubscriptionHandlers,
    AbstractHandler,
    IsSpecifiedTimeValidator,
    CreateSkeetAction, OpenshockClient, OpenshockShockAction, LikeOfUser
} from 'bsky-event-handlers';

const shockBotAgent = new HandlerAgent(
    'shock-bot',
    <string>Bun.env.TEST_BSKY_HANDLE,
    <string>Bun.env.TEST_BSKY_PASSWORD
);

const openshockClient = new OpenshockClient(<string>Bun.env.OPENSHOCK_API_TOKEN);

/**
 * Jetstream Subscription setup
 */
let jetstreamSubscription: JetstreamSubscription;

/** Shocks when the user gets a reply*/
const ShockOnReplyHandler = new MessageHandler(
    // Validator
    [ReplyingToBotValidator.make()],

    //Action
    [
        OpenshockShockAction.make(
        openshockClient,              // An instance of OpenshockClient
        ['device1'],  // Static list of shocker IDs
        25,                  // Intensity: 25%
        1000,                // Duration: 1 second
        true                // Exclusive mode enabled
        )
    ],

    //Bsky agent
    shockBotAgent
)

/** Shocks when the user gets a like */
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


let handlers = {
    post: {
        c: [
            ShockOnReplyHandler,
        ]
    },
    like: {
        c: [
            ShockOnLikeHandler,
        ]
    }
}



async function initialize() {
    await shockBotAgent.authenticate()
    jetstreamSubscription = new JetstreamSubscription(
        handlers,
        <string>Bun.env.JETSTREAM_URL
    );
}

initialize().then(() =>{
    jetstreamSubscription.createSubscription()
    DebugLog.info("INIT", 'Initialized!')
});


process.on('SIGINT', () => {
    process.exit(0);
});
