import { getCookie } from './utils';
import qs from 'qs';

export const tfetch = ({ path, type, data}) => {
    if (type === 'get') {
        return fetch(path, {
            method: 'GET',
            // mode: 'no-cors',
        }).then(res => {
            return res.json();
        });
    } else {

        data = data || {};
        data['csrf_token'] = getCookie('token');

        return fetch(path, {
            method: 'Post',
            body: qs.stringify(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            mode: 'cors',
        }).then(res => {
            return res.json();
        });
    }
};