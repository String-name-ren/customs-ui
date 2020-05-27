import fetch from 'utils/fetch';

const prefixPath = '/system/element/';

export function page(data) {
  return fetch({
    url: prefixPath + 'page',
    method: 'post',
    data
  });
}

export function list(params) {
  return fetch({
    url: prefixPath + 'list',
    method: 'get',
    params
  });
}

export function create(obj) {
  return fetch({
    url: prefixPath + 'create',
    method: 'post',
    data: obj
  });
}

export function select(id) {
  return fetch({
    url: prefixPath + 'select',
    method: 'get',
    params: { id }
  })
}

export function remove(id) {
  return fetch({
    url: prefixPath + 'remove',
    method: 'delete',
    params: { id }
  })
}

export function update(id, obj) {
  return fetch({
    url: prefixPath + 'update',
    method: 'put',
    params: { id },
    data: obj
  })
}
