<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container" style="text-align: center">
            <el-input style="width: 200px;" class="filter-item" placeholder="请输入载货清单" v-model="listQuery.cargoNo">
            </el-input>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getCargoNoList">查询</el-button>
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
            <el-table-column width="200" align="center" label="审核状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.auditStatus == 1">审核中</span>
                    <span v-if="scope.row.auditStatus == 3">不通过</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button  size="small" type="warning" @click="showDialog(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible"  width="1000px">
            <el-table :data="listAwb" ref="myTable" border="" fit="" highlight-current-row="" style="width: 100%">
                <el-table-column align="center" label="序号" width="100" type="index">
                </el-table-column>
                <el-table-column width="120" align="center" label="运单">
                    <template slot-scope="scope">
                        <span>{{scope.row.awbNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="160" align="center" label="航班号">
                    <template slot-scope="scope">
                        <span>{{scope.row.flightNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="160" align="center" label="航班日期">
                    <template slot-scope="scope">
                        <span>{{scope.row.flightDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="160" align="center" label="件数">
                    <template slot-scope="scope">
                        <span>{{scope.row.rcpNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="160" align="center" label="重量">
                    <template slot-scope="scope">
                        <span>{{scope.row.weight}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="120" align="center" label="状态">
                    <template slot-scope="scope">
                        <span><i v-if="scope.row.awbStatus == 0" class="el-icon-circle-close"></i></span>
                        <span><i v-if="scope.row.awbStatus == 1" class="el-icon-success"></i></span>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <br>
            <div style="text-align: center">
                <el-button type="primary" @click="pass">通过</el-button>
                <el-button type="primary" @click="notPass">不通过</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import {getCargoNoList,getAwbInfoList,pass,notPass} from 'api/CargoNo/index';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                cargoNo:undefined,
                listAwb:[],
                dialogVisible:false,
                dialogTitle: '详情',
                total:undefined,
                listData:[],
                listQuery:{
                    pageNo:1,
                    pageSize:10,
                    cargoNo:undefined
                },
                startOrStop:true,
                startNum:0,
                timeOutName:""
            }
        },
        created() {
            this.stOrSt();
            this.getCargoNoList();
        },
        computed: {
            ...mapGetters(["userElements"])
        },
        methods: {
            pass(){
                this.$confirm('确认通过?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    pass(this.cargoNo).then(response => {
                        if(response.code = 'S0000'){
                            this.$message({type: 'success', message: '操作成功!'});
                            this.dialogVisible = false;
                            this.getCargoNoList();
                        }
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '操作取消'});
                });
            },
            notPass(){
                this.$confirm('确认不通过?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    notPass(this.cargoNo).then(response => {
                        if(response.code = 'S0000'){
                            this.$message({type: 'success', message: '操作成功!'});
                            this.dialogVisible = false;
                            this.getCargoNoList();
                        }
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '操作取消'});
                });
            },
            showDialog(row){
                this.dialogVisible = true;
                this.cargoNo = row.cargoNo;
                getAwbInfoList(row.cargoNo).then(response => {
                    this.listAwb = response.data;
                });
            },
            getCargoNoList() {
                console.log(new Date());
                getCargoNoList(this.listQuery).then(response => {
                    const page = response.data;
                    this.listData = page.data;
                    this.total = page.total;
                });
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getCargoNoList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getCargoNoList();
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
                    this.getCargoNoList();
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


