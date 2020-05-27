import fetch from 'utils/fetch';

const prefixPath = '/system/dictionary/';

export function page(data) {
  return fetch({
    url: prefixPath + 'page',
    method: 'post',
    data
  });
}

export function remove(id) {
    return fetch({
        url: prefixPath + 'delect',
        method: 'post',
        params: {
            id
        }
    });
}

export function create(data) {
    return fetch({
        url: prefixPath + 'create',
        method: 'post',
        data
    });
}

export function update(data) {
    return fetch({
        url: prefixPath + 'update',
        method: 'post',
        data
    });
}

export function selectSysDeptById(id) {
    return fetch({
        url: prefixPath + 'selectSysDeptById',
        method: 'post',
        params: {
            id
        }
    });
}
