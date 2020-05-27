import fetch from 'utils/fetch';

const prefixPath = '/system/user/';
const prefixPathDept = '/system/dept/';
const prefixPathDic = '/system/dict/';
const prefixPathMerchant = '/sys/merchant/';

export function pageDept(data) {
    return fetch({
        url: prefixPathDept + 'page',
        method: 'post',
        data
    });
}

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
    url: '/core/sys/role/paramList',
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

export function channelPage(data,userId) {
    return fetch({
        url: prefixPath + 'channelPage',
        method: 'post',
        params: {
            userId
        },
        data: data
    });
}

export function channelUpdateState(channelId,state,userId) {
    return fetch({
        url: prefixPath + 'channelUpdateState',
        method: 'post',
        params: {
            channelId : channelId,
            state : state,
            userId:userId
        }
    });
}

export function deptPage(data) {
    return fetch({
        url:  'core/sys/unit/deptPage',
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
        selUid: params.selUid,
        roleId: params.roleId
    }
  })
}

export function removeLinkedRole(params) {
  return fetch({
    url: prefixPath + 'removeLinkedRole',
    method: 'delete',
    params: {
        selUid: params.selUid,
        roleId: params.roleId
    }
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
        url: '/core/sys/supplier/getMallSupplierLiser',
        method: 'post',
        params: {
            'companyName': companyName
        }
    });

}

export function selectUserByType(type) {
    return fetch({
        url: prefixPath + 'selectUserByType?type='+type,
        method: 'get',
    });
}

export function getDicInfo(tag) {
    return fetch({
        url: prefixPathDic + 'selectSysDictByTag',
        method: 'post',
        params: {
            'tag': tag
        }
    });
}

/**
 * 获取所有催收部门
 */
export function getCollectionDeptAll() {
  return fetch({
      url: prefixPathDept + 'findCollectionDeptAll',
      method: 'get',
  });
}

/**
 * 供应商分页查询
 */
export function supplierPage(data) {
    return fetch({
        url: prefixPath + 'getSupplierPage',
        method: 'post',
        data: data
    });
}

/**
 * 用户关联供应商
 */
export function setLinkedSupplier(supplierId,userId,isRemove) {
    return fetch({
        url: prefixPath + 'setLinkedSupplier',
        method: 'post',
        params: {
            supplierId : supplierId,
            userId:userId,
            isRemove:isRemove
        }
    });
}

/**
 * 用户关联商户
 */
export function setLinkedMerchant(merchantCode,userId,isRemove) {
    return fetch({
        url: prefixPath + 'setLinkedMerchant',
        method: 'post',
        params: {
            merchantCode : merchantCode,
            userId:userId,
            isRemove:isRemove
        }
    });
}

export function getUserCheckMerchantPage(params,userId) {
    return fetch({
        url: prefixPathMerchant + 'getUserCheckMerchantPage',
        method: 'post',
        data: params,
        params: {
            userId: userId
        }
    });
}

export function pageCheckUser(params,merchantCode,userId) {
    return fetch({
        url: prefixPath + 'pageCheckUser',
        method: 'post',
        data: params,
        params: {
            merchantCode: merchantCode,
            userId:userId
        }
    });
}

export function createDeptLinkedUser(params) {
    return fetch({
        url: prefixPath + 'createDeptLinkedUser',
        method: 'put',
        params: {
            deptId: params.deptId,
            userId: params.userId,
            merchantCode: params.merchantCode
        }
    })
}

export function removeDeptLinkedUser(params) {
    return fetch({
        url: prefixPath + 'removeDeptLinkedUser',
        method: 'delete',
        params: {
            deptId: params.deptId,
            userId: params.userId,
            merchantCode: params.merchantCode
        }
    })
}

export function pageCheckAllDeptUser(params,merchantCode,deptId) {
    return fetch({
        url: prefixPath + 'pageCheckAllDeptUser',
        method: 'post',
        data: params,
        params: {
            merchantCode: merchantCode,
            deptId:deptId
        }
    });
}

