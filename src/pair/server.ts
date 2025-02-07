import * as zmq from 'zeromq';

async function run() {
  const sock = new zmq.Pair();

  await sock.bind('tcp://127.0.0.1:3000');
  console.log('Server bound to port 3000');

  for await (const [msg] of sock) {
    const message = msg.toString();
    console.log(`Server received: ${message}`);
    const number = message.match(/\d+/g);
    await sock.send(`Pong ${number}`);
  }
}

run();
