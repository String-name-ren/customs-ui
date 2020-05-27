/**
 * 新零售工具类公用JS
 *
 * @author: liujiao
 * date: 2019/01/11 11:14
 */


/**
 * 格式化金额，自动补全小数点后的位数
 * @author: liujiao
 * date: 2019/01/11 11:14
 * s : 金额
 * n : 保留位数
*/
exports.formatMoney = function (s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n);
    let l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for(i = 0; i < l.length; i ++ )
    {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}

/**
 * 取消格式化金额方法
 *
 * @author: liujiao
 * date: 2019/01/11 11:14
 *
 * @param money
 * @returns {number}
 */
exports.rmoney = function (money) {
    return parseFloat(money.replace(/[^\d\.-]/g, ""));
}
