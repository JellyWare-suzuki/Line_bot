
const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'rX9k7Fd5atvJeBPS0kBQ0JEYLk2lUD5kK++jK/rM83OgAHqgyOAmGqPDHUWpGm/4lwABFybVxhUnxxy1ozCoiHaq9XVfHwgG/71/B8o7RPbNcFGwtkGRUaQL1wcB+wwYuB0toaxxOQ2Ya9KxHhWOKwdB04t89/1O/w1cDnyilFU=',
  channelSecret: '5b90e4e2520d42b4b68d364430d5c898'
};

const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let replyText = event.message.text; // Default to echo

  if (event.message.text === '救急') {
    replyText = '熱中症が疑われる場合や救急車を呼ぶか迷った際は、救急相談センター広島広域都市圏（#7119）に電話してください。\n\n緊急性が高いと判断した場合は、ためらわず119番に電話してください。';
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
