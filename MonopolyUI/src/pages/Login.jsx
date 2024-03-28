import React, { useState } from 'react';
import { LoginAPI } from '../api_caller/authenticate';
import '../assert/style/login.css';


const Login = () => {
  const [identify, setIdentify] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    const response = await LoginAPI(identify, password)
    if (response.id) {
      window.location = '/'
    } else {
      const errorMessage = document.querySelector('#error-message')
      errorMessage.innerHTML = response
      errorMessage.style.display = "block"
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
            <p class="form-title">Đăng nhập</p>

            <input type="text" class="input-text" name="username" id="username" placeholder="Username hoặc email" onChange={(event) => setIdentify(event.target.value)}
              required />
            <input type="password" class="input-text" name="password" id="password" placeholder="Mật khẩu" onChange={(event) => setPassword(event.target.value)}
              required />
            <p id="error-message"></p>
            <div class="button-container">
              <a href="/register"><button id="register" class="button" form="">Đăng ký</button></a>
              <input type="submit" class="button" id="submit" value="Đăng nhập" onClick={login} />
            </div>

            <a href="#" id="missing-password">Quên mật khẩu?</a>
          </div>
        </div>
      </div>
    </div>

  );
}
export default Login;