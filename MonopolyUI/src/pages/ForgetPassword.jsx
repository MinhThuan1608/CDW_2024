import React, { useState } from 'react';
import '../assert/style/login.css';
import { SendForgetPassword } from '../api_caller/authenticate';
import { toast } from 'react-toastify';
import Loader from '../components/loader/loader';

const ForgetPassword = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setLoading] = useState(false)
    const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/

    const handleForgetPassword = async () => {
        if (validateIdentify()) {
            setLoading(true)
            const res = await SendForgetPassword(email);
            setLoading(false)
            if (res){
                toast.success("Một mail đã được gửi về email của bạn.\n Vui lòng kiểm tra để đổi mật khẩu nhé!")
            } else toast.error("Email bạn nhập không tồn tại!")
        }
    }

    const validateIdentify = () => {
        const identifyInput = document.querySelector('#email');
        const errorIdentify = document.querySelector('#error-email');
        if (!email) {
            errorIdentify.innerHTML = 'Email không được bỏ trống';
            errorIdentify.style.display = 'block';
            identifyInput.classList.add('error');
            return false;
        } else if (!emailRegex.test(email)) {
            errorIdentify.innerHTML = 'Email không hợp lệ';
            errorIdentify.style.display = 'block';
            identifyInput.classList.add('error');
            return false;
        } else {
            errorIdentify.style.display = 'none';
            identifyInput.classList.remove('error');
            return true;
        }
    }

    return (
        <div className="main-container-login">
            <div className="left-container">
                <div className="title-container">
                    <h1 className="title">♛ CỜ VUA ♛</h1>
                </div>
            </div>
            <div className="right-container">
                <div className="form-container">
                    <div className="form-bounder">
                        <p className="form-title">Quên mật khẩu</p>
                        <input type="text" className="input-text" name="email" id="email" placeholder="Nhập vào email"
                            onChange={(event) => setEmail(event.target.value)} onBlur={validateIdentify} />
                        <p className="error-message" id="error-email"></p>
                        <div className="button-container">
                        <a href="/login"><button id="register" class="button" form="">Trở lại</button></a>
                            <input type="submit" className="button" id="submit" value="Xác nhận" onClick={handleForgetPassword} />
                        </div>

                    </div>
                </div>
            </div>
            <Loader isLoading={isLoading}/>
        </div>

    );
}
export default ForgetPassword;