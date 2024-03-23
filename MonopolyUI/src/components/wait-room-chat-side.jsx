import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const ChatSide = () => {
    const listMessage = [
        { time: '16:04', username: 'Thuy', content: 'Điểm sơ qua phần thông số, máy sở hữu bộ 3 camera sau với camera' },
        { time: '16:05', username: 'Thuan', content: 'Mới đầu phân vân giữa Oppo với Xiaomi 13t' },
        { time: '16:06', username: 'Thuy', content: 'Điểm sơ qua phần thông số, máy sở hữu bộ 3 camera sau với camera chính có độ phân giải 64' },
        { time: '16:07', username: 'Thuan', content: 'Điện thoại OPPO dòng Reno từ trước đến nay luôn dành sự đặc biệt về phần camera' }]
    return (
        <div className="chat-room-part">
            <p className="title-chat">chat</p>
            <div className="messageList force-overflow scrollbar">
                {listMessage.map((message, index) => (
                    <div className={`message ${message.username === 'Thuy' ? 'messageOwner' : ''}`} key={index}>
                        <div className={`messageBlock ${message.username === 'Thuy' ? 'messageBlockOwner' : ''}`}>
                            <span className={`sendName ${message.username === 'Thuy' ? 'player-br-forth' : 'player-br-thr'}`}>{message.username}</span>
                            <span className="sendTime">{message.time}</span>
                        </div>
                        <span className={`messageContent ${message.username === 'Thuy' ? 'player-br-forth messageContentOwner' : 'player-br-thr'}`}>{message.content}</span>
                    </div>
                ))}

            </div>
            <div className="sendMessDiv">
                <input type="text" className='inputMess' />

                <button className='sendBtn'>
                    <FontAwesomeIcon icon={faPaperPlane} className="icon-send-mess" />
                </button>
            </div>

        </div>
    );
}
export default ChatSide;