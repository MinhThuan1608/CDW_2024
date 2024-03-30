import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import { GetAllRoom, JoinRoom } from '../api_caller/room';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faUserAlt, faUserClock, faUsersLine } from '@fortawesome/free-solid-svg-icons';
import { SocketContext } from '../App';



const SelectRoomModal = ({ showModal, setShowModal, showJoinRoomModal, setShowJoinRoomModal }) => {
    const [filteredRooms, setFilteredRooms] = useState([]); // State để lưu danh sách phòng sau khi lọc
    const [rooms, setRooms] = useState([])
    const [roomChosen, setRoomChosen] = useState(null)
    const [password, setPassword] = useState('')
    const {socket, setSocket} = useContext(SocketContext);

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

    useEffect(()=>{
        if (socket){
            socket.subscribe('/topic/room/get-all', (message) => {
                setRooms(JSON.parse(message.body))
            });
        }
    },[socket])

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
    const handleJoinRoom = async (room) => {
        if (room.numUser>1) {
            alert('Phòng full ời má!')
            return;
        }
        if (room.havePass) {
            joinRoomModal();
            setRoomChosen(room);
            return;
        }
        const res = await JoinRoom(room.id, "");
        if (res){
            window.location = `/wait-room/${room.id}`
        } else {
            alert('Error')
        }
    }
    const handleJoinRoomWithPass = async () => {
        if (!password){
            const errorMessage = document.querySelector('.error-message');
            errorMessage.innerHTML = "Mật khẩu không được bỏ trống";
            errorMessage.style.display = "block";
            return;
        }
        const res = await JoinRoom(roomChosen.id, password);
        if (res){
            window.location = `/wait-room/${roomChosen.id}`
        } else {
            alert('Error')
        }
    };


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
                                    onChange={e => setFilteredRooms(rooms.filter(room => room.roomId.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                        room.roomName.toLowerCase().includes(e.target.value.toLowerCase())))} />
                            </FloatingLabel>
                        </div>
                        <div className="listRoom">
                            {(filteredRooms.length > 0 ? filteredRooms : rooms).map((room) => (

                                <div key={room.id} id={room.id} className="room" onClick={()=> handleJoinRoom(room)}>
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
                                <Form.Control type="password" placeholder="Nhập password" onChange={(event) => setPassword(event.target.value)}/>
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