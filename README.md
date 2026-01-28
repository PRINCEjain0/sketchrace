SketchRace

SketchRace is a real-time multiplayer drawing and guessing game where one player draws and others try to guess the word as fast as possible.

Problem:

Most real-time games break when latency increases or state goes out of sync between players.

SketchRace focuses on low-latency updates and consistent game state across all connected users.

How it works:

One player is selected as the drawer
Drawer draws on a shared canvas
Drawing data is streamed using WebSockets
Other players submit guesses in real time
Scores and turns are updated instantly

Tech stack:

Frontend:
Next.js
TypeScript
Canvas API

Backend:
Node.js
Socket.IO

Why WebSockets:

Enables real-time bidirectional communication
Keeps drawing and guesses in sync
Low latency for multiplayer gameplay

Game logic:

Turn-based drawing system
Score calculation based on guess speed
Player join and leave handling
Room-based game sessions

Failure handling:

Handles player disconnects gracefully
Reassigns turns when needed
Keeps game state consistent

Setup:

Clone the repo.
Install dependencies.
Run the server.
Open multiple tabs to play

Author:

Prince Jain.
Building real-time systems and interactive products
