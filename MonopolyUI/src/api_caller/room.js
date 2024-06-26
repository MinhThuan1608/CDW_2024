const accessToken = sessionStorage.getItem('access_token');

export async function CreateRoom(roomName, password) {
    const urlString = `http://103.9.159.202:8001/room/create`;

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify({
            roomName: roomName,
            password: password
        })
    });

    const responseData = await response.json()
    if (response.ok) {
        return responseData.data; //room (id, name, password, arr of users)
    }
    return false;
}

export async function GetAllRoom() {
    const urlString = `http://103.9.159.202:8001/room/all`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
    });

    const responseData = await response.json()
    if (response.ok) {
        return responseData.data; //arr of room (id, name, numOfUser)
    }
    return false;
}

export async function JoinRoom(roomId, password) {
    const urlString = `http://103.9.159.202:8001/room/join`;

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify({
            roomId: roomId,
            password: password
        })
    });

    const responseData = await response.json()
    if (response.ok) {
        return responseData.code; //true if you can join this room and else
    }
    return false;
}

export async function GetRoomPass(roomId) {
    const urlString = `http://103.9.159.202:8001/room/${roomId}/get/pass`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
    });

    if (response.ok) {
        const responseData = await response.json()
        if (responseData.data != null || responseData.data != "")
            return responseData.data; //true if you can join this room and else
        return false;
    }
    return false;
}

export async function GetUserInRoom(roomId) {
    const urlString = `http://103.9.159.202:8001/room/${roomId}/user`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
    });

    const responseData = await response.json()
    if (response.ok) {
        if (responseData.data != null && responseData.data != false)
            return responseData.data;
        return [];
    }
    return false;
}
export async function GetTimmer(roomId) {
    const urlString = `http://103.9.159.202:8001/room/game/time/${roomId}`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
    });

    const responseData = await response.json()
    if (response.ok) {
        return responseData.data;
    }
    return null;
}

export async function GetRoomMeIn() {
    const urlString = `http://103.9.159.202:8001/room/me`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
    });

    if (response.ok) {
        const responseData = await response.json()
        return responseData.data;
    }
    return null;
}