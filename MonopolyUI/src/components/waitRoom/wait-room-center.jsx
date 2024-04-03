import React from 'react';
import ChatSide from './wait-room-chat-side';
import { faChess, faCrown, faPlus, faSignOut, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WaitRoomOnlineUser from './wait-room-online-list-user';
import userAvt from '../../assert/images/avatar/meo.jpg';


const WaitRoomCenter = (props) => {
    const handleInvitePlayer = () => {
        alert('mời dô chơi')
    }
    return (
        <div className="center-part">
            <WaitRoomOnlineUser socket={props.socket} roomId={props.roomId} listMessage={props.listMessage} />
            <div className="center-part-left">

                {/* người chơi 1 */}
                <div className="center-part-user center-part-userthr">
                    <div className="img-frame-player" style={{ backgroundImage: `url(${userAvt})` }}></div>
                    <FontAwesomeIcon icon={faCrown} className="main-room-player" />
                    <p className="player-name player-br-thr">thuan</p>
                    <FontAwesomeIcon icon={faChess} className="icon-chess icon-chess-white" />
                    <FontAwesomeIcon icon={faTrash} className="icon-delete-user" />
                </div>
                {/* người chơi 2 */}
                <div className="center-part-user center-part-userforth d-none">
                    <div className="img-frame-player" style={{ backgroundImage: `url(${userAvt})` }}></div>
                    <p className="player-name player-br-forth">thuy</p>
                    <FontAwesomeIcon icon={faChess} className="icon-chess icon-chess-black" />
                    <FontAwesomeIcon icon={faSignOut} className="icon-delete-user" />
                </div>
                {/* người chơi chưa vào phòng */}
                <div className="center-part-user center-part-userthr">
                    {/* <div className="img-frame-player"  style={{backgroundImage: `url(${userAvt})`}}></div> */}
                    {/* <p className="player-name player-br-thr"></p> */}
                    <button className='btn-invite' onClick={handleInvitePlayer}>
                    <FontAwesomeIcon icon={faPlus} className="icon-add-user" />
                    </button>
                </div>
            </div>
            <ChatSide socket={props.socket} roomId={props.roomId} listMessage={props.listMessage} />
        </div>
    );
}
export default WaitRoomCenter;