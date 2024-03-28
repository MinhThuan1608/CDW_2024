import React, { useState } from 'react';
import '../assert/style/create-character.css';
import Avt from '../assert/images/avatar/user.png'
import dice from '../assert/images/icon/dice.png'


const CreateCharacter = () => {
    const [listImg, setListImg] = useState([Avt, dice, Avt, dice, dice, Avt, dice, dice, dice, Avt, dice]);

    const [avt, setAvt] = useState(Avt);

    const handleUploadClick = () => {
        const fileInput = document.getElementById('input-avatar-file');
        fileInput.click(); // Kích hoạt sự kiện click trên input file ẩn
    };
    const handleImgUploaded = (e) => {
        const image = e.target.files[0];
        if (image) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target.result;
                setAvt(imageDataUrl);
                setListImg(prevList => [...prevList, imageDataUrl]);
            };
            reader.readAsDataURL(image);
        }
    };
    return (
        <div id="create-character-form">
            {/* <input type="hidden" name="avatar" id="avatar-hidden" value=""/> */}
            <div className="main-container-cha">
                <div className="left-container-cha">
                    <div className="choose-avatar-container">
                        <span className="choose-avatar-title">Chọn ảnh đại diện</span>
                        <div className="choose-avatar-scroller">
                            {listImg.map((img, index) => (
                                <img src={img} alt="avatar" className='avatar' />
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
                        <p className="title">CỜ TỶ PHÚ</p>
                    </div>
                    <div className="avatar-review-container">
                        <img src={avt} alt="avatar" id="avatar-review" />
                    </div>
                    <div className="username-container">
                        <div className="input-username-container">
                            <input type="text" name="username" id="username-cha" placeholder="Tên nhân vật" required />
                            <img src={dice} title="Tạo ngẫu nhiên" alt="random" className="dice" />
                        </div>
                        <div className="error-container">
                            <p className="error-message"></p>
                        </div>
                    </div>
                    <div className="button-container">
                        <button id="confirm">Xác nhận</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CreateCharacter;