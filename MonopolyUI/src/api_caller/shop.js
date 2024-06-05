import { Domain } from "../App";

const accessToken = sessionStorage.getItem('access_token');

export async function GetProduct() {
    const urlString = Domain+`/shop`;

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
    });

    const responseData = await response.json()
    
    if (response.ok) {
        return responseData.data; //return an array contains dafault avatars, avatar(id, data, createAt, isActive, isDefaultAvatar)
    }
    return [];
}
export async function BuyItem(productId, buyNumber) {
    const urlString = Domain+`/buyItem`;

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify({
            productId: productId,
            amount: buyNumber,
        }),
    });

    const responseData = await response.json()
    console.log(responseData)
    return responseData.data; 
}
export async function SaleItem(itemId, saleNumber) {
    const urlString = Domain+`/saleItem`;

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify({
            itemId: itemId,
            saleNumber: saleNumber,
        }),
    });

    const responseData = await response.json()
    console.log(responseData)
    
    return responseData.data; //return an array contains dafault avatars, avatar(id, data, createAt, isActive, isDefaultAvatar)
    
}