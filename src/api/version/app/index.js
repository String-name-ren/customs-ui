import fetch from 'utils/fetch';

const prefixProductPath = 'core/app/manager/version/';

export function create(obj) {
    return fetch({
        url: prefixProductPath + 'addCoreAppVersion',
        method: 'post',
        data: obj
    });
}

export function update(obj) {
    return fetch({
        url: prefixProductPath + 'updateVersionStatus',
        method: 'post',
        data: obj
    })
}

export function getAllMerchant(data) {
    return fetch({
        url: prefixProductPath + 'page',
        method: 'post',
        data
    });
}





