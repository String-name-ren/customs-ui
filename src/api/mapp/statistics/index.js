import fetch from 'utils/fetch';

const prefixPath = '/core/app/statistics/';

export function getPage(data) {
    return fetch({
        url: prefixPath + 'getPage',
        method: 'post',
        data
    });
}
