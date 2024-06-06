import { Domain } from "../App";

const accessToken = sessionStorage.getItem('access_token');


export async function SearchMatches(id,page) {
    const urlString = Domain + `/search/matches`;

    const response = await fetch(urlString, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify({
            page: page, 
            id: id,
        }),
    });

    if (response.ok) {
        const responseData = await response.json()
        return responseData.data; //arr of matches
    }
    return false;
}

export async function GetUserBySearch(username, page) {
    const urlString = Domain + `/user/search`;

    const response = await fetch(urlString, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify({
            page: page,
            username:username,
        }),
    });

    if (response.ok) {
        const responseData = await response.json()
        return responseData.data; //arr of matches
    }
    return false;
}
export async function GetStatistics() {
    const urlString = Domain + `/statistics`;

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
    return [];
}