import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:8000');

const connect = async () => {
  try {
    const response = await fetch('http://localhost:3000/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ twitchNickname: 'mewtru', tiktokNickname: 'bilardo.eli', id: 2 }),
    })
    const data = await response.json();
    console.log(data)
  }
  catch (error) {
    console.log(error)
  }
}
connect()

ws.on('message', function message(data) {
  console.log('received: %s', data);
});