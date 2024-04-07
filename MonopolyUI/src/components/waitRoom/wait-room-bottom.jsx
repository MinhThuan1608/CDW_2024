import React from 'react';


const WaitRoomBottom = (props) => {
    const handleInitGame = () => {
        props.socket.publish({
            destination: '/app/game/room/' + props.roomId,
            body: JSON.stringify({
                messageType: 'START_GAME'
            })
        });
    }
    return (
        <div className="bottom-part">
            <button className="btn-play-game" onClick={handleInitGame}>play game now</button>
        </div>
    );
}
export default WaitRoomBottom;