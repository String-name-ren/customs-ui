import fetch from 'utils/fetch';

export function categroupLst(params) {
    return fetch({
        url: '/system/categroup/lst/page',
        method: 'get',
        params: params
    });
}
