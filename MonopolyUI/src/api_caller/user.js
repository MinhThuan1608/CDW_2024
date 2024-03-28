const accessToken = sessionStorage.getItem('access_token');

export async function IsUsernameValid(username) {
    const urlString = `http://localhost:8001/user/exists/${username}`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
    });

    const responseData = await response.json()
    if (response.ok) {
        return responseData.data; //true if username can be use, false if username is exists
    }
    return false;
}

export async function GetDefaultAvatar() {
    const urlString = `http://localhost:8001/user/avatar/default`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const responseData = await response.json()
    if (response.ok) {
        return responseData.data; //return an array contains dafault avatars, avatar(id, data, createAt, isActive, isDefaultAvatar)
    }
    return [];
}

export async function InitUser(username, defaultAvatarId, avatar) {
    const urlString = `http://localhost:8001/user/init`;

    const response = await fetch(urlString, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify({
            username: username,
            defaultAvatarId: defaultAvatarId,
            avatar: avatar
        })
    });

    const responseData = await response.json()
    if (response.ok) {
        return true; //true if ok
    }
    return responseData.message;// init fail
}