import React, { useState, useContext } from 'react';
import ChatSide from './wait-room-chat-side';
import { faChess, faCrown, faPlus, faSignOut, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WaitRoomOnlineUser from './wait-room-online-list-user';
import StartGameModal from './start-game-modal';
import { SocketContext } from '../../App';


const WaitRoomCenter = (props) => {
    const me = JSON.parse(sessionStorage.getItem('user'))
    const { socket, setSocket } = useContext(SocketContext);

    const handleKickUser = () => {
        socket.publish({
            destination: '/app/game/room/' + props.roomId,
            body: JSON.stringify({
                messageType: 'KICK'
            })
        })
    }
    const handleOutRoom = () => {
        socket.publish({
            destination: '/app/game/room/' + props.roomId,
            body: JSON.stringify({
                messageType: 'LEAVE'
            })
        });
        window.location = '/'
    }
    return (
        <>
            <div className="center-part">
                <WaitRoomOnlineUser userOnline={props.userOnline} socket={socket} roomId={props.roomId} roomPassword={props.roomPassword} me={props.me} />
                <div className="center-part-left">

                    {/* người chơi 1 */}
                    <div className="center-part-user center-part-userthr">
                        <div className="img-frame-player player-br-thr" style={{ backgroundImage: `url(${!props.listUser[0] ? 'none' : props.listUser[0].avatar ? props.listUser[0].avatar.data : 'none'})` }}></div>
                        <FontAwesomeIcon icon={faCrown} className="main-room-player" />
                        <p className="player-name player-br-thr">{props.listUser[0]?.username}</p>
                        <FontAwesomeIcon icon={faChess} className="icon-chess icon-chess-white" />
                        <FontAwesomeIcon title="Rời phòng" icon={props.me?.username === props.listUser[0]?.username ? faSignOut : ''} className="icon-delete-user" onClick={handleOutRoom} />
                    </div>
                    {/* người chơi 2 */}
                    {props.listUser.length == 2 ?
                        <div className="center-part-user center-part-userforth">
                            <div className="img-frame-player" style={{ backgroundImage: `url(${!props.listUser[1] ? 'none' : props.listUser[1].avatar ? props.listUser[1].avatar.data : 'none'})`, backgroundColor: '#8aa905' }}></div>
                            <p className="player-name player-br-forth">{props.listUser[1]?.username}</p>
                            <FontAwesomeIcon icon={faChess} className="icon-chess icon-chess-black" />
                            <FontAwesomeIcon title={props.me?.username === props.listUser[0]?.username ? 'Đuổi khỏi phòng' : 'Rời phòng'} icon={props.me?.username === props.listUser[0]?.username ? faTrash : faSignOut} className="icon-delete-user" onClick={props.me?.username === props.listUser[0]?.username ? handleKickUser : handleOutRoom} />
                        </div>
                        :
                        <div className="center-part-user center-part-userthr">
                            {/* <div className="img-frame-player"  style={{backgroundImage: `url(${userAvt})`}}></div> */}
                            {/* <p className="player-name player-br-thr"></p> */}
                            <div>
                                <FontAwesomeIcon icon={faUser} className="icon-add-user" />
                            </div>
                        </div>
                    }


                </div>
                <ChatSide socket={socket} roomId={props.roomId} listMessage={props.listMessage} />
                {props.isShowStartGameModal && <StartGameModal isShowStartGameModal={props.isShowStartGameModal} setIsShowStartGameModal={props.setIsShowStartGameModal} roomId={props.roomId}/>}
            </div>
        </>
    );
}
export default WaitRoomCenter;