import React, { useContext, useEffect } from 'react';
import '../assert/style/wait-room.css';
import WaitRoomTop from '../components/wait-room-top';
import WaitRoomCenter from '../components/wait-room-center';
import WaitRoomBottom from '../components/wait-room-bottom';
import { SocketContext } from '../App';
import { useParams } from 'react-router-dom';

const WaitRoom = () => {
    const { socket, setSocket } = useContext(SocketContext);
    const { roomId } = useParams("roomId");

    useEffect(() => {
        if (socket){
            console.log('subcribe room ', roomId)
            socket.subscribe('/topic/game/room/' + roomId, (message) => {
                console.log('Received message:', message.body);
            });
        }
    }, [socket])

    return (
        <div className='container'>
            <WaitRoomTop />
            <WaitRoomCenter />
            <WaitRoomBottom />
        </div>
    );
}
export default WaitRoom;