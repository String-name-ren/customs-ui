import fetch from 'utils/fetch';

const prefixPath = '/core/system/salesclerk/';

export function listSalesclerk(obj) {
  return fetch({
    url: prefixPath + 'list',
    method: 'post',
    data: obj
  });
}

export function create(obj) {
  return fetch({
    url: prefixPath + 'add',
    method: 'post',
    data: obj
  });
}

export function select(id) {
  return fetch({
    url: prefixPath + 'get/' + id,
    method: 'get'
  })
}

export function remove(id) {
  return fetch({
    url: prefixPath + 'del/' + id,
    method: 'delete'
  })
}

export function update(obj) {
  return fetch({
    url: prefixPath + 'edit',
    method: 'post',
    data: obj
  })
}
