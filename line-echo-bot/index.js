// .envファイルから環境変数を読み込む
require('dotenv').config();  // ← ★ここを追加

const express = require('express');
const line = require('@line/bot-sdk');

// .envからアクセストークンとシークレットを取得
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,  // ← ★ここを修正
  channelSecret: process.env.LINE_CHANNEL_SECRET              // ← ★ここを修正
};

const app = express();

// LINEのWebhookエンドポイント
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// クライアント初期化
const client = new line.Client(config);

// イベントハンドラ
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let replyText = event.message.text; // デフォルトはオウム返し

  if (event.message.text === '救急') {
    replyText = '熱中症が疑われる場合や救急車を呼ぶか迷った際は、救急相談センター広島広域都市圏（#7119）に電話してください。\n\n緊急性が高いと判断した場合は、ためらわず119番に電話してください。';
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText
  });
}

// サーバ起動
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
