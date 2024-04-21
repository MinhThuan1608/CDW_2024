const accessToken = sessionStorage.getItem('access_token');

export async function GetMe() {
    const urlString = `http://localhost:8001/user/me`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
    });

    const responseData = await response.json()
    if (response.ok) {
        return responseData.data; //user
    }
    return null;
}

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
        method: "PATCH",
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
        return responseData.data;
    }
    return responseData.message;// init fail
}
export async function EditProfileAvatar(username, avatar) {
    const urlString = `http://localhost:8001/user/edit/avatar`;

    const response = await fetch(urlString, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify({
            username: username,
            defaultAvatarId: null,
            avatar: avatar
        })
    });

    const responseData = await response.json()
    // const responseData = await response
    console.log(responseData)
    if (response.ok) {
        return responseData;
    }
    return responseData.message;// init fail
}
export async function ChangeUserName(username) {
    const urlString = `http://localhost:8001/user/edit/name`;

    const response = await fetch(urlString, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify({
            username: username,
            defaultAvatarId: null,
            avatar: null
        })
    });

    const responseData = await response.json()
    // const responseData = await response
    console.log(responseData)
    // if (response.ok) {
    //     return responseData;
    // }
    return responseData;// init fail
}
export async function GetBag(id) {
    const urlString = `http://localhost:8001/user/bag/${id}`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
    });
    const responseData = await response.json()
    console.log(responseData)
    if (response.ok) {
        return responseData.data;
    }
    return responseData.message;
}
export async function GetMatches(id) {
    const urlString = `http://localhost:8001/user/match/${id}`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
    });
    const responseData = await response.json()
    console.log(responseData)
    if (response.ok) {
        return responseData.data;
    }
    return responseData.message;
}


