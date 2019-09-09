import { getCookie } from './utils';

export const tfetch = ({ path, type, data}) => {
    if (type === 'get') {
        return fetch(path, {
            method: 'GET',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            return res.json();
        });
    } else {
        return fetch(path, {
            method: 'Post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': getCookie('token'),
            },
            mode: 'cors',
        }).then(res => {
            return res.json();
        })
    }
}