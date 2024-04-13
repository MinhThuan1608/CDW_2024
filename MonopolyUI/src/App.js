import React, { createContext, useReducer, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
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
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
// import SocketContext from "./components/socket-context";

export const SocketContext = React.createContext();

function App() {
  // socket context
  const [socket, setSocket] = useState(null);
  const publicPages = ['/login', '/register']

  // app state context
  const [appState, dispatch] = useReducer(reducer, initGameState)
  const providerState = {
    appState,
    dispatch
  }


  const [userOnline, setUserOnline] = useState([])


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

        client.subscribe('/topic/user/online', (message) => {
          console.log(JSON.parse(message.body))
          setUserOnline(JSON.parse(message.body));
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

  //path authorize config
  useEffect(() => {
    const accessToken = sessionStorage.getItem('access_token');
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!publicPages.find(page => window.location.pathname.startsWith(page))) {
      if (!accessToken) {
        window.location = '/login'
      } else if (!user.username && !window.location.pathname.startsWith('/create-character') && !publicPages.find(page => window.location.pathname.startsWith(page))) {
        window.location = '/create-character'
      }
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>

      <AppContext.Provider value={providerState}>
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/wait-room/:roomId" element={<WaitRoom userOnline={userOnline} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-character" element={<CreateCharacter />} />
              <Route path="/game/:roomId" element={<GamePage/>} />
            </Routes>
          </BrowserRouter>
          <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>
      </AppContext.Provider>

    </SocketContext.Provider>

  );
}

export default App;
