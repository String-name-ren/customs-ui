import fetch from 'utils/fetch';

const prefix = '/cargoNoManage/';
const prefix1 = '/awbInfo/';





//查询vip信息
export function selectInfoForVip(data) {
    return fetch({
        url: prefix + 'selectInfoForVip',
        method: 'post',
        data
    });
}

//查询vip信息
export function statisticsInfo(data) {
    return fetch({
        url: prefix + 'statisticsInfo',
        method: 'post',
        data
    });
}

//获取vip列表
export function getVipList(data) {
    return fetch({
        url: prefix + 'getVipList',
        method: 'post',
        data
    });
}

//获取载货清单列表
export function getCargoNoList(data) {
    return fetch({
        url: prefix + 'getCargoNoList',
        method: 'post',
        data
    });
}
//更改vip
export function changeVip(data) {
    return fetch({
        url: prefix + 'changeVip',
        method: 'post',
        data
    });
}

//更改安检机
export function changeMachine(data) {
    return fetch({
        url: prefix + 'changeMachine',
        method: 'post',
        data
    });
}

//获取载货清单详情
export function getCargoNoAndAwb(data) {
    return fetch({
        url: prefix + 'getCargoNoAndAwb',
        method: 'post',
        data
    });
}

//根据载货清单获取运单详情
export function getAwbInfoList(cargoNo) {
    return fetch({
        url: prefix1 + 'getAwbInfoList/'+cargoNo,
        method: 'post',
    });
}
export function getCBACount(data) {
    return fetch({
        url: prefix1 + 'getCBACount',
        method: 'post',
        data
    });
}


//审核通过
export function pass(cargoNo) {
    return fetch({
        url: prefix + 'pass/'+cargoNo,
        method: 'post',
    });
}

//审核不通过
export function notPass(cargoNo) {
    return fetch({
        url: prefix + 'notPass/'+cargoNo,
        method: 'post',
    });
}

//销号
export function confirmOver(data) {
    return fetch({
        url: prefix + 'confirmOver',
        method: 'post',
        data
    });
}
//叫号
export function calledNumber(data) {
    return fetch({
        url: prefix + 'calledNumber',
        method: 'post',
        data
    });
}
//删除
export function deleteCargoNo(data) {
    return fetch({
        url: prefix + 'deleteCargoNo',
        method: 'post',
        data
    });
}

//航班
export function getFlightCurrentStatistics(data) {
    return fetch({
        url: prefix + 'getFlightCurrentStatistics',
        method: 'post',
        data
    });
}
//停车场
export function getCurrentStatistics(data) {
    return fetch({
        url: prefix + 'getCurrentStatistics',
        method: 'post',
        data
    });
}
//vip
export function getVipCurrentStatistics(data) {
    return fetch({
        url: prefix + 'getVipCurrentStatistics',
        method: 'post',
        data
    });
}
//p2
export function getP2Statistics(data) {
    return fetch({
        url: prefix + 'getP2Statistics',
        method: 'post',
        data
    });
}

//缓冲区
export function getBufferStatistics(data) {
    return fetch({
        url: prefix + 'getBufferStatistics',
        method: 'post',
        data
    });
}
