import React from 'react';
import '../assert/style/login.css';


const Login = () => {
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
            <form action='' method="post">
              <input type="text" class="input-text" name="username" id="username" placeholder="Email"
                required />
              <input type="password" class="input-text" name="password" id="password" placeholder="Mật khẩu"
                required />
              {/* <p id="error-message" th:if="${errorMessage}" th:text="${errorMessage}"></p> */}
              <div class="button-container">
                <a href="/register"><button id="register" class="button" form="">Đăng ký</button></a>
                <input type="submit" class="button" id="submit" value="Đăng nhập" />
              </div>
            </form>
            <a href="#" id="missing-password">Quên mật khẩu?</a>
          </div>
        </div>
      </div>
    </div>

  );
}
export default Login;