
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WaitRoom from "./pages/WaitRoom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateCharacter from "./pages/CreateCharacter";
import GamePage from "./pages/GamePage";
import { useEffect, useState } from "react";
import React from 'react';
import { Client } from "@stomp/stompjs";
// import SocketContext from "./components/socket-context";

export const SocketContext = React.createContext();

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    var accessToken = sessionStorage.getItem('access_token');
    if (accessToken && !socket) {
      const client = new Client({
        brokerURL: `ws://localhost:8001/monopolyWs?Authorization=Bearer%20${accessToken}`,
        debug: function (str) {
          // console.log(str);
        },
        reconnectDelay: 10000,
      });

      client.onConnect = () => {
        console.log('Connected to WebSocket');
        setSocket(client)
        client.subscribe('/topic/user/online', (message) => { //recieve an array of user who online
          console.log(JSON.parse(message.body));
        });

        client.publish({
          destination: '/app/user/online',
          body: ""
        });
      };
      client.onStompError = (error) => {
        console.error('Error in connecting WebSocket', error);
      };

      client.activate();
      
    }

  }, [])

  return (
    <div>
      <SocketContext.Provider value={{ socket, setSocket }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wait-room/:roomId" element={<WaitRoom />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-character" element={<CreateCharacter />} />
            <Route path="/game" element={<GamePage />} />
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </div>

  );
}

export default App;
