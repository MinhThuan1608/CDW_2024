import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faUserAlt, faUserClock, faUsersLine } from '@fortawesome/free-solid-svg-icons';
import { GetAllRoom, JoinRoom } from '../../api_caller/room';
import { SocketContext } from '../../App';
import { toast } from 'react-toastify';

const StartGameModal = (props) => {
    const { socket, setSocket } = useContext(SocketContext);
    const [time, setTime] = useState(30);


    const handleCloseModal = () => {
        props.setIsShowStartGameModal(false);
    };
   
    const handleTimeChange = (event) => {
      setTime(event.target.value);
    };
  
    const handleOKButtonClick = () => {
      console.log(`Thời gian được đặt là: ${time}`);
      socket.publish({
        destination: '/app/game/room/' + props.roomId,
        body: JSON.stringify({
            messageType: 'START_GAME',
            timeOfTurn: time,
        })
    });
    };

    return (
        <div className="center-modal-part">
            <div
                className="modal"
                style={{
                    display: 'block', position: 'initial', height: 'auto', transition: 'top 0.5s ease',
                    animation: 'bounceIn 0.5s ease forwards'

                }}
            >
                {props.isShowStartGameModal && (
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>Bắt đầu chơi</Modal.Title>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                        </Modal.Header>

                        <Modal.Body>
                            <div className="set-time-progress-bar">
                                <Form.Label>Chọn thời gian mỗi lượt chơi:</Form.Label>
                                <Form.Control type="range" min="10" max="120" value={time} onChange={handleTimeChange} />
                                <p>Thời gian: {time} s</p>
                            </div>
                            <div className="note">
                                <p>
                                    <span style={{color: 'red'}}>Lưu ý: </span>
                                     Nếu hết thời gian mỗi lượt chơi mà người chơi chưa có nước đi mới phù hợp,
                                    thì sẽ bị mất lượt đi đó, hệ thống sẽ tự động đổi lượt đi cho người kia,
                                     mỗi người được phép bị mất lượt tối đa 3 lần.
                                </p>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className='profile-btn' style={{padding: '4px 8px'}} onClick={handleOKButtonClick}>
                                OK
                            </button>
                        </Modal.Footer>
                    </Modal.Dialog>
                )}

            </div>
        </div>
    );
}
export default StartGameModal;