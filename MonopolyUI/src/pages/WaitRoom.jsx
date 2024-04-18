import React, { useContext, useEffect, useState, useRef } from 'react';
import '../assert/style/wait-room.css';
import WaitRoomTop from '../components/waitRoom/wait-room-top';
import WaitRoomCenter from '../components/waitRoom/wait-room-center';
import WaitRoomBottom from '../components/waitRoom/wait-room-bottom';
import { SocketContext } from '../App';
import { useParams } from 'react-router-dom';
import { switchCase } from '@babel/types';
import Swal from 'sweetalert2';
import { GetRoomPass } from '../api_caller/room';
import meme from '../assert/images/icon/meme-meo-khoc-2.png';


const WaitRoom = (props) => {
    const { socket, setSocket } = useContext(SocketContext);
    const { roomId } = useParams("roomId");
    const [listMessage, setListMessage] = useState([]);
    const [listUser, setListUser] = useState([]);
    const [roomPassword, setRoomPassword] = useState('');
    const me = JSON.parse(sessionStorage.getItem('user'))

    useEffect(() => {
        GetRoomPass(roomId).then(res => {
            if (res != false)
                setRoomPassword(res)
        })
    }, [])

    useEffect(() => {
        if (socket) {
            socket.subscribe('/topic/game/room/' + roomId, (message) => {
                const messResponse = JSON.parse(message.body);
                console.log(messResponse);
                switch (messResponse.messageType) {
                    case 'JOIN':
                        setListUser(messResponse.users)
                        break
                    case 'LEAVE':
                        setListUser(messResponse.users)
                        break
                    case 'KICK':
                        var me = JSON.parse(sessionStorage.getItem('user'))
                        if (messResponse.users.find(u => u.username === me.username))
                            setListUser(messResponse.users)
                        else window.location = '/'
                        break
                    case 'TIME_OUT':
                        let timerInterval;
                        Swal.fire({
                            title: "Phòng hết hạn!",
                            html: "Tự động chuyển về trang chủ sau <b>5</b>s...",
                            icon: "info",
                            timer: 5000,
                            timerProgressBar: true,
                            showConfirmButton: false,
                            didOpen: () => {
                                const timer = Swal.getPopup().querySelector("b");
                                timerInterval = setInterval(() => {
                                    timer.textContent = `${Math.floor(Swal.getTimerLeft() / 1000) + 1}`;
                                }, 1000);
                            },
                            willClose: () => {
                                clearInterval(timerInterval);
                            }
                        }).then((result) => {
                            window.location = '/';
                        });
                        break
                    case 'MESSAGE':
                        setListMessage(prevlistMessage => [messResponse, ...prevlistMessage])
                        break
                    case 'START_GAME':
                        window.location = '/game/' + roomId
                        break
                    default:
                        break
                }


            });
            socket.publish({
                destination: '/app/game/room/' + roomId,
                body: JSON.stringify({
                    messageType: 'JOIN'
                })
            });

            socket.subscribe(`/user/${me.id}/topic/room/invite`, (message) => {
                const inviteMessage = JSON.parse(message.body)
                console.log("private invite")
                console.log(inviteMessage)
                switch (inviteMessage.inviteMessageType) {
                  case "DECLINE":
                    Swal.fire({
                        title: "Bạn đã bị từ chối!",
                        text: "Xin chia buồn cùng bạn :)))",
                        showConfirmButton: false,
                        timer: 5000,
                        timerProgressBar: true,
                        imageUrl: meme,
                        imageWidth: 200,
                        imageHeight: 200,
                        imageAlt: "meme"
                      });
                    break
                  default:
                    break
                }
              });

        }
    }, [socket])

    return (
        <div className='container'>
            <WaitRoomTop roomId={roomId} socket={socket} roomPassword={roomPassword} me={me}/>
            <WaitRoomCenter socket={socket} roomId={roomId} listMessage={listMessage} listUser={listUser} userOnline={props.userOnline} roomPassword={roomPassword}/>
            <WaitRoomBottom socket={socket} roomId={roomId} listUser={listUser}/>
        </div>
    );
}
export default WaitRoom;