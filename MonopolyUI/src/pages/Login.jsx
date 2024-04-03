import React, { useContext, useEffect, useState } from 'react';
import { LoginAPI } from '../api_caller/authenticate';
import '../assert/style/login.css';
import { Client } from '@stomp/stompjs';
import { SocketContext } from '../App';

const Login = () => {
  const [identify, setIdentify] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    if (validateIdentify() && validatePassword()) {
      const response = await LoginAPI(identify, password);
      const errorMessage = document.querySelector('#error-message');
      if (response.id) {
        window.location = '/'
      } else {
        errorMessage.innerHTML = response
        errorMessage.style.display = "block"
      }
    }
  }

  const validateIdentify = () => {
    const identifyInput = document.querySelector('#identify');
    const errorIdentify = document.querySelector('#error-identify');
    if (!identify) {
      errorIdentify.innerHTML = 'Username hoặc Email không được bỏ trống';
      errorIdentify.style.display = 'block';
      identifyInput.classList.add('error');
      return false;
    } else {
      errorIdentify.style.display = 'none';
      identifyInput.classList.remove('error');
      return true;
    }
  }

  const validatePassword = () => {
    const errorPassword = document.querySelector('#error-password');
    const passwordInput = document.querySelector('#password');
    if (!password) {
      errorPassword.innerHTML = 'Password không được bỏ trống';
      errorPassword.style.display = 'block';
      passwordInput.classList.add('error');
      return false;
    } else {
      errorPassword.style.display = 'none';
      passwordInput.classList.remove('error');
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
            <p className="form-title">Đăng nhập</p>

            <input type="text" className="input-text" name="username" id="identify" placeholder="Username hoặc email"
              onChange={(event) => setIdentify(event.target.value)} onBlur={validateIdentify} />
            <p className="error-message" id="error-identify"></p>
            <input type="password" className="input-text" name="password" id="password" placeholder="Mật khẩu"
              onChange={(event) => setPassword(event.target.value)} onBlur={validatePassword} />
            <p className="error-message" id="error-password"></p>
            <p id="error-message"></p>
            <div className="button-container">
              <a href="/register"><button id="register" className="button" form="">Đăng ký</button></a>
              <input type="submit" className="button" id="submit" value="Đăng nhập" onClick={login} />
            </div>

            <a href="#" id="missing-password">Quên mật khẩu?</a>
          </div>
        </div>
      </div>
    </div>

  );
}
export default Login;