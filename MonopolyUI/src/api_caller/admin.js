import { Domain } from "../App";
const accessToken = sessionStorage.getItem('access_token');
export async function GetAllMatches(page) {
    const urlString = Domain + `/matches/` + page;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
    });

    const responseData = await response.json()
    if (response.ok) {
        return responseData.data; //arr of matches
    }
    return false;
}