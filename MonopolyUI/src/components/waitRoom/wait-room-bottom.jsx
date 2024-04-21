import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { GetRoomMeIn } from '../../api_caller/room';

const WaitRoomBottom = (props) => {

    const [roomMeIn, setRoomMeIn] = useState(null)

    useEffect(() => {
        GetRoomMeIn().then(res => {
            if (res) setRoomMeIn(res)
        })
    }, [])

    const handleInitGame = () => {
        if (props.listUser.length == 2)
            props.socket.publish({
                destination: '/app/game/room/' + props.roomId,
                body: JSON.stringify({
                    messageType: 'START_GAME'
                })
            });
        else toast.warn('Cần có 2 người mới chơi được!');
    }

    const handleReturnGame = ()=>{
        window.location = '/game/' + roomMeIn.id
    }

    return (
        
        <div className="bottom-part">
            {roomMeIn?.playing ?
                <button className="btn-play-game" onClick={handleReturnGame}>Trờ lại game</button> :
                props.me.id === props.listUser[0]?.id && <button className="btn-play-game" onClick={handleInitGame}>Bắt đầu chơi</button>}
        </div>
    );
}
export default WaitRoomBottom; 