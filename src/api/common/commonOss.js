import fetch from 'utils/fetch';

const prefixPath = '/core/sys/sts/';

export function getStsToken(code) {
    return fetch({
        url: prefixPath + 'v1/getStsToken',
        method: 'get',
        params: {code}
    });
}
