import React, { useContext, useState, useEffect } from 'react';
import { Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import userAvt from '../../assert/images/avatar/meo.jpg';
import { SocketContext } from '../../App';

import dice from '../../assert/images/icon/dice.png'
import { EditProfile, IsUsernameValid } from '../../api_caller/user';
import Swal from 'sweetalert2';


const EditUserProfileModal = ({ showModalProfile, setShowModalProfile }) => {
    const userLocal = JSON.parse(sessionStorage.getItem('user'))

    const [username, setUsername] = useState('')
    const [valid, setValid] = useState(false)
    const [avatar, setAvatar] = useState({});
    const [isChangeName, setIsChangeName] = useState(false);
    const [user, setUser] = useState(null)

    const handleCloseModal = () => {
        setShowModalProfile(false);
    };

    const handleUploadClick = () => {
        const fileInput = document.getElementById('input-avatar-file');
        fileInput.click();
    };
    const handleImgUploaded = (e) => {
        const image = e.target.files[0];
        if (image && image.size > 1048576) {
            const errorMessage = document.querySelector('.error-message')
            errorMessage.innerHTML = 'Hình ảnh phải có kích thước nhỏ hơn 1MB'
            errorMessage.style.display = 'block'
            e.target.value = ""
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target.result;
                var imageObject = { data: imageDataUrl }
                setAvatar(imageObject);
                console.log(avatar.data)
                
                user.avatar.data = imageDataUrl;
            };
            reader.readAsDataURL(image);
        }
    };

    const handleChangeUsername = async (event) => {
        var newUsername = event.target.value;
        setUsername(newUsername);
        validateUsername(newUsername);
    }
    const adjectives = ['Red', 'Brave', 'Wise', 'Mighty', 'Swift', 'Gentle', 'Fierce'];
    const nouns = ['Dragon', 'Knight', 'Wizard', 'Sorcerer', 'Warrior', 'Archer', 'Thief'];
    const generateRandomName = () => {
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const random = Math.floor(Math.random() * 100000);
        var randomName = randomAdjective + randomNoun + random;
        setUsername(randomName)
        validateUsername(randomName)
    }

    const validateUsername = async (uname) => {
        console.log(uname)
        const errorMessage = document.querySelector('.error-message')
        if (uname) {
            const isUsernameValid = await IsUsernameValid(uname);
            if (isUsernameValid) {
                errorMessage.style.display = 'none'
                setValid(true)
            } else {
                errorMessage.innerHTML = 'Tên này đã được sử dụng bởi người chơi khác'
                errorMessage.style.display = 'block'
                setValid(false)
            }
        } else {
            errorMessage.innerHTML = 'Username không được bỏ trống'
            errorMessage.style.display = 'block'
            setValid(false)
        }
    }
    const changeAvt = async () => {
        // console.log(avatar)
        // console.log(avatar.data)
        const response = await EditProfile(userLocal.username,avatar.data);
        if (response.id) {
            sessionStorage.setItem('user', JSON.stringify(response))
            userLocal.avatar.data = avatar.data
            Swal.fire({
                icon: 'success',
                text: 'Thay đổi thành công!',
                confirmButtonText: "OK",
                showConfirmButton: true,
                confirmButtonColor: '#49108B',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
            // setShowModalProfile(false)
        } else {
            const errorMessage = document.querySelector('.error-message');
            errorMessage.innerHTML = response;
            errorMessage.style.display = 'block';
        }

    }

    useEffect(() => {
        const userStorage = JSON.parse(sessionStorage.getItem('user'))
        setUser(userStorage)
    }, [])
    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial', height: 'auto' }}
        >
            {showModalProfile && (
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Hồ sơ của tôi</Modal.Title>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                    </Modal.Header>

                    <Modal.Body >
                        <div className="createRoom">
                            <div className="editAvt">
                                <img src={!user ? userAvt : user.avatar ? user.avatar.data : userAvt} alt="avatar" />

                            </div>
                            <div className="upload-container-profile">
                                <button className='upload-avatar-button' onClick={handleUploadClick}>+ Tải ảnh lên</button>
                                <input type="file" name="avatarFile" accept="image/*" hidden id="input-avatar-file" onChange={handleImgUploaded} />
                            </div>
                            <div className="username-container">
                                <div className="input-username-container-profile">
                                    <input type="text" value={username ? username : userLocal.username} name="username" maxLength={20} placeholder={userLocal.username} onChange={handleChangeUsername} disabled={isChangeName ? false : true} />
                                    <img src={dice} title="Tạo ngẫu nhiên" alt="random" className="dice" onClick={isChangeName ? generateRandomName : null} />
                                </div>
                                <div className="error-container">
                                    <p className="error-message"></p>
                                </div>
                            </div>
                            <Button className='createBtn' onClick={changeAvt}>Xác nhận</Button>
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            )}
        </div>
    );
}
export default EditUserProfileModal;