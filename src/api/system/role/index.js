import fetch from 'utils/fetch';

const prefixPath = '/system/role/';
const prefixPathMerchant = '/system/merchant/';

export function selectAllMenu(params) {
  return fetch({
    url: prefixPath + 'selectAllMenu',
    method: 'get',
    params: params
  })
}

export function selectElementAllMenu(data) {
  return fetch({
    url: prefixPath + 'selectElementAllMenu',
    method: 'post',
    data
  });
}

export function batchCreateLinkedMenu(params) {
  return fetch({
    url: prefixPath + 'batchCreateLinkedMenu',
    method: 'put',
    params: {
      roleId: params.roleId
    },
    data: params.menuIds
  })
}

export function selectMenuElement(params) {
  return fetch({
      url: prefixPath + 'selectMenuElement',
      method: 'get',
      params: params
  })
}

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

export function selectLinkedMenu(params) {
  return fetch({
    url: prefixPath + 'selectLinkedMenu',
    method: 'get',
    params: params
  })
}

export function selectUnlinkMenu(params) {
  return fetch({
    url: prefixPath + 'selectUnlinkMenu',
    method: 'get',
    params: params
  })
}

export function createLinkedMenu(params) {
  return fetch({
    url: prefixPath + 'createLinkedMenu',
    method: 'put',
    params: {
      roleId: params.roleId
    },
    data: params.menuIds
  })
}

export function removeLinkedMenu(params) {
  return fetch({
    url: prefixPath + 'removeLinkedMenu',
    method: 'delete',
    params: {
      roleId: params.roleId
    },
    data: params.menuIds
  })
}

export function selectLinkedElement(params) {
  return fetch({
    url: prefixPath + 'selectLinkedElement',
    method: 'get',
    params: params
  })
}

export function selectUnlinkElement(params) {
  return fetch({
    url: prefixPath + 'selectUnlinkElement',
    method: 'get',
    params: params
  })
}

export function createLinkedElement(params) {
  return fetch({
    url: prefixPath + 'createLinkedElement',
    method: 'put',
    params: {
      roleId: params.roleId,
      menuId: params.menuId
    },
    data: params.elementIds
  })
}

export function removeLinkedElement(params) {
  return fetch({
    url: prefixPath + 'removeLinkedElement',
    method: 'delete',
    params: {
      roleId: params.roleId,
      menuId: params.menuId
    },
    data: params.elementIds
  })
}


export function selectLinkedElementAllMenu(params) {
  return fetch({
    url: prefixPath + 'selectLinkedElementAllMenu',
    method: 'get',
    params: params
  })
}

export function selectUnlinkElementAllMenu(params) {
  return fetch({
    url: prefixPath + 'selectUnlinkElementAllMenu',
    method: 'get',
    params: params
  })
}

export function createLinkedElementAllMenu(params) {
  return fetch({
    url: prefixPath + 'createLinkedElementAllMenu',
    method: 'put',
    params: {
      roleId: params.param.roleId
    },
    data: params.param.elementIds
  })
}

export function removeLinkedElementAllMenu(params) {
  return fetch({
    url: prefixPath + 'removeLinkedElementAllMenu',
    method: 'delete',
    params: {
      roleId: params.param.roleId
    },
    data: params.param.elementIds
  })
}

export function getAllMerchant(data) {
    return fetch({
        url: prefixPathMerchant + 'page',
        method: 'post',
        data
    });
}

export function getAllCheckMerchant(params,selRoleId) {
    return fetch({
        url: prefixPathMerchant + 'getCheckMerchantPage',
        method: 'post',
        data: params,
        params: {
            selRoleId: selRoleId
        }
    });
}

export function createLinkedMerchant(params) {
    return fetch({
        url: prefixPathMerchant + 'createLinkedMerchant',
        method: 'put',
        params: {
            selRoleId: params.selRoleId,
            merchantCode:params.merchantCode
        }
    })
}

export function removeLinkedMerchant(params) {
    return fetch({
        url: prefixPathMerchant + 'removeLinkedMerchant',
        method: 'delete',
        params: {
            selRoleId: params.selRoleId,
            merchantCode:params.merchantCode

        }
    })
}
