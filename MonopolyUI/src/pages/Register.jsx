import React from 'react';
import '../assert/style/register.css';


const Register = () => {

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
                        <form id="register-form">
                            <input type="email" class="input-text" name="email" id="email" placeholder="Email"
                                required />
                            <input type="password" class="input-text" name="password" id="password" placeholder="Mật khẩu"
                                required />
                            <input type="password" class="input-text" name="rePassword" id="re-password" placeholder="Nhập lại mật khẩu"
                                required />
                            {/* <p id="error-message" ></p> */}
                            <div class="button-container">
                                <a href="/login"><button id="register" class="button" form="">Trở lại</button></a>
                                <input type="submit" class="button" id="submit" value="Đăng ký" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default Register;