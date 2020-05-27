import fetch from 'utils/fetch';

const prefixPath = '/system/user/';
const prefixPathShop = '/system/shop/';

export function page(data) {
  return fetch({
    url: prefixPath + 'page',
    method: 'post',
    data
  });
}

export function listSearch(data) {
  return fetch({
    url: prefixPath + 'listSearch',
    method: 'post',
    data
  });
}

export function pages(data) {
  return fetch({
    url: prefixPath + 'pages',
    method: 'post',
    data
  });
}

export function parRolePage(data) {
  return fetch({
    url: '/core/system/role/paramList',
    method: 'post',
    data
  });
}

export function rolePage(data) {
  return fetch({
    url: prefixPath + 'rolePage',
    method: 'post',
    data
  });
}

export function deptPage(data) {
    return fetch({
        url:  '/system/unit/deptPage',
        method: 'post',
        data
    });
}

export function userDeptLink(data) {
    return fetch({
        url: prefixPath + 'setUserDeptLink',
        method: 'get',
        params: {
            selUid : data.selUid,
            deptId : data.deptId
        }
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
export function sync() {
  return fetch({
    url: prefixPath + 'sync',
    method: 'post'
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

// export function selectLinkedRole(params) {
//   return fetch({
//     url: prefixPath + 'selectLinkedRole',
//     method: 'get',
//     params: params
//   })
// }

// export function selectUnlinkRole(params) {
//   return fetch({
//     url: prefixPath + 'selectUnlinkRole',
//     method: 'get',
//     params: params
//   })
// }

export function createLinkedRole(params) {
  return fetch({
    url: prefixPath + 'createLinkedRole',
    method: 'put',
    params: {
      selUid: params.selUid
    },
    data: params.roleIds
  })
}

export function removeLinkedRole(params) {
  return fetch({
    url: prefixPath + 'removeLinkedRole',
    method: 'delete',
    params: {
      selUid: params.selUid
    },
    data: params.roleIds
  })
}

export function listBindedUserByClientId(clientId) {
  return fetch({
    url: prefixPath + 'listBindedUserByClientId',
    method: 'get',
    params: { clientId }
  })
}

export function saveAndRemoveList(list) {
  return fetch({
    url: prefixPath + 'saveAndRemoveList',
    method: 'post',
    data: list
  })
}
export function save(obj) {
  return fetch({
    url: prefixPath + 'save',
    method: 'post',
    data: obj
  });
}

export function listEmployeeCode(employeeCode) {
    return fetch({
        url: prefixPath + 'listEmployeeCode',
        method: 'post',
        params: {
            'employeeCode': employeeCode
        }
    });
}

export function listShopCode(companyName){
    return fetch({
        url: '/system/supplier/getMallSupplierLiser',
        method: 'post',
        params: {
            'companyName': companyName
        }
    });

}

