/** 
 * 自定义js数组排序 支持数字和字符串
 * @Author: liujiao
 * @Date: 2019/01/02 23:14
 * @param params
 * @param arrObj   obj     必填  数组对象
 * @param keyName  string  必填  要排序的属性名称
 * @param type     int     选填  默认type: ascending 正序  type: descending 反序
 * 实例数据
 * var temp = [
 *    {"name":"zjf","score":50,"age":10},
 *    {"name":"lyy","score":90,"age":5},
 *    {"name":"zzx","score":90,"age":12}
 * ];
 * //根据age排序 正序
 * var temp1 = arrItemSort(temp, "age", 'ascending');
 * console.log(temp1);
 * 多维度排序，先进行年龄的排序，再进行分数的反序：
 * //根据score排序 反序,score相同时根据age排序 反序
 * var temp2 = arrItemSort(arrItemSort(temp, "age", 'descending'), "score", 'descending');
 * console.log(temp2);
 */
exports.arrItemSort = function (arrObj, keyName, type) {
    //这里如果 直接等于arrObj，相当于只是对对象的引用，改变排序会同时影响原有对象的排序，而通过arrObj.slice(0)，
    //表示把对象复制给另一个对象，两者间互不影响 
    var tempArrObj = arrObj.slice(0);
    var compare = function (keyName, type) {
        return function (obj1, obj2) {
            var val1 = obj1[keyName];
            var val2 = obj2[keyName];
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
            }
            //如果值为空的，放在最后       
            if (val1 == null && val2 == null) {
            return 0;
            } else if (val1 == null && val2!= null ) {
                return (type=='descending' ? -1 : 1);
            } else if (val2 == null && val1!= null ) {
                return (type=='descending' ? 1 : -1);
            }            
            //排序
            if (val1 < val2) {
                return (type=='descending' ? 1 : -1);
            } else if (val1 > val2) {
                return (type=='descending' ? -1 : 1);;
            } else {
                return 0;
            }            
        } 
    }
    return tempArrObj.sort(compare(keyName,type));
}