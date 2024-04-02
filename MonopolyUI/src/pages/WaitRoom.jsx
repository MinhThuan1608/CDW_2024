import React from 'react';
import '../assert/style/wait-room.css';
import WaitRoomTop from '../components/waitRoom/wait-room-top';
import WaitRoomCenter from '../components/waitRoom/wait-room-center';
import WaitRoomBottom from '../components/waitRoom/wait-room-bottom';

const WaitRoom = () => {
    return (
        <div className='container'>
            <WaitRoomTop />
            <WaitRoomCenter />
            <WaitRoomBottom />
        </div>
    );
}
export default WaitRoom;