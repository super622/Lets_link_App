import axios from "axios";

export const BASE_API_URL = 'http://178.63.104.183:4000/';
export const letsLinkAPI = (url, data, method, header = "", token = "", timeout = 20000) => {
    if (!header) {
        header = {
            "content-Type": "application/json",
        }

        return axios({
            method: method,
            url: BASE_API_URL + url,
            data: data,
            headers: header,
            timeout: timeout,
            responseType: 'json'
        });
    } else {
        return axios({
            method: method,
            url: BASE_API_URL + url,
            data,
            headers: header,
            timeout: timeout,
            responseType: 'json'
        });
    }
};