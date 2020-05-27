<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input clearable style="width: 160px" class="filter-item" placeholder="请输入载货清单" v-model="listQuery.cargoNo"></el-input>
            <el-input clearable style="width: 160px;" class="filter-item" placeholder="请输入卡车号" v-model="listQuery.truckNo"></el-input>
            <el-select clearable style="width: 160px" class="filter-item" placeholder="请选择vip等级" v-model="listQuery.vip">
                <el-option style="color: red" v-for="item in vipOption" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-select clearable style="width: 160px" class="filter-item" placeholder="请选择安检机" v-model="listQuery.checkMachine">
                <el-option v-for="item in machineOption" :key="item.macCode" :label="item.macCode" :value="item.macCode"></el-option>
            </el-select>
            <el-select clearable style="width: 160px" class="filter-item" placeholder="请选择状态" v-model="listQuery.approachStatus">
                <el-option v-for="item in approachOption" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-select clearable style="width: 160px" class="filter-item" placeholder="叫号状态" v-model="listQuery.callStatus">
                <el-option v-for="item in callStatusOption" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-checkbox v-model="listQuery.isVip" label="1" class="filter-item" border>VIP</el-checkbox>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getPage">查询</el-button>
        </div>
        <div class="block">
            <el-switch
            v-model="startOrStop"
            active-color="#13ce66"
            inactive-color="#ff4949" @change="stOrSt">
            </el-switch>
             <el-progress :percentage="startNum"   style=" width: 90%;float: left;margin-right: 40px;"  ></el-progress>
        </div>
            
        <el-table :data="listData" style="width: 100%">
            <el-table-column align="center" label="序号" width="100" type="index">
            </el-table-column>
            <el-table-column width="160" align="center" label="载货清单">
                <template slot-scope="scope">
                    <span>{{scope.row.cargoNo}}</span>
                </template>
            </el-table-column>
            <el-table-column width="120" align="center" label="车牌号">
                <template slot-scope="scope">
                    <span>{{scope.row.truckNo}}</span>
                </template>
            </el-table-column>
            <el-table-column width="120" align="center" label="手机号">
                <template slot-scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column width="300" align="center" label="代理">
                <template slot-scope="scope">
                    <span>{{scope.row.agentName}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="安检机">
                <template slot-scope="scope">
                    <span>{{scope.row.checkMachine}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="排队号">
                <template slot-scope="scope">
                    <span>{{scope.row.seqNo}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="vip等级">
                <template slot-scope="scope">
                    <span>{{scope.row.vip}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="状态">
                <template slot-scope="scope">
                    <span>{{getApproachStatus(scope.row.approachStatus)}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="叫号状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.callStatus == 0">未叫号</span>
                    <span v-if="scope.row.callStatus == 1">已叫号</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="进场时间">
                <template slot-scope="scope">
                    <span>{{scope.row.approachTime | dateformat}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="确认安检机时间">
                <template slot-scope="scope">
                    <span>{{scope.row.machineTime | dateformat}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="叫号时间">
                <template slot-scope="scope">
                    <span>{{scope.row.callTime | dateformat}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="销号时间">
                <template slot-scope="scope">
                    <span>{{scope.row.overTime | dateformat}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button v-if="deleteStatus && scope.row.approachStatus == 2" size="small" type="warning" @click="deleteCargoNo(scope.row.cargoNo)">删除</el-button>
                    <el-button v-if="callStatus && scope.row.callStatus == 0 && scope.row.approachStatus == 4 && (scope.row.vip || scope.row.vip==0)" size="small" type="warning" @click="calledNumber(scope.row.cargoNo)">叫号</el-button>
                    <el-button v-if="confirmOverStatus && scope.row.approachStatus > 2 && scope.row.approachStatus != 3" size="small" type="warning" @click="confirmOver(scope.row.cargoNo)">销号</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {getVipList,changeVip,changeMachine,confirmOver,calledNumber,deleteCargoNo} from 'api/CargoNo/index';
    import {getCheckMachineList} from 'api/CargoNo/machine';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                vip:[],
                machine:[],
                machineOption:[],
                vipOption:[
                    {key: 0, value: 'VIP0'},
                    {key: 1, value: 'VIP1'},
                    {key: 2, value: 'VIP2'},
                    {key: 3, value: 'VIP3'},
                    {key: 4, value: 'VIP4'},
                ],
                callStatusOption:[
                    {key: 0, value: '未叫号'},
                    {key: 1, value: '已叫号'},
                ],
                approachOption:[
                    {key: -1, value: '初始状态'},
                    {key: 0, value: '不能进场'},
                    {key: 1, value: '可进场'},
                    {key: 2, value: '已进场'},
                    {key: 4, value: '已分配'},
                    {key: 3, value: '已销号'},
                ],
                cargoNo:undefined,
                listAwb:[],
                dialogVisible:false,
                dialogTitle: '详情',
                total:undefined,
                listData:[],
                listQuery:{
                    pageNo:1,
                    pageSize:10,
                    cargoNo:undefined,
                    truckNo:undefined,
                    vip:undefined,
                    checkMachine:undefined,
                    isVip:true,
                    approachStatus:4,
                    callStatus:0
                },
                callStatus:false,
                confirmOverStatus:false,
                deleteStatus:false,
                startOrStop:true,
                startNum:0,
                timeOutName:""
            }
        },
        created(){
            if (!!this.userElements["security_call"]) {
                this.callStatus = this.userElements["security_call"].status;
            }
            if (!!this.userElements["security_over"]) {
                this.confirmOverStatus = this.userElements["security_over"].status;
            }
            if (!!this.userElements["security_delete"]) {
                this.deleteStatus = this.userElements["security_delete"].status;
            }
            this.getPage();
            this.getCheckMachineList();
            this.stOrSt();
        },
        computed: {
            ...mapGetters(["userElements"])
        },
        methods: {
            deleteCargoNo(cargoNo){
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteCargoNo({"cargoNo":cargoNo}).then(response => {
                        if(response.code == 'S0000'){
                            this.$message({type: 'success', message: '操作成功'});
                            this.getPage();
                        }else{
                            this.$message({type: 'warning', message: response.msg});
                        }

                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '操作取消'});
                });
            },
            calledNumber(cargoNo){
                calledNumber({"cargoNo":cargoNo}).then(response => {
                    if(response.code == 'S0000'){
                        this.$message({type: 'success', message: '操作成功'});
                        this.getPage();
                    }else{
                        this.$message({type: 'warning', message: response.msg});
                    }

                });

            },
            confirmOver(cargoNo){
                confirmOver({"cargoNo":cargoNo}).then(response => {
                    if(response.code == 'S0000'){
                        this.$message({type: 'success', message: '操作成功'});
                        this.getPage();
                    }else{
                        this.$message({type: 'warning', message: response.msg});
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
            getApproachStatus(key){
                let name = key;
                for (let option of this.approachOption) {
                    if (option.key == key) {
                        name = option.value;
                        break;
                    }
                }
                return name;
            },
            changeVip(idx,cargoNo){
                changeVip({"cargoNo":cargoNo,"vip":this.vip[idx]}).then(response => {
                    if(response.code == 'S0000'){
                        this.$message({type: 'success', message: response.msg});
                        this.getPage();
                    }else{
                        this.$message({type: 'warning', message: response.msg});
                    }

                });
            },
            changeMachine(idx,cargoNo){
                changeMachine({"cargoNo":cargoNo,"checkMachine":this.machine[idx]}).then(response => {
                    if(response.code == 'S0000'){
                        this.$message({type: 'success', message: response.msg});
                        this.getPage();
                    }else{
                        this.$message({type: 'warning', message: response.msg});
                    }

                });

            },
            getPage() {
                this.vip= [];
                this.machine=[];
                getVipList(this.listQuery).then(response => {
                    const page = response.data;
                    this.listData = page.data;
                    this.total = page.total;
                });
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getPage();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getPage();
            },
            stOrSt(){
                if(this.startOrStop){
                   this.timeOutName =  setInterval(this.addTimeAndGetPage,1000);
                }else{
                   clearInterval(this.timeOutName);
                    this.startNum = 0;
                }
            },
            addTimeAndGetPage(){
                this.startNum = this.startNum+1;
                if(this.startNum == 100){
                    this.startNum = 0;
                    this.getPage();
                }
                console.log(this.startNum)
            }
        },
        destroyed(){
            this.startOrStop = false;
            this.stOrSt();
        }
        
    };
</script>


