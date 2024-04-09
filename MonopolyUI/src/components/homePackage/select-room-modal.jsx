import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faUserAlt, faUserClock, faUsersLine } from '@fortawesome/free-solid-svg-icons';
import { GetAllRoom, JoinRoom } from '../../api_caller/room';
import { SocketContext } from '../../App';

const SelectRoomModal = ({ showModal, setShowModal, showJoinRoomModal, setShowJoinRoomModal }) => {
    const [filteredRooms, setFilteredRooms] = useState([]); // State để lưu danh sách phòng sau khi lọc
    const [rooms, setRooms] = useState([])
    const [roomChosen, setRoomChosen] = useState(null)
    const [password, setPassword] = useState('')
    const [wrongPass, setWrongPass] = useState(false)
    const { socket, setSocket } = useContext(SocketContext);

    useEffect(() => {
        const fecthData = async () => {
            const arr = await GetAllRoom();
            if (arr) {
                console.log(arr)
                setRooms(arr)
            }
        }
        fecthData();
    }, [])

    useEffect(() => {
        if (socket) {
            socket.subscribe('/topic/room/get-all', (message) => {
                console.log(JSON.parse(message.body))
                setRooms(JSON.parse(message.body))
            });
        }
    }, [socket])

    // Hàm xử lý khi ấn nút đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const joinRoomModal = () => { //choose room with pass
        setShowJoinRoomModal(true);
    };
    const closeJoinRoomModal = () => {
        setShowJoinRoomModal(false);
    };

    // hàm xử lý tham gia phòng k có pass
    const handleJoinRoom = async (room) => {
        if (room.numUser > 1) {
            alert('Phòng full ời má!')
            return;
        }
        if (room.havePass) {
            joinRoomModal();
            setRoomChosen(room);
            return;
        }
        const res = await JoinRoom(room.id, "");
        if (res) {
            
            window.location = `/wait-room/${room.id}`
        } else {
            alert('Error')
        }
    }
    // hàm xử lý tham gia phòng có pass
    const handleJoinRoomWithPass = async () => {
        const errorMessage = document.querySelector('.error-message');
        if (!password) {
            errorMessage.innerHTML = "Mật khẩu không được bỏ trống";
            errorMessage.style.display = "block";
            return;
        }
        const res = await JoinRoom(roomChosen.id, password);
        if (res) {
            window.location = `/wait-room/${roomChosen.id}`
        } else {
            errorMessage.innerHTML = "Sai mật khẩu";
            errorMessage.style.display = "block";
            setWrongPass(true)
            setTimeout(() => setWrongPass(false), 1000)
        }
    };
    const handleFilterRoomFnc = (id) => {
       setFilteredRooms(rooms.filter(room => room.id.toLowerCase().includes(id.toLowerCase()) ||
       room.roomName.toLowerCase().includes(id.toLowerCase())))
    }

    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial', height: 'auto' }}
        >
            {showModal && (
                <Modal.Dialog className={showJoinRoomModal ? 'd-none' : ''}>
                    <Modal.Header>
                        <Modal.Title>Chọn Phòng</Modal.Title>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="search-room">
                            <p>Tìm kiếm:</p>
                            <FloatingLabel className="mb-3 search-room-input" controlId="floatingInput"
                                label="Nhập ID">
                                <Form.Control type="text" placeholder="Nhập ID"
                                    onChange={e => handleFilterRoomFnc(e.target.value)} />
                            </FloatingLabel>
                        </div>
                        <div className="listRoom">
                            {(filteredRooms.length > 0 ? filteredRooms : rooms).map((room) => (

                                <div key={room.id} id={room.id} className="room" onClick={() => handleJoinRoom(room)}>
                                    {room.roomName}
                                    <div style={{ display: 'flex' }}>
                                        {Array.from({ length: room.numUser }, (_, index) => (
                                            <FontAwesomeIcon key={index} icon={faUser} />
                                        ))}
                                    </div>
                                    {room.havePass && (
                                        <FontAwesomeIcon icon={faLock} className="lock-icon" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Modal.Body>

                </Modal.Dialog>
            )}
            {showJoinRoomModal && (
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Tham gia</Modal.Title>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeJoinRoomModal}></button>
                    </Modal.Header>
                    <Modal.Body >
                        <div className="createRoom">
                            <FloatingLabel controlId="floatingInput" label="Nhập password" className="mb-3">
                                <Form.Control type="password" className={wrongPass?'shake':''} placeholder="Nhập password" onChange={(event) => setPassword(event.target.value)} />
                            </FloatingLabel>
                            <p className="error-message"></p>
                            <Button className='joinRoom' onClick={handleJoinRoomWithPass}>Vào</Button>
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            )}
        </div>
    );
}
export default SelectRoomModal;