import React, { useContext, useState } from 'react';
import { Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import { CreateRoom } from '../api_caller/room';
import { SocketContext } from '../App';


const CreateRoomModal = ({ showModalCreateRoom, setShowModalCreateRoom}) => {

    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const {socket, setSocket} = useContext(SocketContext);


    const handleCloseModal = () => {
        setShowModalCreateRoom(false);
    };

    const handleCreateRoom = async () => {
        if (!roomName) {
            const errorRoomName = document.querySelector('.error-message');
            errorRoomName.innerHTML = "Tên phòng không thể bỏ trống";
            errorRoomName.style.display = 'block';
            return;
        }
        const room = await CreateRoom(roomName, password);
        if (room){
            window.location = `/wait-room/${room.id}`
        } else alert('Error')
    }

    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial', height: 'auto' }}
        >
            {showModalCreateRoom && (
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Tạo Phòng Mới</Modal.Title>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                    </Modal.Header>

                    <Modal.Body >
                        <div className="createRoom">
                            <FloatingLabel controlId="floatingInput" label="Nhập tên phòng" className="mb-3" >
                                <Form.Control type="text" value={roomName} placeholder="Nhập tên phòng" onChange={(event) => setRoomName(event.target.value)}/>
                            </FloatingLabel>
                            <p className="error-message"></p>
                            <FloatingLabel controlId="floatingInput" label="Nhập password" className="mb-3">
                                <Form.Control type="password" value={password} placeholder="Nhập password" onChange={(event) => setPassword(event.target.value)}/>
                            </FloatingLabel>
                        
                            <Button className='createBtn' onClick={handleCreateRoom}>Tạo</Button>

                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            )}
        </div>
    );
}
export default CreateRoomModal;