import fetch from 'utils/fetch';

const prefixPath = '/core/appAnalyse/market/';

export function getPage(data) {
    return fetch({
        url: prefixPath + 'getPage',
        method: 'post',
        data
    });
}
//huoquapp
export function getAppList() {
    return fetch({
        url: prefixPath + 'getAppList',
        method: 'get'
    });
}
