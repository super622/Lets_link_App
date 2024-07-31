import axios from "axios";
import { API_URL } from '@env';

export const letsLinkAPI = (url, data, method, header = "", token = "", timeout = 20000) => {
    if (!header) {
        header = {
            "content-Type": "application/json",
        }

        return axios({
            method: method,
            url: API_URL + url,
            data: data,
            headers: header,
            timeout: timeout,
            responseType: 'json'
        });
    } else {
        return axios({
            method: method,
            url: API_URL + url,
            data,
            headers: header,
            timeout: timeout,
            responseType: 'json'
        });
    }
};