import fetch from 'utils/fetch';

const prefixPath = '/loan/credit/system/creditWayProductLink/';

export function selectAllProduct() {
    return fetch({
        url: prefixPath + 'findAllProduct',
        method: 'get'
    })
}

// 禁用
export function disabled(id) {
    return fetch({
        url: prefixPath + 'disabled',
        method: 'put',
        params: {
            id
        }
    })
}

// 启用
export function enabled(id) {
    return fetch({
        url: prefixPath + 'enabled',
        method: 'put',
        params: {
            id
        }
    })
}

export function page(data) {
  return fetch({
    url: prefixPath + 'page',
    method: 'post',
    data
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
    params: {
      id
    }
  })
}

export function remove(id) {
  return fetch({
    url: prefixPath + 'remove',
    method: 'delete',
    params: {
      id
    }
  })
}



export function update(id, obj) {
  return fetch({
    url: prefixPath + 'update',
    method: 'put',
    params: {
      id
    },
    data: obj
  })
}
