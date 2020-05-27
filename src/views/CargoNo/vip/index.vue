<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container" style="text-align: center">
            <el-input style="width: 200px;" class="filter-item" placeholder="请输入载货清单" v-model="listQuery.cargoNo">
            </el-input>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getCargoNoAndAwb">查询</el-button>
        </div>
        <div v-if="showStatus">
            <el-table  :data="listData" style="width: 100%">
                <el-table-column align="center" label="序号" width="100" type="index">
                </el-table-column>
                <el-table-column width="120" align="center" label="载货清单">
                    <template slot-scope="scope">
                        <span>{{scope.row.cargoNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="120" align="center" label="车牌号">
                    <template slot-scope="scope">
                        <span>{{scope.row.truckNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="300" align="center" label="代理">
                    <template slot-scope="scope">
                        <span>{{scope.row.agentName}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="140" align="center" label="手机号">
                    <template slot-scope="scope">
                        <el-input v-model="phone"></el-input>
                    </template>
                </el-table-column>
                <el-table-column width="100" align="center" label="安检机">
                    <template slot-scope="scope">
                        <span>{{scope.row.checkMachine}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="120" align="center" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.approachStatus == 0">不可进场</span>
                        <span v-if="scope.row.approachStatus == 1">可进场</span>
                        <span v-if="scope.row.approachStatus == 2">已进场</span>
                        <span v-if="scope.row.approachStatus == 3">已销号</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="选择VIP等级" width="200">
                    <template slot-scope="scope">
                        <el-select clearable @change="changeVip(scope.row.cargoNo)" style="width: 120px" v-model="vip">
                            <el-option style="color: red" v-for="item in vipOption" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="选择安检机" width="200">
                    <template slot-scope="scope">
                        <el-select clearable @change="changeMachine(scope.row.cargoNo)" style="width: 120px" v-model="machine">
                            <el-option style="color: red" v-for="item in machineOption" :key="item.macCode" :label="item.macCode+'('+item.seqCount+')'" :value="item.macCode"></el-option>
                        </el-select>
                    </template>
                </el-table-column>

            </el-table>
            <br><br>
            <div style="text-align: center">
                <el-table :data="listAwb" ref="myTable" border="" fit="" highlight-current-row="" style="width: 100%">
                    <el-table-column align="center" label="序号" width="200" type="index">
                    </el-table-column>
                    <el-table-column width="200" align="center" label="运单">
                        <template slot-scope="scope">
                            <span>{{scope.row.awbNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="200" align="center" label="件数">
                        <template slot-scope="scope">
                            <span>{{scope.row.rcpNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="200" align="center" label="重量">
                        <template slot-scope="scope">
                            <span>{{scope.row.weight}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="230" align="center" label="航班号">
                        <template slot-scope="scope">
                            <span>{{scope.row.flightNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="230" align="center" label="航班日期">
                        <template slot-scope="scope">
                            <span>{{scope.row.flightDate}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import {getCargoNoAndAwb,changeVip,changeMachine} from 'api/CargoNo/index';
    import {getCheckMachineList} from 'api/CargoNo/machine';
    import {isPoneAvailable} from "utils/util";
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                machineOption:[],
                vipOption:[
                    {key: 0, value: 'VIP0'},
                    {key: 1, value: 'VIP1'},
                    {key: 2, value: 'VIP2'},
                    {key: 3, value: 'VIP3'},
                    {key: 4, value: 'VIP4'},
                ],
                vip:undefined,
                machine:undefined,
                phone:undefined,
                showStatus:false,
                listAwb:[],
                listData:[],
                listQuery:{
                    cargoNo:undefined
                }
            }
        },
        created() {
            this.getCheckMachineList();
        },
        computed: {
            ...mapGetters(["userElements"]),
        },
        methods: {
            getCargoNoAndAwb() {
                getCargoNoAndAwb(this.listQuery).then(response => {
                    if(response.code == 'S0000'){
                        const data = response.data;
                        this.listAwb = data.awbInfoList;
                        this.listData = data.cargoInfoList;
                        if(this.listData.length >0 ){
                            this.vip = this.listData[0].vip;
                            this.machine = this.listData[0].checkMachine;
                            if(this.listData[0].phone){
                                this.phone = this.listData[0].phone;
                            }
                        }
                        this.showStatus = true;
                    }else{
                        this.$message({type: 'warning', message: response.msg});
                        this.showStatus = false;
                    }

                });
            },
            getCheckMachineList() {
                getCheckMachineList().then(response => {
                    if(response.code == 'S0000'){
                        this.machineOption = response.data;
                    }else{
                        this.$message({type: 'warning', message: response.msg});
                    }

                });
            },
            changeVip(cargoNo){
                if(!this.phone){
                    this.$message({type: 'warning', message: "请先输入手机号！"});
                    this.getCargoNoAndAwb();
                    return;
                }
                if(!isPoneAvailable(this.phone)){
                    this.$message({type: 'warning', message: "手机号格式不正确！"});
                    this.getCargoNoAndAwb();
                    return;
                }
                changeVip({"cargoNo":cargoNo,"vip":this.vip,"phone":this.phone}).then(response => {
                    if(response.code == 'S0000'){
                        this.$message({type: 'success', message: response.msg});
                    }else{
                        this.$message({type: 'warning', message: response.msg});
                    }

                });

            },
            changeMachine(cargoNo){
                if(!this.phone){
                    this.$message({type: 'warning', message: "请先输入手机号！"});
                    this.getCargoNoAndAwb();
                    return;
                }
                if(!isPoneAvailable(this.phone)){
                    this.$message({type: 'warning', message: "手机号格式不正确！"});
                    this.getCargoNoAndAwb();
                    return;
                }
                changeMachine({"cargoNo":cargoNo,"checkMachine":this.machine,"phone":this.phone}).then(response => {
                    if(response.code == 'S0000'){
                        this.$message({type: 'success', message: response.msg});
                    }else{
                        this.$message({type: 'warning', message: response.msg});
                    }

                });
            },
        }
    };
</script>


