import fetch from 'utils/fetch';

const prefix = '/park/manage/';

//查询列表
export function getTruckList(data) {
    return fetch({
        url: prefix + 'getTruckList',
        method: 'post',
        data
    });
}

//保存
export function save(data) {
    return fetch({
        url: prefix + 'save',
        method: 'post',
        data
    });
}

//出场
export function out(data) {
    return fetch({
        url: prefix + 'out',
        method: 'post',
        data
    });
}
