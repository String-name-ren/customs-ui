import fetch from 'utils/fetch';

const prefixProductPath = 'core/app/manager/banner/';

export function findAppBannerPage(data) {
    return fetch({
        url: prefixProductPath + 'findAppBannerPage',
        method: 'post',
        data
    });
}

export function addAppBanner(obj) {
    return fetch({
        url: prefixProductPath + 'addAppBanner',
        method: 'post',
        data: obj
    });
}

export function deleteAppBanner(id) {
    return fetch({
        url: prefixProductPath + 'deleteAppBanner',
        method: 'post',
        params: {
            id
        }
    })
}

export function updateAppBanner(obj) {
    return fetch({
        url: prefixProductPath + 'updateAppBanner',
        method: 'post',
        data: obj
    })
}

export function findAppBannerById(id) {
    return fetch({
        url: prefixProductPath + 'findAppBannerById',
        method: 'post',
        params: {
            id
        }
    })
}





