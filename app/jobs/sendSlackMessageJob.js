
const { WebClient } = require('@slack/client');

exports.perform = function perform(channelName, message) {
  // An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
  const token = global.config.SLAc;

  const web = new WebClient(token);
  // const rtm = new RtmClient(token, { logLevel: 'error' });
  // rtm.start();

  // See: https://api.slack.com/methods/chat.postMessage
  web.chat.postMessage({
    channel: channelName,
    username: 'svmnotifybot',
    text: message,
    // icon_emoji: ':ghost:',
  })
    .then((res) => {
      // `res` contains information about the posted message
      console.log('Message sent: ', res.ts);
    })
    .catch(console.error);
};
