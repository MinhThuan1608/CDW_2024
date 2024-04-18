import React, { useEffect, useState } from 'react';
import '../assert/style/create-character.css';
import Avt from '../assert/images/avatar/user.png'
import dice from '../assert/images/icon/dice.png'
import { GetDefaultAvatar, InitUser, IsUsernameValid } from '../api_caller/user';


const CreateCharacter = () => {
    const [listImg, setListImg] = useState([]);
    const [avt, setAvt] = useState({});
    const [username, setUsername] = useState('')
    const [valid, setValid] = useState(false)

    useEffect(() => {
        const getAvatars = async () => {
            const avatars = await GetDefaultAvatar();
            setListImg(avatars)
            setAvt(avatars[0])
        }
        if (listImg.length === 0) getAvatars();
        return () => { }

    }, [])

    const handleUploadClick = () => {
        const fileInput = document.getElementById('input-avatar-file');
        fileInput.click(); // Kích hoạt sự kiện click trên input file ẩn
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
                console.log(avt.data)
                setAvt(imageObject);
                setListImg(prevList => [...prevList, imageObject]);
            };
            reader.readAsDataURL(image);
        }
    };

    var timeOutId;
    const handleChangeUsername = async (event) => {
        var newUsername = event.target.value;
        clearTimeout(timeOutId)
        timeOutId = setTimeout(()=>{
            setUsername(newUsername);
            validateUsername(newUsername);
        }, 500)
    }

    const validateUsername = async (uname) => {
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

    const initUser = async () => {
        validateUsername(username)
        
        if (valid) {
            const response = await InitUser(username, avt.id, avt.data);
            if (response.id) {
                sessionStorage.setItem('user', JSON.stringify(response))
                window.location = '/'
            } else {
                const errorMessage = document.querySelector('.error-message');
                errorMessage.innerHTML = response;
                errorMessage.style.display = 'block';
            }
        }
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

    return (
        <div id="create-character-form">
            <div className="main-container-cha">
                <div className="left-container-cha">
                    <div className="choose-avatar-container">
                        <span className="choose-avatar-title">Chọn ảnh đại diện</span>
                        <div className="choose-avatar-scroller">
                            {listImg.map((img, index) => (
                                <img src={img.data} id={img.id} key={index} alt="avatar" className='avatar' onClick={(event) => setAvt({ id: event.target.id, data: event.target.src })} />
                            ))
                            }

                        </div>
                        <div className="upload-container">
                            <button id="upload-avatar-button" onClick={handleUploadClick}>+ Tải ảnh lên</button>
                            <input type="file" name="avatarFile" accept="image/*" hidden id="input-avatar-file" onChange={handleImgUploaded} />
                        </div>
                    </div>
                </div>
                <div className="right-container-cha">
                    <div className="title-container">
                        <p className="title">♛ CỜ VUA ♛</p>
                    </div>
                    <div className="avatar-review-container">
                        <img src={avt.data} alt="avatar" id="avatar-review" />
                    </div>
                    <div className="username-container">
                        <div className="input-username-container">
                            <input type="text" name="username" id="username-cha" maxLength={20} placeholder="Tên nhân vật" onChange={handleChangeUsername} />
                            <img src={dice} title="Tạo ngẫu nhiên" alt="random" className="dice" onClick={generateRandomName} />
                        </div>
                        <div className="error-container">
                            <p className="error-message"></p>
                        </div>
                    </div>
                    <div className="button-container">
                        <button id="confirm" onClick={initUser}>Xác nhận</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CreateCharacter;