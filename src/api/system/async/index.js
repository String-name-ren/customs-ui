import fetch from 'utils/fetch';

const prefixPath = '/core/sys/async/';

export function page(data) {
    return fetch({
        url: prefixPath + 'page',
        method: 'post',
        data
    });
}

export function update(data) {
    return fetch({
        url: prefixPath + 'update',
        method: 'post',
        data: data
    })
}

export function remove(id) {
    return fetch({
        url: prefixPath + 'delete',
        method: 'post',
        params: { id }
    })
}

export function select(id) {
    return fetch({
        url: prefixPath + 'select',
        method: 'get',
        params: { id }
    })
}

export function getAsyncExecuteCodeList(){
    return fetch({
        url: prefixPath + 'getAsyncExecuteCodeList',
        method: 'get',
        params: {}
    })
}
