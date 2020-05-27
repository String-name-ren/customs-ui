import fetch from 'utils/fetch';

const prefixPath = '/core/system/stock/spoilage/';

export function listSpoilage(obj) {
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

export function update(obj) {
  return fetch({
    url: prefixPath + 'edit',
    method: 'post',
    data: obj
  })
}
