# SketchRace

- Real-time multiplayer drawing and guessing game
- One player draws while others guess the word
- Focused on low-latency and smooth real-time sync

## Problem
- Real-time games suffer from latency and state mismatch
- Syncing canvas data across multiple users is challenging
- Handling joins, leaves, and disconnects is non-trivial

## How it works
- Player creates or joins a game room
- One player is assigned as the drawer
- Drawing strokes are streamed using WebSockets
- Other players submit guesses in real time
- Scores are calculated based on guess speed
- Turn rotates after each round

## Tech stack

Frontend
- Next.js
- TypeScript
- Canvas API

Backend
- Node.js
- Socket.IO

## Why WebSockets
- Enables real-time bidirectional communication
- Keeps drawings and guesses in sync
- Ensures low latency for multiplayer gameplay

## Failure handling
- Handles player disconnects gracefully
- Reassigns drawer if a player leaves
- Maintains consistent game state

## Author
- Prince Jain
