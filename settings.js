const settings = {
  // General
  rootPath: __dirname,
  battleDebug: false,
  eventDebug: false,
  pvpLevelRestriction: 5,
  guildID: process.env.GUILD_ID,
  botLoginToken: process.env.DISCORD_BOT_LOGIN_TOKEN,
  minimalTimer: process.env.MIN_TIMER,
  maximumTimer: process.env.MAX_TIMER,
  botID: process.env.BOT_ID,
  mongoDBUri: process.env.MONGODB_URI
    ? process.env.MONGODB_URI
    : process.env.MONGOLAB_AMBER_URI,
  starterTown: [3, 5],
  multiplier: 1,
  botOperators: process.env.DISCORD_BOT_OPERATORS_ID.replace(" ", "").split(
    ","
  ),
  // Webhooks
  actionWebHookId: process.env.ACTIONS_WEBHOOK_ID,
  actionWebHookToken: process.env.ACTIONS_WEBHOOK_TOKEN,
  moveWebHookId: process.env.MOVE_WEBHOOK_ID,
  moveWebHookToken: process.env.MOVE_WEBHOOK_TOKEN,
  // Channels
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID,
  faqChannelId: process.env.FAQ_CHANNEL_ID,
  streamChannelId: process.env.STREAM_CHANNEL_ID,
  commandChannel: process.env.COMMAND_CHANNEL_ID,
  leaderboardChannelId: process.env.LEADERBOARD_CHANNEL_ID,
  announcementChannelId: process.env.ANNOUNCEMENT_CHANNEL_ID,
};
module.exports = settings;
