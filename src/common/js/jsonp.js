/* eslint-disable */

import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
    let subUrl = param(data).length > 0 ? `?${param(data)}` : ''
    url += subUrl

    return new Promise((resolve, reject) => {
        originJSONP(url, option, (err, data) => {
            if(!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

function param(data) {
    let url = ''
    for(let p in data) {
        let value = data[p] === undefined ? '' : data[p]
        url += `&${p}=${encodeURIComponent(value)}`
    }
    url = url.length > 0 ? url.substring(1) : ''
    return url
}