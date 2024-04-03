import React, { useContext, useEffect, useState,useRef } from 'react';
import '../assert/style/wait-room.css';

import WaitRoomTop from '../components/waitRoom/wait-room-top';
import WaitRoomCenter from '../components/waitRoom/wait-room-center';
import WaitRoomBottom from '../components/waitRoom/wait-room-bottom';
import { SocketContext } from '../App';
import { useParams } from 'react-router-dom';
import { switchCase } from '@babel/types';


const WaitRoom = () => {
    const { socket, setSocket } = useContext(SocketContext);
    const { roomId } = useParams("roomId");
    const [listMessage, setListMessage] = useState([]);

    useEffect(() => {
        if (socket){
            // console.log('subcribe room ', roomId)
            socket.subscribe('/topic/game/room/' + roomId, (message) => {
                const messResponse = JSON.parse(message.body);
                console.log(messResponse);
                switch (messResponse.messageType) {
                    case 'MESSAGE':
                        setListMessage(prevlistMessage => [ ...prevlistMessage,  messResponse])
                    break
                    
                    default:
                        break
                }
                
            });
        }
    }, [socket])

    return (
        <div className='container'>
            <WaitRoomTop />
            <WaitRoomCenter socket={socket} roomId={roomId} listMessage={listMessage}/>
            <WaitRoomBottom />
        </div>
    );
}
export default WaitRoom;