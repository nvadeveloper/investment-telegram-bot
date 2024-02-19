export function getCurrentDate() {
    const date = new Date();

    return `${
        date.getMinutes() +
        ':' +
        date.getHours() +
        ' ' +
        date.getDay() +
        '/' +
        date.getMonth() +
        '/' +
        date.getFullYear()
    }`;
}
