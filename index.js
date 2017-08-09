var RestClient = require('node-rest-client').Client;
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var BOT_TOKEN = process.env.SLACK_BOT_TOKEN || '';
var BOT_ID = process.env.SLACK_BOT_ID || '';
var MESSAGE_TYPE = {
    DIRECT: 'D',
    CHANNEL: 'C'
};
var BLABOT_API = 'http://api.blabot.net/?format=json&scount=';
var BLABOT_COUNT = 1;

var rtm = new RtmClient(BOT_TOKEN);
var rest = new RestClient();
var utils = require('slack-utils/api')(BOT_TOKEN);

console.log('Starting...');

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    if (message.channel[0] == MESSAGE_TYPE.CHANNEL) {
        if (message.user != BOT_ID && (message.text.indexOf(BOT_ID) > -1)) {
            var user = utils.userInfoById(message.user);
            sendBlabot(message, user.name);
        }
    } else if (message.channel[0] == MESSAGE_TYPE.DIRECT) {
        sendBlabot(message);
    }
});

function sendBlabot(message, toUser) {
    rest.get(`${BLABOT_API}${BLABOT_COUNT}`, function (data, response) {
        var json = JSON.parse(data.toString('utf8'));
        var blabot = json.blabot.result[0];

        if (toUser) {
            blabot = `@${toUser} ${blabot}`
        }

        rtm.sendMessage(blabot, message.channel);
    });
}

rtm.start();
console.log('Ready!');