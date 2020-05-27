<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input style="width: 120px" class="filter-item" placeholder="请输入航班号" v-model="listQuery.flightNo"></el-input>
            <el-date-picker  class="filter-item"
                             v-model="listQuery.flightDate"
                             type="datetime"
                             placeholder="选择结束时间"
                             format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </el-date-picker>

            <!-- <el-date-picker  class="filter-item"
                   v-model="listQuery.startTimeStr"
                   type="datetime"
                   placeholder="选择开始时间"
                   format="yyyy-MM-dd HH:00:00" value-format="yyyy-MM-dd HH:00:00">

            </el-date-picker>
            <el-date-picker  class="filter-item"
                             v-model="listQuery.endTimeStr"
                             type="datetime"
                             placeholder="选择结束时间"
                             format="yyyy-MM-dd HH:00:00" value-format="yyyy-MM-dd HH:00:00">
            </el-date-picker>-->
            <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="airDa">查询</el-button>
        </div>

        <div id="air" style="width:700px; height:400px;float:left"></div>
         <div id="airCba" style="width:700px; height:400px;float:right"></div>
        <!--&lt;!&ndash;创建一个echarts的容器&ndash;&gt;-->
  
        <div id="parkD" style="width:700px; height:400px;float:left;margin-top:100px"></div>
        <div id="cba" style="width:700px; height:400px;float:right;margin-top:100px"></div>

        <div id="vip" style="width:700px; height:400px;float:left;margin-top:100px"></div>
        <div id="vipCba" style="width:700px; height:400px;float:right;margin-top:100px"></div>


       <!-- <div id="p2Data" style="width:700px; height:400px;float:left;margin-top:100px"></div>
        <div id="bufferData" style="width:700px; height:400px;float:right;margin-top:100px"></div>-->
        
    </div>
</template>

<script>
    import {getCurrentStatistics,getVipCurrentStatistics,getFlightCurrentStatistics,getP2Statistics,getBufferStatistics} from 'api/CargoNo/index';
    import {mapGetters} from 'vuex';
    // 引入基本模板
    let echarts = require('echarts');


    export default {
        data() {
            return {
                listQuery:{
                    flightNo:undefined,
                    flightDate:undefined, 
                    startTimeStr:undefined,
                    endTimeStr:undefined,
                }
            }
        },
        created(){
            let nowDate = new Date();
            let year = nowDate.getFullYear();
            let month = this.num(nowDate.getMonth() + 1);
            let day = this.num(nowDate.getDate());
            this.listQuery.flightDate = year + '-' + month + '-' + day;

        },
        mounted() {
            this.parkDa();
            this.vipDa();
            this.airDa();
            // this.getP2Data();
            // this.getBufferData();
            // this.initDate();
        },
        computed: {
            ...mapGetters(["userElements"])
        },
        methods: {
            initDate(){
                let currentDate = new Date();
                currentDate.setMinutes(0);
                currentDate.setSeconds(0);
                currentDate.setMilliseconds(0);
                this.listQuery.startTimeStr = this.dateFormat(currentDate,"yyyy-MM-dd hh:mm:ss");
                const date = new Date();
                date.setHours(date.getHours()+1)
                date.setMinutes(0)
                date.setSeconds(0)
                date.setMilliseconds(0)
                this.listQuery.endTimeStr = this.dateFormat(date,"yyyy-MM-dd hh:mm:ss");
                console.log(this.listQuery)
            },
            dateFormat (dateObj, format) {
                let date = {
                    'M+': dateObj.getMonth() + 1,
                    'd+': dateObj.getDate(),
                    'h+': dateObj.getHours(),
                    'm+': dateObj.getMinutes(),
                    's+': dateObj.getSeconds(),
                    'q+': Math.floor((dateObj.getMonth() + 3) / 3),
                    'S+': dateObj.getMilliseconds()
                }
                if (/(y+)/i.test(format)) {
                    format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
                }
                for (let k in date) {
                    if (new RegExp('(' + k + ')').test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length === 1
                            ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
                    }
                }
                return format
            },
            num(s) {
                return s < 10 ? '0' + s: s;
            },
            getData(){
                if(this.listQuery.endTimeStr < this.listQuery.startTimeStr){
                    this.$message({type: 'warning', message: "结束时间不得小于开始时间！"});
                    return false;
                }
                this.getP2Data();
                this.getBufferData();
            },
            getP2Data(){
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('p2Data'));
                getP2Statistics(this.listQuery).then(response => {
                    // 绘制图表
                    myChart.setOption({
                        title: { text: '西区停车场' },
                        tooltip: {},
                        xAxis: {
                            data: ["进场车辆","在场车辆","出厂车辆"]
                        },
                        yAxis: {},
                        series: [{
                            name: '',
                            type: 'bar',
                            data: response.data.barData,
                            itemStyle: {
                                normal: {
                                    //这里是重点
                                    color: function(params) {
                                        var colorList = ['#61a0a8',  '#91c7ae', '#ca8622'];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            },
                            label: {
                                show: true, // 开启显示
                                position: 'top', // 在上方显示
                                distance: 20,
                                verticalAlign: 'middle',
                                textStyle: { // 数值样式
                                    color: 'black',
                                    fontSize: 24
                                }
                            }
                        }]
                    });
                });
            },

            getBufferData(){
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('bufferData'));
                getBufferStatistics(this.listQuery).then(response => {
                    // 绘制图表
                    myChart.setOption({
                        title: { text: '缓冲区' },
                        tooltip: {},
                        xAxis: {
                            data: ["进场车辆","等待安检车辆","出厂车辆"]
                        },
                        yAxis: {},
                        series: [{
                            name: '',
                            type: 'bar',
                            data: response.data.barData,
                            itemStyle: {
                                normal: {
                                    //这里是重点
                                    color: function(params) {
                                        var colorList = ['#61a0a8',  '#91c7ae', '#ca8622'];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            },
                            label: {
                                show: true, // 开启显示
                                position: 'top', // 在上方显示
                                distance: 20,
                                verticalAlign: 'middle',
                                textStyle: { // 数值样式
                                    color: 'black',
                                    fontSize: 24
                                }
                            }
                        }]
                    });
                });
            },


            parkDa(){
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('parkD'));
                var myChart2 = echarts.init(document.getElementById('cba'));
                     getCurrentStatistics().then(response => {
                        // 绘制图表
                        myChart.setOption({
                        
                            title: { text: '停车场实时动态数据' },
                            tooltip: {},
                            xAxis: {
                                data: ["已进场","缓冲区","今日销号"]
                            },
                            yAxis: {},
                            series: [{
                                name: '',
                                type: 'bar',
                                data: response.data.barData,
                                itemStyle: {
                                    normal: {
                        　　　　　　　　//这里是重点
                                        color: function(params) {
                                            var colorList = ['#61a0a8',  '#91c7ae', '#ca8622'];
                                            return colorList[params.dataIndex]
                                        }
                                    }
                                },
                                label: {
                                    show: true, // 开启显示
                                    position: 'top', // 在上方显示
                                    distance: 20, 
                                    verticalAlign: 'middle',
                                    textStyle: { // 数值样式
                                    color: 'black',
                                    fontSize: 24
                                    }
                                }


                            }]
                        });
                         myChart2.setOption({
                                    title: { text: '停车场CBA比对数据' },
                                    tooltip: {},
                                    series: [{
                                        name: '',
                                        type: 'pie',
                                        radius: '55%',
                                        data:response.data.pieData,
                                        itemStyle: {
                                            normal: {
                                　　　　　　　　//这里是重点
                                                color: function(params) {
                                                    var colorList = [ '#A0522D', '#CD5C5C'];
                                                    return colorList[params.dataIndex]
                                                }
                                            }
                                        }





                         }]
                    });
                });
            },
            
            vipDa(){
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('vip'));
                var myChart2 = echarts.init(document.getElementById('vipCba'));
                getVipCurrentStatistics().then(response => {
               // 绘制图表
                myChart.setOption({
                    title: { text: 'VIP实时动态数据' },
                    tooltip: {},
                    xAxis: {
                        data: ["已进场","缓冲区","今日销号"]
                    },
                    yAxis: {},
                    series: [{
                        name: '',
                        type: 'bar',
                        data:response.data.barData,
                        itemStyle: {
                            normal: {
                　　　　　　　　//这里是重点
                                color: function(params) {
                                    var colorList = ['#6B8E23' ,'#778899', '#F4A460'];
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                        ,label: {
                            show: true, // 开启显示
                            position: 'top', // 在上方显示
                            distance: 20, 
                            verticalAlign: 'middle',
                            textStyle: { // 数值样式
                            color: 'black',
                            fontSize: 24
                            }
                        }
                    }]
                });
                myChart2.setOption({
                                    title: { text: 'VIP_CBA比对数据' },
                                    tooltip: {},
                                    roseType: 'angle',
                                    series: [{
                                        name: '',
                                        type: 'pie',
                                        radius: '55%',
                                        data:response.data.pieData,
                                        itemStyle: {
                                            normal: {
                                　　　　　　　　//这里是重点
                                                color: function(params) {
                                                    var colorList = [ '#7B68EE', '#BDB76B'];
                                                    return colorList[params.dataIndex]
                                                }
                                            }
                                        }
                                    }]
                                });


                    
                });
 

            },
            airDa(){
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('air'));
                var myChartCba = echarts.init(document.getElementById('airCba'));
                // 绘制图表
                 getFlightCurrentStatistics(this.listQuery).then(response => {
                   
                    myChart.setOption({
                    title: { text: '航班实时动态数据' },
                    tooltip: {},
                    xAxis: {
                        data: ["已进场","缓冲区","销号"]
                    },
                    yAxis: {},
                    series: [{
                        name: '',
                        type: 'bar',
                        data:  response.data.barData,
                        itemStyle: {
                            normal: {
                　　　　　　　　//这里是重点
                                color: function(params) {
                                    var colorList = ['#BA55D3' ,'#8F4586', '#019858'];
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                        ,label: {
                            show: true, // 开启显示
                            position: 'top', // 在上方显示
                            distance: 20, 
                            verticalAlign: 'middle',
                            textStyle: { // 数值样式
                            color: 'black',
                            fontSize: 24
                            }
                        }
                    }]
                  });
                  //画CBA
                // 绘制图表   response.data.barData
                myChartCba.setOption({
                    title: { text: '航班CBA比对数据' },
                    tooltip: {},
                   
                    series: [{
                        name: '',
                        type: 'pie',
                        radius: '55%',
                        data:response.data.pieData,
                            itemStyle: {
                                normal: {
                    　　　　　　　　//这里是重点
                                    color: function(params) {
                                        var colorList = [ '#48D1CC', '#87CEFA'];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            }
                        }]
                    });

                });
            },
             
           
        }
    };
</script>


