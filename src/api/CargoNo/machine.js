import fetch from 'utils/fetch';

const prefix = '/check/machine/';





//查询vip信息
export function getCheckMachineList() {
    return fetch({
        url: prefix + 'getCheckMachineList',
        method: 'post',
    });
}
