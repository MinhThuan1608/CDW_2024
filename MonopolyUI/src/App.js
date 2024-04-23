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
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import './assert/style/responsitive.css'
import { AddFriend, GetMe, RemoveFriendRequest } from './api_caller/user';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import Swal from 'sweetalert2';

export const SocketContext = React.createContext();

function App() {

  // socket context
  const [socket, setSocket] = useState(null);
  const publicPages = ['/login', '/register', '/forget-password', '/reset-password']



  const [userOnline, setUserOnline] = useState([])
  const [me, setMe] = useState({})

  // app state context
  const [appState, dispatch] = useReducer(reducer, initGameState)
  const providerState = {
    appState,
    dispatch
  }


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

  useEffect(() => {
    if (!publicPages.find(page => window.location.pathname.startsWith(page)) && socket && me) {
      socket.subscribe(`/user/${me.id}/topic/friend/request`, (message) => {
        const requestFriendMessage = JSON.parse(message.body)
        Swal.fire({
          title: "Lời mời kết bạn",
          html: "Bạn nhận được lời mời kết bạn từ <b>" + requestFriendMessage.sender?.username + "</b>",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Chấp nhận',
          denyButtonText: 'Từ chối',
          cancelButtonText: 'Trở lại',
          reverseButtons: true,
          imageUrl: requestFriendMessage.sender?.avatar?.data,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: "Avatar"
        }).then((result) => {
          if (result.isConfirmed) {
            AddFriend(requestFriendMessage.id).then(res => {
              if (res) {
                toast.success('Kết bạn thành công')
              }
            })
          } else if (result.isDenied) {
            RemoveFriendRequest(requestFriendMessage.id).then(res => {
              if (res) toast.success('Từ chối thành công! Đối phương không biết bạn đã từ chối họ!')
            })
          }
        });
      });
// 
      socket.subscribe(`/user/${me.id}/topic/friend/add`, (message) => {
        console.log(message.body)
        toast(`Người chơi ${message.body} đã đồng ý kết bạn!`)
      });

      // donate
      socket.subscribe(`/user/${me.id}/topic/donate`, (message) => {
        const donateMessage = JSON.parse(message.body)
        Swal.fire({
          title: "Êi cho này nè!!!",
          html: "Bạn nhận được " + donateMessage.sendProduct?.name + " từ <b>" + donateMessage.sender?.username + "</b>",
          confirmButtonText: "OK",
          // imageUrl: donateMessage.sender?.avatar?.data,
          imageUrl: donateMessage.sendProduct?.urlImage,
          imageWidth: 200,
          imageHeight: 200,
        })
      })
    }
  }, [socket, me])

  //path authorize config
  useEffect(() => {
    const accessToken = sessionStorage.getItem('access_token');
    if (!publicPages.find(page => window.location.pathname.startsWith(page))) {
      if (!accessToken) {
        window.location = '/login'
      } else {
        GetMe().then(user => {
          console.log(user)
          if (user) setMe(user)
          if (!user?.username && !window.location.pathname.startsWith('/create-character')) {
            window.location = '/create-character'
          }
        })
      }
    }
  }, [])




  return (
    <SocketContext.Provider value={{ socket, setSocket }}>

      <AppContext.Provider value={providerState}>
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage me={me} setMe={setMe} />} />
              <Route path="/wait-room/:roomId" element={<WaitRoom userOnline={userOnline} me={me} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/create-character" element={<CreateCharacter />} />
              <Route path="/game/:roomId" element={<GamePage me={me} />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>
      </AppContext.Provider>

    </SocketContext.Provider>

  );
}

export default App;
