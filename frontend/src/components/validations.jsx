export const isEmail = (username) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(username);
};

export const containsNumber = (inputString) => {
    const regex = /\d/; // The regular expression to match any digit (number)
    return regex.test(inputString);
}

export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result)
        };
        fileReader.onerror = (err) => {
            reject(err);
        }
    })
}


export const convertBase64ToImage = (base64String) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.onerror = (err) => {
            reject(err);
        };
        img.src = base64String;
    });
};

export const isDateValid = (date) => {
    const enteredDate = date;

    const twoDaysAfter = new Date();
    twoDaysAfter.setDate((new Date()).getDate() + 2);
    return enteredDate < twoDaysAfter;
};