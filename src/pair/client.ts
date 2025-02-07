import * as zmq from 'zeromq';
import { randomInt } from 'crypto';

async function run() {
  const sock = new zmq.Pair();

  await sock.connect('tcp://127.0.0.1:3000');
  console.log('Client connected to port 3000');

  await sock.send(`Ping ${randomInt(2, 8)}`);
  for await (const [msg] of sock) {
    console.log('Client received:', msg.toString());
  }
}


run();
