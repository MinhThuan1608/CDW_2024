import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useRef } from 'react';

const ChatSide = (props) => {
    const [messageValue, setMessageValue] = useState('')

    const messRef = useRef()
    const ownerRoom = JSON.parse(sessionStorage.getItem('user'))

    const formatDate = (data) => {

        // Tạo một đối tượng Date từ chuỗi ngày
        const dateObj = new Date(data);

        // Lấy giờ và phút
        const hour = dateObj.getUTCHours();
        const minute = dateObj.getUTCMinutes();

        
        return `${hour < 10 ? '0'+hour : hour}:${minute < 10 ? '0'+minute : minute}`

    }

    const handleSendMessage = () => {
        props.socket.publish({
            destination: '/app/game/room/' + props.roomId,
            body: JSON.stringify({
                messageType: 'MESSAGE',
                content: messageValue
            })
        });

        setMessageValue('')
        messRef.current.focus()
    }
    
    const handleSendMessageEnter = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage()
        }
    }



    return (
        <div className="chat-room-part">
            <p className="title-chat">chat</p>
            <div className="messageList force-overflow scrollbar"   >
                {props.listMessage.map((message, index) => (
                    <div className={`message ${message.sender.id === ownerRoom.id ? 'messageOwner' : ''}`} key={index}>
                        <div className={`messageBlock ${message.sender.id === ownerRoom.id ? 'messageBlockOwner' : ''}`}>
                            <span className={`sendName ${message.sender.id === ownerRoom.id ? 'player-br-forth' : 'player-br-thr'}`}>
                                {message.sender.username}
                            </span>
                            <span className="sendTime">{formatDate(message.createAt)}</span>
                        </div>
                        <span className={`messageContent ${message.sender.id === ownerRoom.id ? 'player-br-forth messageContentOwner' : 'player-br-thr'}`}>{message.content}</span>
                    </div>
                ))}

            </div>
            <div className="sendMessDiv">
                <input type="text" className='inputMess'
                    value={messageValue}
                    onChange={e => setMessageValue(e.target.value)}
                    ref={messRef}
                    onKeyUp={ e => handleSendMessageEnter(e)} />

                <button className='sendBtn' onClick={handleSendMessage}>
                    <FontAwesomeIcon icon={faPaperPlane} className="icon-send-mess" />
                </button>
            </div>

        </div>
    );
}
export default ChatSide;