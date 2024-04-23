import React, { useContext, useState, useEffect } from 'react';
import { Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import userAvt from '../../assert/images/avatar/meo.jpg';
import dice from '../../assert/images/icon/dice.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSkullCrossbones, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { ChangeUserName, EditProfileAvatar, GetMatches, IsUsernameValid } from '../../api_caller/user';
import { toast } from 'react-toastify';
import { formatDateAndTime, formatSecondsToHHMMSS } from '../gameBoard/help';
import Loader from '../loader/loader';



const EditUserProfileModal = (props) => {
    const errorMessageText = document.querySelector('.error-message')

    const [listMatch, setListMatch] = useState([]);
    const [isLoading, setLoading] = useState(false)

    const [username, setUsername] = useState(props.me.username)
    const [valid, setValid] = useState(false)
    const [avatar, setAvatar] = useState({});
    const [isChangeName, setIsChangeName] = useState(false);
    const [isChangeAvt, setIsChangeAvt] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');



    const handleCloseModal = () => {
        props.setShowModalProfile(false);
    };

    const handleUploadClick = () => {
        const fileInput = document.getElementById('input-avatar-file');
        fileInput.click();
    };
    const handleImgUploaded = (e) => {
        const image = e.target.files[0];
        if (image && image.size > 1048576) {
            // const errorMessage = document.querySelector('.error-message')
            setErrorMessage('Hình ảnh phải có kích thước nhỏ hơn 1MB')
            errorMessageText.style.display = 'block'
            e.target.value = ""
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target.result;
                var imageObject = { data: imageDataUrl }
                setAvatar(imageObject);
                setErrorMessage('')
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
        // const errorMessage = document.querySelector('.error-message')
        if (uname) {
            const isUsernameValid = await IsUsernameValid(uname);
            if (isUsernameValid) {
                errorMessageText.style.display = 'none'
                setValid(true)
            } else {
                setErrorMessage('Tên này đã được sử dụng bởi người chơi khác')
                errorMessageText.style.display = 'block'
                setValid(false)
            }
        } else {
            setErrorMessage('Username không được bỏ trống')
            errorMessageText.style.display = 'block'
            setValid(false)
        }
    }
    const changeAvt = async () => {
        setLoading(true)
        if (avatar.data !== '') {
            const response = await EditProfileAvatar(props.me.username, avatar.data);
            if (response.data.id) {
                props.setMe(response.data)
                toast.success('Đổi avatar thành công!')
                window.location.reload()
            } else {
                setErrorMessage(response.message)
                errorMessageText.style.display = 'block';
            }

        } else {
            setErrorMessage("Chưa tải ảnh lên!")
            errorMessageText.style.display = 'block';
        }
        setLoading(false)

    }


    const changeName = async () => {
        setLoading(true)
        validateUsername(username)
        if (valid) {
            const response = await ChangeUserName(username);
            console.log(response)
            if (response.data.id) {
                props.setMe(response.data)
                toast.success('Đổi tên thành công!')

                // window.location.reload();
            } else {
                setErrorMessage(response.message)
                errorMessageText.style.display = 'block';
            }

        }
        setLoading(false)

    }
    useEffect(() => {
        setLoading(true)
        const getMatches = async () => {
            const matches = await GetMatches(props.me.id);
            if (matches) {
                setListMatch(matches)
            }
        }
        getMatches();
        setLoading(false)

    }, [])

    const handleChangeAvatar = () => {
        if (!isChangeAvt && !isChangeName)
            setIsChangeAvt(true)
        else setIsChangeAvt(false)
        setErrorMessage('')
    }
    const handleChangeName = () => {
        if (!isChangeAvt && !isChangeName)
            setIsChangeName(true)
        else setIsChangeName(false)
        setErrorMessage('')
    }

    return (
        <>
            <div
                className="modal"
                style={{
                    display: 'block', position: 'initial', height: 'auto', transition: 'top 0.5s ease',
                    animation: 'bounceIn 0.5s ease forwards'
                }}
            >
                {props.showModalProfile && (
                    <Modal.Dialog className='modal-profile'>
                        <Modal.Header>
                            <Modal.Title>Hồ sơ của tôi</Modal.Title>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                        </Modal.Header>

                        <Modal.Body className='profile-contain'>
                            <div className="profile-left-contain">
                                <div className="editAvt">
                                    <img src={avatar.data ? avatar.data : props.me.avatar ? props.me.avatar.data : userAvt} alt="avatar" onClick={handleChangeAvatar} />
                                    <div>
                                        <p style={{ marginBottom: 0, fontWeight: '200', fontSize: '11px' }}>id: {props.me.id}</p>
                                        <div className="input-username-container-profile">
                                            <p>{props.me.username}</p>
                                            <FontAwesomeIcon icon={faPen} onClick={handleChangeName} className="icon-pen" />
                                        </div>
                                    </div>
                                </div>

                                {isChangeName && (
                                    <div className="change-name-profile-container">
                                        <div className='input-and-dice'>
                                            <input type="text" value={username ? username : props.me.username} name="username" maxLength={20} placeholder={props.me.username} onChange={handleChangeUsername} />
                                            <img src={dice} title="Tạo ngẫu nhiên" alt="random" className="dice" onClick={generateRandomName} />
                                        </div>
                                        <button className='profile-btn' onClick={changeName}>Đổi tên</button>
                                    </div>
                                )}
                                {isChangeAvt && (
                                    <>
                                        <div className="upload-avt-profile">
                                            <button className='profile-btn' onClick={handleUploadClick}>+ Tải ảnh lên</button>
                                            <input type="file" name="avatarFile" accept="image/*" hidden id="input-avatar-file" onChange={handleImgUploaded} />
                                            <button className='profile-btn' onClick={changeAvt}>Xác nhận</button>
                                        </div>
                                    </>
                                )}
                                <div className="error-container">
                                    <p className="error-message">{errorMessage}</p>
                                </div>
                            </div>
                            <div className="profile-right-contain">
                                <p className='title-history-match'> Lịch sử trận đấu - {listMatch.length} trận </p>
                                <div className="history-match">
                                    {listMatch.map((match, index) => (
                                        <div className={`match ${props.me.id == match.winner.id ? `win` : `lose`}`} key={index}>
                                            <div className='match-top'>
                                                <p>
                                                    Ngày chơi: {formatDateAndTime(match.startAt)}
                                                    {/* đến {formatDateAndTime(match.endAt)} */}
                                                </p>
                                                <p className={props.me.id == match.winner.id ? 'icon-win' : 'icon-lose'}>
                                                    {props.me.id == match.winner.id ? 'VICTORY' : 'DEFEAT'}
                                                </p>
                                            </div>
                                            <div className='match-bottom'>
                                                {props.me.id == match.winner.id ? (
                                                    <>
                                                        <p>
                                                            <FontAwesomeIcon icon={faTrophy} className="icon-win" />
                                                            {match.winner.username}
                                                        </p>
                                                        <p>
                                                            <FontAwesomeIcon icon={faSkullCrossbones} className="icon-lose" />
                                                            {match.loser.username}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p>
                                                            <FontAwesomeIcon icon={faSkullCrossbones} className="icon-lose" />
                                                            {match.loser.username}
                                                        </p>
                                                        <p>
                                                            <FontAwesomeIcon icon={faTrophy} className="icon-win" />
                                                            {match.winner.username}
                                                        </p>
                                                    </>
                                                )}

                                                <p>{formatSecondsToHHMMSS(match.totalTime)}</p>
                                            </div>
                                        </div>

                                    ))}

                                </div>
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                )}
            </div>
            {isLoading && <Loader isLoading={isLoading} />}
        </>
    );
}
export default EditUserProfileModal;