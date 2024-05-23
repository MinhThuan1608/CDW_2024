
export async function LoginAPI(identify, password) {
    const urlString = "http://103.9.159.202:8001/authenticate/login";

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            identify: identify,
            password: password
        }),
    });

    if (response.status == 401) return "Sai Username hoặc Password!"
    const responseData = await response.json();
    if (response.ok) {
        sessionStorage.setItem('access_token', responseData.data.token) //expired after 24 hours
        sessionStorage.setItem('user', JSON.stringify(responseData.data))
        return responseData.data; //user(id, email, username, avatar, role, money, token, confirmEmail, nonLocked)
    }
    return responseData.message;
}

export async function RegisterAPI(email, password, confirmPassword) {
    const urlString = "http://103.9.159.202:8001/authenticate/register";

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }),
    });

    const responseData = await response.json()
    if (response.ok) {
        return responseData.data; //user(id, email, username, avatar, role, token, confirmEmail, nonLocked)
    }
    return responseData.message;
}

export async function SendForgetPassword(email) {
    const urlString = "http://103.9.159.202:8001/authenticate/forget-pass?email=" + email;

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const responseData = await response.json()
        return responseData.data;
    }
    return false;
}

export async function SendResetPassword(password, confirmPassword, token) {
    const urlString = "http://103.9.159.202:8001/authenticate/user/reset-pass";

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
            password: password,
            confirmPassword: confirmPassword
        }),
    });

    if (response.ok) {
        const responseData = await response.json()
        return responseData.data;
    }
    return false;
}