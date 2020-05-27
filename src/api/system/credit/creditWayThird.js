import fetch from 'utils/fetch';

const prefixPath = '/loan/credit/system/creditWayThirdLink/';


export function queryCreditWayByThirdId(thirdId, terminalType) {
    return fetch({
        url: prefixPath + 'queryCreditWayByThirdId',
        method: 'get',
        params: {
            thirdId,
            terminalType
        }
    })
}
export function queryCreditThirdByWayId(wayId) {
    return fetch({
        url: prefixPath + 'queryCreditThirdByWayId',
        method: 'get',
        params: {
            wayId
        }
    })
}

export function getLinkedCreditThirds(wayId, terminalType) {
    return fetch({
        url: prefixPath + 'getLinkedCreditThirds',
        method: 'get',
        params: {
            wayId,
            terminalType
        }
    })
}
export function getLinkedCreditWays(terminalType) {
    return fetch({
        url: prefixPath + 'getLinkedCreditWays',
        method: 'get',
        params: {
            terminalType
        }
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
