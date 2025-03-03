import {
    DebugLog,
    DebugLogAction,
    HandlerAgent,
    JetstreamSubscription,
    LikeOfPost,
    LikeOfUser,
    MessageHandler,
    NewFollowerForUserValidator,
    OpenshockClient,
    OpenshockShockAction,
    OpenshockVibrateAction,
    PostedByUserValidator,
    ReplyingToBotValidator
} from 'bsky-event-handlers';

const shockBotAgent = new HandlerAgent(
    'shock-bot',
    <string>Bun.env.SHOCKBOT_BSKY_HANDLE,
    <string>Bun.env.SHOCKBOT_BSKY_PASSWORD
);

const openshockClient = new OpenshockClient(<string>Bun.env.OPENSHOCK_API_TOKEN);

/**
 * Jetstream Subscription setup
 */
let jetstreamSubscription: JetstreamSubscription;

/** Shocks when the user gets a reply */
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
        ),
        DebugLogAction.make('SHOCK', 'Shock on reply', 'info')
    ],

    //Bsky agent
    shockBotAgent
)

/** Shock when the user posts */
const ShockOnUserPostHandler = new MessageHandler(
    // Validator
    [PostedByUserValidator.make('did:plc:CHANGEME')],

    //Action
    [
        OpenshockShockAction.make(
            openshockClient,              // An instance of OpenshockClient
            ['device1'],  // Static list of shocker IDs
            25,                  // Intensity: 25%
            1000,                // Duration: 1 second
            true                // Exclusive mode enabled
        ),
        DebugLogAction.make('SHOCK', 'Shock on user post', 'info')
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
    ),
        DebugLogAction.make('SHOCK', 'Shock on like', 'info')
    ],
    shockBotAgent
)


/** Shocks when the given post gets a like */
const ShockOnLikeOfPostHandler = new MessageHandler(
    // change to valid a URI. Update the DID and the RKEY to the correct values for the post
    [LikeOfPost.make('at://did:plc:CHANGEME/app.bsky.feed.post/rkeyCHANGEME')],
    [OpenshockShockAction.make(
        openshockClient,     // An instance of OpenshockClient
        ['device1'],         // Static list of shocker IDs
        25,                  // Intensity: 25%
        1000,                // Duration: 1 second
        true,                // Exclusive mode enabled
    ),
        DebugLogAction.make('SHOCK', 'Shock on like of post', 'info')
    ],
    shockBotAgent
)


/** Vibrates when the user gets a new follower */
const VibrateOnNewFollow = new MessageHandler(
    // change to valid a URI. Update the DID and the RKEY to the correct values for the post
    [NewFollowerForUserValidator.make()],
    [OpenshockVibrateAction.make(
        openshockClient,     // An instance of OpenshockClient
        ['device1'],         // Static list of shocker IDs
        25,                  // Intensity: 25%
        2000,                // Duration: 2 second
        true,                // Exclusive mode enabled
    ),
        DebugLogAction.make('VIBRATE', 'vibrate on follow', 'info')
    ],
    shockBotAgent
)

let handlers = {
    post: {
        c: [
            ShockOnReplyHandler,
            ShockOnUserPostHandler
        ]
    },
    like: {
        c: [
            ShockOnLikeHandler,
            ShockOnLikeOfPostHandler
        ]
    },
    follow: {
        c: [
            VibrateOnNewFollow
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

initialize().then(() => {
    jetstreamSubscription.createSubscription()
    DebugLog.info("INIT", 'Initialized!')
});


process.on('SIGINT', () => {
    process.exit(0);
});
