
export async function LoginAPI(identify, password) {
    const urlString = "http://localhost:8001/authenticate/login";

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
        return responseData.data; //user(id, email, username, avatar, role, token, confirmEmail, nonLocked)
    }
    return responseData.message;
}

export async function RegisterAPI(email, password, confirmPassword) {
    const urlString = "http://localhost:8001/authenticate/register";

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