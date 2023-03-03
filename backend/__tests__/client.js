import WebSocket from 'ws';



const connect = async () => {
  const ws = new WebSocket('ws://127.0.0.1:8000');
  let id; 
  ws.on('message', function message(data) {
    id = data;
    console.log(id)
    console.log('received: %s', data);
});
  try {
    const response = await fetch('http://localhost:3000/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ twitchNickname: 'mewtru', tiktokNickname: 'sannarantala1', id: id }),
    })
    const data = await response.json();
    console.log(data)
  }
  catch (error) {
    console.log(error)
  }
}
connect()

