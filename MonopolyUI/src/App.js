import React, { createContext, useReducer, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WaitRoom from "./pages/WaitRoom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateCharacter from "./pages/CreateCharacter";
import GamePage from "./pages/GamePage";
import AppContext from "./contexts/Context";
import { initGameState } from "./components/gameBoard/constants";
import { reducer } from "./reducer/reducer";
import { Client } from "@stomp/stompjs";
// import SocketContext from "./components/socket-context";

export const SocketContext = React.createContext();

function App() {
  // app state context
  const [appState, dispatch] = useReducer(reducer, initGameState)
  const providerState = {
    appState,
    dispatch
  }
  // socket context
  const [socket, setSocket] = useState(null);

  // chat side


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
        // đăng kí kết nối để lấy danh sách ai đang online
        client.subscribe('/topic/user/online', (message) => { //recieve an array of user who online
          console.log(JSON.parse(message.body));
        });
      // gửi thông báo lên để server biết mình đang onl 
        client.publish({
          destination: '/app/user/online',
          body: ""
        });
      };
      client.onStompError = (error) => {
        console.error('Error in connecting WebSocket', error);
      };
// bắt đầu kết nối
      client.activate();

    }

  }, [])

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>

      <AppContext.Provider value={providerState}>
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/wait-room/:roomId" element={<WaitRoom/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-character" element={<CreateCharacter />} />
              <Route path="/game" element={<GamePage/>} />
            </Routes>
          </BrowserRouter>
        </div>
      </AppContext.Provider>

    </SocketContext.Provider>

  );
}

export default App;
