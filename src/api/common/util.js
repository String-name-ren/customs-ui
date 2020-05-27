/**
 * 如果为空，返回默认值
 * @Date: 2018/12/6 10:38
 * @Author: lan.xiangjian
 * @param val 原值
 * @param defaultVal 默认值
 */
export function ByDefault(val, defaultVal = '-') {
    if(!val || val == null || val === undefined || val.length === 0){
        return defaultVal;
    }
    return val;
}

/**
 * 将数字转换为“9999999.99”格式
 * @Date: 2018/1/16 10:25
 * @Author: lan.xiangjian
 * @param value 数值
 * @param nullVal 数值为空时返回该值，默认为“-”
 */
export function AmtFormatSimple(value, nullVal = '-'){
    if(!value && value !== 0 && value !== false) return nullVal;
    try{
        value = value - 1 + 1;
    } catch (me) {
        return value;
    }
    value = value.toFixed(2)
    return value;
}

/**
 * 将数字转换为“9999999.99”格式
 * @Date: 2018/1/16 10:25
 * @Author: lan.xiangjian
 * @param value 百分比值
 * @param multiplyPercent 是否要乘以100
 * @param nullVal 空值默认值
 */
export function PercentFormatSimple(value, multiplyPercent = true, nullVal = '-'){
    if(!value && value !== 0 && value !== false) return nullVal;
    try{
        value = value - 1 + 1;
    } catch (me) {
        return value;
    }
    if(multiplyPercent){
        value = value * 100;
    }
    value = value.toFixed(2)
    return value + "%";
}

/**
 * 将数字转换为“9,999,999.99”格式
 * @Date: 2018/12/6 10:38
 * @Author: lan.xiangjian
 * @param value 数值
 * @param nullVal 数值为空时返回该值，默认为“-”
 */
export function AmtFormat(value, nullVal = '-'){
    if(!value && value !== 0 && value !== false) return nullVal;
    try{
        value = value - 1 + 1;
    } catch (me) {
        return value;
    }
    value = value.toFixed(2)
    var intPart = Math.trunc(value)// 获取整数部分
    var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
    if(value.toString().startsWith("-") && !intPartFormat.startsWith("-")){
        intPartFormat = "-" + intPartFormat;
    }
    var floatPart = '.00' // 预定义小数部分
    var value2Array = value.split('.')
    //=2表示数据有小数位
    if(value2Array.length === 2) {
        floatPart = value2Array[1].toString() // 拿到小数部分
        if(floatPart.length === 1) { // 补0,实际上用不着
            return intPartFormat + '.' + floatPart + '0'
        } else {
            return intPartFormat + '.' + floatPart
        }
    } else {
        return intPartFormat + floatPart
    }
}

/**
 * 将数字转换为“9,999,999.99%”格式
 * @Date: 2018/12/24 17:19
 * @Author: lan.xiangjian
 * @param value 百分比值
 * @param multiplyPercent 是否要乘以100
 * @param nullVal 空值默认值
 */
export function PercentFormat(value, multiplyPercent = true, nullVal = '-'){
    if(!value && value !== 0 && value !== false) return nullVal;
    try{
        value = value - 1 + 1;
    } catch (me) {
        return value;
    }
    if(multiplyPercent){
        value = value * 100;
    }
    return AmtFormat(value, '0.00') + "%";
}

/**
 * 根据枚举数据列表，返回枚举值
 * @param key
 * @param keyNameList [{key:xxx, name: vvv},{...}]
 * @param defaultValue
 * @returns {string}
 */
export function getOptionValue(key, keyNameList, defaultValue = "-"){
    /*let value = defaultValue;
    for(let idx in keyNameList){
        if(keyNameList[idx].key == key){
            value = keyNameList[idx].name;
            break;
        }
    }
    return value;*/
    return getDataValue(key, keyNameList, "key", "name", defaultValue);
}

export function getDataValue(key, dataList, keyProp = "key", valueProp = "name", defaultValue = "-"){
    let value = defaultValue;
    for(let idx in dataList){
        if(eval("dataList[idx]." + keyProp) == key){
            value = eval("dataList[idx]." + valueProp);
            break;
        }
    }
    return value;
}

/**
 * 判断框架请求业务是否处理成功
 * @param resp
 * @returns {boolean}
 * @constructor
 */
export function CheckResp(resp){
    return resp.code === "S0000";
}
