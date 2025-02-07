import * as zmq from 'zeromq';
import { randomInt } from "crypto";

async function run() {
  const sock = new zmq.Request();

  sock.connect('tcp://127.0.0.1:3000');
  console.log('Client connected to port 3000');

  const message = `${randomInt(2, 8)}`;
  await sock.send(message);

  const [result] = await sock.receive();
  console.log(`Client received: ${result.toString()}`);
}

run().catch(console.error);
