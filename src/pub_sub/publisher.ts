import * as zmq from 'zeromq';
import { randomInt } from "crypto";


const getRandomFact = (): string => {
  const facts = [
    'The first oranges weren’t orange',
    'The tallest mountain in the solar system is on Mars',
    'The longest time between two twins being born is 87 days',
    'The world’s largest snowflake was 15 inches wide',
    'You lose up to 30 percent of your taste buds during flight',
  ];
  return facts[randomInt(0, facts.length)];
}

async function run() {
  const sock = new zmq.Publisher();
  await sock.bind('tcp://127.0.0.1:3000');
  console.log('Publisher bound to port 3000');
  while (true) {
    console.log('sending a multipart message envelope');
    await sock.send(['fun facts', getRandomFact()]);
    await new Promise(resolve => {
      setTimeout(resolve, 500);
    });
  }
}

run().catch(console.error);
