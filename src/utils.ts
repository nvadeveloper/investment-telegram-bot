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

// async function addToDatabase(databaseId: any, username: string) {
//     try {
//         const response = await notion.pages.create({
//             parent: {
//                 database_id: databaseId,
//             },
//             properties: {
//                 id: {
//                     type: 'title',
//                     title: [
//                         {
//                             type: 'text',
//                             text: {
//                                 content: username,
//                             },
//                         },
//                     ],
//                 },
//                 date: {
//                     type: 'rich_text',
//                     rich_text: [
//                         {
//                             type: 'text',
//                             text: {
//                                 content: getCurrentDate(),
//                             },
//                         },
//                     ],
//                 },
//                 // email: {
//                 //     type: 'email',
//                 //     email: 'nik@nik.ru',
//                 //     // type: 'email',
//                 //     // email: [
//                 //     //     {
//                 //     //         type: 'email',
//                 //     //         text: {
//                 //     //             content: getCurrentDate(),
//                 //     //         },
//                 //     //     },
//                 //     // ],
//                 // },
//             },
//         });
//         console.log(response);
//     } catch (error) {
//         console.error(error);
//     }
// }
