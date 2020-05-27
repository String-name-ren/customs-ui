import fetch from 'utils/fetch';

const prefixPath = 'core/user/';

export function getPage(data) {
    return fetch({
        url: prefixPath + 'findPage',
        method: 'post',
        data
    });
}


export function findPage(data) {
    return fetch({
        url: prefixPath + 'feedback/findPage',
        method: 'post',
        data
    });
}
export function exportFeedback(beginTime,endTime) {
    return fetch({
        url: prefixPath + 'feedback/export',
        method: 'post',
        data:{
            beginTime:beginTime,
            endTime:endTime
        }
    });
}
export function exportUser(beginTime,endTime) {
    return fetch({
        url: prefixPath + 'feedback/exportUser',
        method: 'post',
        data:{
            beginTime:beginTime,
            endTime:endTime
        }
    });
}
