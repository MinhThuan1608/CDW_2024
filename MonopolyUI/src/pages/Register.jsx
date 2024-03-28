import React, { useState } from 'react';
import '../assert/style/register.css';
import { RegisterAPI } from '../api_caller/authenticate';


const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const register = async () => {
        const response = await RegisterAPI(email, password, confirmPassword);
        if (response.id) {
            window.location = '/'
        }
    }

    return (
        <div class="main-container-login">
            <div class="left-container">
                <div class="title-container">
                    <h1 class="title">CỜ TỶ PHÚ</h1>
                </div>
            </div>
            <div class="right-container">
                <div class="form-container">
                    <div class="form-bounder">
                        <p class="form-title">Đăng ký</p>
                        <input type="email" class="input-text" name="email" id="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)}
                            required />
                        <input type="password" class="input-text" name="password" id="password" placeholder="Mật khẩu" onChange={(event) => setPassword(event.target.value)}
                            required />
                        <input type="password" class="input-text" name="rePassword" id="re-password" placeholder="Nhập lại mật khẩu" onChange={(event) => setConfirmPassword(event.target.value)}
                            required />
                        <p id="error-message"></p>
                        <div class="button-container">
                            <a href="/login"><button id="register" class="button" form="">Trở lại</button></a>
                            <input type="submit" class="button" id="submit" value="Đăng ký" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default Register;