import * as zmq from 'zeromq';

async function run() {
  const sock = new zmq.Reply();

  await sock.bind('tcp://127.0.0.1:3000');
  console.log('Server bound to port 3000');

  for await (const [msg] of sock) {
    const result = 2 * parseInt(msg.toString(), 10);
    await sock.send(`${result}`);
  }
}

run().catch(console.error);
