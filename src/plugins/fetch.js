import { getCookie } from './utils';
import qs from 'qs';

export const tfetch = ({ path, type, data}) => {
    if (type === 'get') {
        return fetch(path, {
            method: 'GET',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(res => {
            return res.json();
        });
    } else {

        if (data) {
            data['csrf-token'] = getCookie('token');
        }

        return fetch(path, {
            method: 'Post',
            body: qs.stringify(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-csrf-token': getCookie('token'),
            },
            mode: 'cors',
        }).then(res => {
            return res.json();
        });
    }
};