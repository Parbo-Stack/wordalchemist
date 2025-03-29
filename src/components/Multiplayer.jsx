import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import Game from "./Game";

const socket = io("http://localhost:3001");

const Multiplayer = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    socket.on("invite_code", (code) => setInviteCode(code));
    socket.on("start_game", () => setGameStarted(true));
    socket.on("error", (msg) => setError(msg));
  }, []);

  const createGame = () => socket.emit("create_game");

  const joinGame = () => socket.emit("join_game", inviteCode);

  return (
    <div>
      {!gameStarted ? (
        <div>
          <button onClick={createGame}>Create Game</button>
          {inviteCode && <div>Invite Code: {inviteCode}</div>}
          
          <input
            placeholder="Enter Invite Code"
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          />
          <button onClick={joinGame}>Join Game</button>
          {error && <div>{error}</div>}
        </div>
      ) : (
        <div className="grid grid-cols-2">
          <Game socket={socket} inviteCode={inviteCode} player="you" />
          <Game socket={socket} inviteCode={inviteCode} player="opponent" />
        </div>
      )}
    </div>
  );
};

export default Multiplayer;
