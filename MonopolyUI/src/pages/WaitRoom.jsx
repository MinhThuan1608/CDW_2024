import React from 'react';
import '../assert/style/wait-room.css';
import WaitRoomTop from '../components/wait-room-top';
import WaitRoomCenter from '../components/wait-room-center';
import WaitRoomBottom from '../components/wait-room-bottom';

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