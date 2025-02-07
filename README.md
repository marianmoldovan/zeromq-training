### What is ZeroMQ?

ZeroMQ (ØMQ) is a messaging library that provides a higher-level abstraction over sockets.

- It lets you build scalable, distributed applications by handling the complexities of network communication for you.
- Instead of dealing with raw sockets, you work with message-oriented patterns like pub/sub, request/reply, and push/pull.
- It supports multiple transports (TCP, IPC, in-process) and is designed for asynchronous communication, making it efficient and performant.

Think of it as a powerful tool for connecting different parts of your application, whether they're on the same machine or distributed across a network.


#### Build int patterns

The built-in core ZeroMQ patterns are:

Request-reply, which connects a set of clients to a set of services. This is a remote procedure call and task distribution pattern.

Pub-sub, which connects a set of publishers to a set of subscribers. This is a data distribution pattern.

Pipeline, which connects nodes in a fan-out/fan-in pattern that can have multiple steps and loops. This is a parallel task distribution and collection pattern.

Exclusive pair, which connects two sockets exclusively. This is a pattern for connecting two threads in a process, not to be confused with “normal” pairs of sockets.

### Hello world ZeroMQ

Install zeromq with npm or whatever package manager:

```bash
pnpm install zeromq
```

#### Pair

The ZeroMQ PAIR socket pattern is strictly 1-to-1, bidirectional communication.  It's designed for exactly two peers to communicate directly with each other.  Unlike other patterns like PUB/SUB or PUSH/PULL, PAIR sockets cannot be connected to multiple peers.  Each PAIR socket must be connected to exactly one other PAIR socket.  It's the closest ZeroMQ pattern to a traditional, direct socket connection but with the added benefits of ZeroMQ's message handling.

![Pair](pair/diagram.png)

Sample in the folder `src/zeromq/pair`.

#### Request/Reply

The ZeroMQ Request/Reply (REQ/REP) pattern implements a classic client/server architecture. Is a 1-to-N (one-to-many) communication pattern from the client's perspective, but with a crucial difference from other 1-to-N patterns like PUB/SUB or PUSH/PULL.

- Client (REQ): The client (REQ socket) can connect to multiple servers (REP sockets).  This is the 1-to-N part.  The client sends a request, and ZeroMQ transparently handles routing it to one of the available servers.
- Server (REP):  Each server (REP socket) effectively operates in a 1-to-1 relationship with the client for a single request-reply cycle.  While a server can handle requests from multiple clients over time, each individual request from a client is handled and replied to in a one-to-one fashion.

So, while the client can communicate with multiple servers, the communication for each individual request is effectively 1-to-1.  It's more accurate to describe it as 1-to-N (with 1-to-1 request-reply cycles). This distinguishes it from pure 1-to-N patterns where a single message from the sender is received by multiple receivers simultaneously.  In REQ/REP, each message from the client is directed to one server, and that server sends one reply back to the client.

![Request/Reply](request_reply/diagram.png)

Difference with Pair?

- REQ/REP: More complex, designed for client-server with request-reply pairing, supports multiple servers
- PAIR: Simpler, designed for direct, unstructured, bidirectional communication between two peers only.

Think of REQ/REP as a formal conversation with questions and answers, while PAIR is more like two people chatting freely.

Sample in the folder `src/zeromq/request_reply`.


##### Request and Reply asynchronus

REQ/REP sockets in ZeroMQ offer a simple, synchronous request-reply mechanism.  A REQ socket sends a request and blocks until it receives a reply from a connected REP socket.  This creates a tight coupling and can limit performance, especially in scenarios with high latency or many concurrent requests.  Each REQ must alternate send() and recv().

DEALER/ROUTER sockets provide an asynchronous alternative. A DEALER socket (client-side) can send multiple requests to ROUTER sockets (server-side) without blocking. It manages the requests and their corresponding replies, even if they arrive out of order.  The DEALER socket adds an empty frame as a message delimiter when talking to a REP socket for compatibility.

A ROUTER socket (server-side) receives requests from DEALER sockets and prepends a routing ID to each message, identifying the originating client. This allows the ROUTER to send replies back to the correct client, even if requests from multiple clients are interleaved.  When sending replies to REQ sockets, the ROUTER must also include the empty delimiter frame.

Key differences:

- Asynchronous vs. Synchronous: DEALER/ROUTER is non-blocking, allowing for concurrent requests and improved performance. REQ/REP is blocking, requiring a strict send/receive alternation.
- Addressing: ROUTER uses explicit routing IDs to direct replies. REP implicitly relies on the last received request.
- Scalability: DEALER/ROUTER is more scalable, handling multiple clients and servers efficiently. REQ/REP is simpler but less scalable.
- In essence, DEALER/ROUTER decouples the client and server, enabling asynchronous communication and improved scalability compared to the simpler, blocking REQ/REP pattern.

Example TBD

#### Push/Pull or Pipeline

The ZeroMQ Push/Pull pattern is primarily a 1-to-N (one-to-many) communication pattern.

![img.png](push_pull/diagram.png)

The Push/Pull pipeline pattern in ZeroMQ allows you to distribute work across multiple worker processes.  A "Push" socket acts as a distributor, evenly sending messages to connected "Pull" sockets (the workers). This resembles a producer/consumer model, but with a crucial difference: the worker's results aren't sent back upstream. Instead, they flow downstream to another Push/Pull socket (or another type of socket), forming a pipeline.  Data moves only in one direction through the pipeline stages, and each stage can connect to one or more worker nodes.  When a stage has multiple workers, messages are automatically load-balanced across them, ensuring efficient distribution of the workload.

Sample in the folder `src/zeromq/push_pull`.


#### Pub/Sub

ZeroMQ's PUB/SUB pattern decouples message senders (publishers) and receivers (subscribers). Publishers send messages tagged with "topics," and subscribers receive only messages matching their subscribed topics.  A single subscriber can listen to multiple topics from one or more publishers.  It's asynchronous; subscribers only receive messages published after they subscribe.  Filtering happens on the subscriber side.  Great for real-time data distribution and event notification.

![Diagram](pub_sub/diagram.png)


#### Comparison

| Feature         | Push/Pull        | Pub/Sub          | Pair             | Request/Reply    |
|-----------------|-------------------|-------------------|-------------------|-------------------|
| Connection      | 1-to-N           | 1-to-N (or M-to-N)| 1-to-1           | 1-to-N (with 1-to-1 request-reply cycles) |
| Direction       | Unidirectional   | Unidirectional   | Bidirectional     | Bidirectional     |
| Structure       | Pipeline         | Topic-based      | Unstructured      | Request-Reply     |
| Load Balancing  | Yes              | No               | No               | Yes (among servers) |
| Use Case        | Task distribution | Data distribution | Direct comms.    | Client-server     |

In simple terms:
- Push/Pull: Like a conveyor belt.
- Pub/Sub: Like a radio broadcast.
- Pair: Like a direct phone call.
- Request/Reply: Like ordering food at a restaurant (you ask, they reply with your order).


### Next steps

The definitive guide to ZeroMQ is the "ZeroMQ Guide" by Pieter Hintjens. It's a comprehensive resource that covers everything from basic concepts to advanced patterns and real-world use cases. You can find it online at [zguide.zeromq.org](https://zguide.zeromq.org).
