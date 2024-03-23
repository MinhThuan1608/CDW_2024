import React from 'react';
import ChatSide from './wait-room-chat-side';


const WaitRoomCenter = () => {
    return (
       <div className="center-part">
         <div className="center-part-left">
            <div className="center-part-user center-part-userfst">
                <div className="img-frame-player"></div>
                <p className="player-name player-br-fst">nhims</p>
            </div>
            <div className="center-part-user center-part-usersed">
                <div className="img-frame-player"></div>
                <p className="player-name player-br-sed">huong</p>
            </div>
            <div className="center-part-user center-part-userthr">
                <div className="img-frame-player"></div>
                <p className="player-name player-br-thr">thuan</p>
            </div>
            <div className="center-part-user center-part-userforth">
                <div className="img-frame-player"></div>
                <div className="main-room-player">mouse</div>
                <p className="player-name player-br-forth">thuy</p>
            </div>
        </div>
        <ChatSide/>
       </div>
    );
}
export default WaitRoomCenter;