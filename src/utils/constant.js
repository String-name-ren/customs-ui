/**
 * 数据状态
 * @type {*[]}
 */
const DflagEnum = [
    {key: 1, value: "有效"},
    {key: 0, value: "无效"}
];

/**
 * 渠道枚举
 * @type {*[]}
 */
const ChannelEnum = [
    {key: "bof", value: "宝付"},
    {key: "bofLoan", value: "宝付代付"},
    {key: "chj", value: "畅捷"},
    {key: "ebj", value: "益倍嘉"},
    {key: "huc", value: "汇潮"},
    {key: "ali", value: "支付宝"},
    {key: "weChat", value: "微信"},
    {key: "cashFree", value: "cashFree"}


];

/**
 * 交易类型枚举
 * @type {*[]}
 */
const TradeTypeEnum = [
    {key: "0101", value: "微信SDK"},
    {key: "0102", value: "微信公众号"},
    {key: "0103", value: "微信当面付"},
    {key: "0104", value: "微信小程序"},
    {key: "0201", value: "支付宝App"},
    {key: "0202", value: "支付宝wap"},
    {key: "0203", value: "支付宝当面付"},
    {key: "0204", value: "支付宝小程序"},
    {key: "0205", value: "支付宝刷脸付"},
    {key: "0301", value: "银行卡预支付"},
    {key: "0302", value: "银行卡确认支付"},
    {key: "0303", value: "银行卡绑卡付"},
    {key: "0304", value: "银行卡代扣款"},
    {key: "0305", value: "银行卡代付款"}
];

/**
 * 交易类型枚举
 * @type {*[]}
 */
const SimplifyTradeTypeEnum = [
    {key: "0101", value: "微信SDK"},
    {key: "0102", value: "微信公众号"},
    {key: "0103", value: "微信当面付"},
    {key: "0104", value: "微信小程序"},
    {key: "0201", value: "支付宝App"},
    {key: "0202", value: "支付宝wap"},
    {key: "0203", value: "支付宝当面付"},
    {key: "0204", value: "支付宝小程序"},
    {key: "0205", value: "支付宝刷脸付"},
    {key: "0303", value: "银行卡绑卡付"},
    {key: "0304", value: "银行卡代扣款"},
    {key: "0305", value: "银行卡代付款"}
];

/**
 *宝付银行卡类型
 * @type {*[]}
 */
const BofCardTypeEnum = [
    {key: "101", value: "借记卡"},
    {key: "102", value: "信用卡"}
];

/**
 * 宝付证件类型
 * @type {*[]}
 */
const BofICardTypeEnum = [
    {key: "01", value: "身份证"}
];

const BankEnum = [
    {key: "ICBC", value: "工商银行"},
    {key: "ABC", value: "农业银行"},
    {key: "BOC", value: "中国银行"},
    {key: "CCB", value: "建设银行"},
    {key: "CITIC", value: "中信银行"},
    {key: "CEB", value: "光大银行"},
    {key: "HXB", value: "华夏银行"},
    {key: "CMBC", value: "民生银行"},
    {key: "PAB", value: "平安银行"},
    {key: "CMB", value: "招商银行"},
    {key: "CIB", value: "兴业银行"},
    {key: "SPDB", value: "浦发银行"},
    {key: "PSBC", value: "邮政银行"}
];


export default {
    ChannelEnum,
    TradeTypeEnum,
    SimplifyTradeTypeEnum,
    DflagEnum,
    BofCardTypeEnum,
    BofICardTypeEnum,
    BankEnum
}
