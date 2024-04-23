import React, { useEffect, useState } from 'react';
import '../assert/style/register.css';
import { SendResetPassword } from '../api_caller/authenticate';
import Swal from 'sweetalert2';
import Loader from '../components/loader/loader';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';


const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [token, setToken] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const queryString = location.search;
        const params = new URLSearchParams(queryString);
        setToken(params.get('token'))
    }, [])

    const handleResetPassword = async () => {
        setLoading(true)
        if (validatePassword() && validateRePassword()) {
            const response = await SendResetPassword(password, confirmPassword, token);
            if (response) {
                let timerInterval;
                Swal.fire({
                    title: "Đổi mật khẩu thành công!",
                    html: "Tự động chuyển về trang Đăng nhập sau <b>5</b>s...",
                    icon: "success",
                    timer: 5000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didOpen: () => {
                        const timer = Swal.getPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                            timer.textContent = `${Math.floor(Swal.getTimerLeft() / 1000) + 1}`;
                        }, 1000);
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                }).then(() => {
                    window.location = '/login';
                });
            } else {
                toast.error("Link hết hiệu lực hoặc có lỗi xảy ra!")
            }
        }
        setLoading(false)
    }

    const validatePassword = () => {
        const passwordInput = document.querySelector('#password')
        const errorPassword = document.querySelector('#error-password')
        if (!password) {
            errorPassword.innerHTML = 'Password không được bỏ trống';
            errorPassword.style.display = 'block';
            passwordInput.classList.add('error');
            return false;
        } else if (password.length < 8) {
            errorPassword.innerHTML = 'Password phải có ít nhất 8 ký tự';
            errorPassword.style.display = 'block';
            passwordInput.classList.add('error');
            return false;
        } else {
            errorPassword.style.display = 'none';
            passwordInput.classList.remove('error');
            return true;
        }
    }

    const validateRePassword = () => {
        const rePasswordInput = document.querySelector('#re-password')
        const errorRePassword = document.querySelector('#error-re-password')
        if (!confirmPassword) {
            errorRePassword.innerHTML = 'Password không được bỏ trống';
            errorRePassword.style.display = 'block';
            rePasswordInput.classList.add('error');
            return false;
        } else if (confirmPassword !== password) {
            errorRePassword.innerHTML = 'Nhập lại phải giống mật khẩu';
            errorRePassword.style.display = 'block';
            rePasswordInput.classList.add('error');
            return false;
        } else {
            errorRePassword.style.display = 'none';
            rePasswordInput.classList.remove('error');
            return true;
        }
    }

    return (
        <>
            <div class="main-container-login">
                <div class="left-container">
                    <div class="title-container">
                        <h1 class="title">♛ CỜ VUA ♛</h1>
                    </div>
                </div>
                <div class="right-container">
                    <div class="form-container">
                        <div class="form-bounder">
                            <p class="form-title">Đổi mật khẩu</p>
                            <input type="password" class="input-text" name="password" id="password" placeholder="Mật khẩu"
                                onChange={(event) => setPassword(event.target.value)} onBlur={validatePassword} />
                            <p className="error-message" id="error-password"></p>
                            <input type="password" class="input-text" name="rePassword" id="re-password" placeholder="Nhập lại mật khẩu"
                                onChange={(event) => setConfirmPassword(event.target.value)} onBlur={validateRePassword} />
                            <p className="error-message" id="error-re-password"></p>
                            <p id="error-message"></p>
                            <div class="button-container">
                                <a href="/login"><button id="register" class="button" form="">Trở lại</button></a>
                                <input type="submit" class="button" id="submit" value="Xác nhận" onClick={handleResetPassword} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Loader isLoading={isLoading} />
        </>
    );
}
export default ResetPassword;