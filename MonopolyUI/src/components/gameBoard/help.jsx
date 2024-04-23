
export const getCharacter = file => String.fromCharCode(file + 96)
export const createPosition = () => {
    
    const position = new Array(8).fill('').map(x => new Array(8).fill(''))
    for (let i = 0; i < 8; i++) {
        position[6][i] = 'bp'
        position[1][i] = 'wp'
    }
    position[0][0] = 'wr'
    position[0][1] = 'wn'
    position[0][2] = 'wb'
    position[0][3] = 'wq'
    position[0][4] = 'wk'
    position[0][5] = 'wb'
    position[0][6] = 'wn'
    position[0][7] = 'wr'

    position[7][0] = 'br'
    position[7][1] = 'bn'
    position[7][2] = 'bb'
    position[7][3] = 'bq'
    position[7][4] = 'bk'
    position[7][5] = 'bb'
    position[7][6] = 'bn'
    position[7][7] = 'br'
    
    return position
}

export const copyPosition = position => {
    const newPosition =
        new Array(8).fill('').map(x => new Array(8).fill(''));

    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            newPosition[rank][file] = position[rank][file]
        }
    }

    return newPosition
}

export const formatDate = (data) => {

    // Tạo một đối tượng Date từ chuỗi ngày
    const dateObj = new Date(data);

    // Lấy giờ và phút
    const hour = dateObj.getUTCHours();
    const minute = dateObj.getUTCMinutes();

    
    return `${hour < 10 ? '0'+hour : hour}:${minute < 10 ? '0'+minute : minute}`

}
export const formatDateAndTime = (data) => {

    const dateObj = new Date(data);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    const year = String(dateObj.getFullYear()); 

    const formattedDateTime = `${hours}:${minutes} ${day}-${month}-${year}`;

    return formattedDateTime;

}
export const formatSecondsToHHMMSS = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  const formattedTime = `${formattedMinutes}:${formattedSeconds}`;

  return formattedTime;
}
export const formatCurrency = (amount) => {
    return amount.toLocaleString('en-EN');
}
export const convertSecondsToMinutesAndSeconds = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
const adjectives = ['Red', 'Brave', 'Wise', 'Mighty', 'Swift', 'Gentle', 'Fierce'];
const nouns = ['Dragon', 'Knight', 'Wizard', 'Sorcerer', 'Warrior', 'Archer', 'Thief'];
export const generateRandomUsername = () => {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const random = Math.floor(Math.random() * 100000);
    var randomName = randomAdjective + randomNoun + random;
    return randomName
}