import React from 'react';
import ChatSide from './wait-room-chat-side';
import { faCrown, faSignOut, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const WaitRoomCenter = ({socket,roomId,listMessage}) => {
    return (
       <div className="center-part">
         <div className="center-part-left">
           
            <div className="center-part-user center-part-userthr">
                <div className="img-frame-player"></div>
                <p className="player-name player-br-thr">thuan</p>
                <FontAwesomeIcon icon={faTrash} className="icon-delete-user"/>
            </div>
            <div className="center-part-user center-part-userforth">
                <div className="img-frame-player"></div>
                <FontAwesomeIcon icon={faCrown} className="main-room-player"/>
                <p className="player-name player-br-forth">thuy</p>
                <FontAwesomeIcon icon={faSignOut} className="icon-delete-user"/>
            </div>
        </div>
        <ChatSide socket={socket} roomId={roomId} listMessage={listMessage} />
       </div>
    );
}
export default WaitRoomCenter;