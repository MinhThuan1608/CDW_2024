export async function isUsernameValid(username) {
    const urlString = `http://localhost:8001/user/exists/${username}`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: ""
    });

    const responseData = await response.json()
    if (response.ok) {
        return responseData.data; //true if username can be use, false if username is exists
    }
    return false;
}

export async function getDefaultAvatar() {
    const urlString = `http://localhost:8001/user/avatar/default`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: ""
    });

    const responseData = await response.json()
    if (response.ok) {
        return responseData.data; //return an array contains dafault avatars, avatar(id, data, createAt, isActive, isDefaultAvatar)
    }
    return [];
}

export async function initUser(username, defaultAvatarId, avatar) {
    const urlString = `http://localhost:8001/user/init`;

    const response = await fetch(urlString, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
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