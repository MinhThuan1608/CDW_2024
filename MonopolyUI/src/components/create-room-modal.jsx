import React from 'react';

import { Button, Modal, Form, FloatingLabel } from 'react-bootstrap';


const CreateRoomModal = ({ showModalCreateRoom, setShowModalCreateRoom }) => {

    // Hàm xử lý khi ấn nút đóng modal
    const handleCloseModal = () => {
        setShowModalCreateRoom(false);
    };

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
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Nhập tên phòng"
                                className="mb-3"
                            >
                                <Form.Control type="text" placeholder="Nhập tên phòng" />
                            </FloatingLabel>
                            
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Nhập password"
                                className="mb-3"
                            >
                                <Form.Control type="password" placeholder="Nhập password" />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingPassword" label="Số tiền đặt cược">
                                <Form.Control type="number" min='1' max='2000000' placeholder='Số tiền đặt cược' />
                            </FloatingLabel>
                            <Button className='createBtn'>Tạo</Button>

                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            )}
        </div>
    );
}
export default CreateRoomModal;