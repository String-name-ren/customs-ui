<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input clearable style="width: 200px;" class="filter-item" placeholder="车牌号" v-model="listQuery.truckNo"></el-input>
            <el-input clearable style="width: 200px;" class="filter-item" placeholder="电话" v-model="listQuery.phone"></el-input>
            <el-select clearable style="width: 150px;" class="filter-item" v-model="listQuery.status" placeholder="请选择进场状态" >
                <el-option v-for="item in statusOption" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getPage">搜索</el-button>
            <el-button v-if="addStatus" class="filter-item"  @click="handleAdd" type="primary" icon="el-icon-edit">新增</el-button>
        </div>
        <el-table :data="dataList"  style="width: 100%">
            <el-table-column align="center" label="序号" width="110" type="index">
            </el-table-column>
            <el-table-column width="160" align="center" label="车牌号">
                <template slot-scope="scope">
                    <span>{{scope.row.truckNo}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="手机号">
                <template slot-scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="代理">
                <template slot-scope="scope">
                    <span>{{scope.row.agentName}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="排队号">
                <template slot-scope="scope">
                    <span>{{scope.row.seqNo}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="vip">
                <template slot-scope="scope">
                    <span>{{scope.row.vip}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="安检机">
                <template slot-scope="scope">
                    <span>{{scope.row.checkMachine}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="是否加急">
                <template slot-scope="scope">
                    <span v-if="scope.row.urgent == 0">否</span>
                    <span v-if="scope.row.urgent == 1">是</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">已进场</span>
                    <span v-if="scope.row.status == 1">已出场</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="进场时间">
                <template slot-scope="scope">
                    <span>{{scope.row.inTime | dateformat}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="出场时间">
                <template slot-scope="scope">
                    <span>{{scope.row.outTime | dateformat}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="备注">
                <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button v-if="outStatus && scope.row.status == 0" size="small" type="warning" @click="out(scope.row.id)">出场</el-button>
                    <el-button  size="small" type="primary" @click="updateItem(scope.row)">修改</el-button>
                </template>
                
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>


        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="车牌号：" prop="truckNo">
                    <el-input v-model="form.truckNo" placeholder="请输入车牌号"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="代理：" prop="phagentNameone">
                    <el-input v-model="form.agentName" placeholder="请输入代理"></el-input>
                </el-form-item>
                <el-form-item label="排队号：" prop="seqNo">
                    <el-input v-model="form.seqNo" placeholder="请输入排队号"></el-input>
                </el-form-item>
                <el-form-item label="vip：" prop="vip">
                    <el-input v-model="form.vip" placeholder="请输入vip"></el-input>
                </el-form-item>
                <el-form-item label="安检机：" prop="checkMachine">
                    <el-input v-model="form.checkMachine" placeholder="请输入安检机"></el-input>
                </el-form-item>
                <el-form-item label="是否加急：" prop="urgent">
                    <el-select v-model="form.urgent" placeholder="请选择是否加急" >
                        <el-option v-for="item in urgentOption" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入备注" v-model="form.remark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="align-items: center">
                <el-button @click="handleCancel('form')">取 消</el-button>
                <el-button type="primary" @click="save('form')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getTruckList,save,out} from 'api/parkManage/index';
    export default {
        data() {
            return {
                title:"新增",
                dialogFormVisible:false,
                total:undefined,
                dataList:[],
                addStatus:false,
                outStatus:false,
                listQuery:{
                    truckNo:undefined,
                    phone:undefined,
                    pageNo:1,
                    pageSize:10
                },
                form:{
                    truckNo:undefined,
                    seqNo:undefined,
                    vip:undefined,
                    agentName:undefined,
                    phone:undefined,
                    urgent:0,
                    checkMachine:undefined,
                    remark:undefined,
                },
                urgentOption:[
                    {key: 0, value: '否'},
                    {key: 1, value: '是'},
                ],
                statusOption:[
                    {key: 0, value: '已进场'},
                    {key: 1, value: '已出场'},
                ],
                rules: {
                    truckNo: [
                        {
                            required: true,
                            message: "请输入车牌号",
                            trigger: "blur"
                        },
                        {
                            min: 3,
                            max: 32,
                            message: "长度在3到32个字符",
                            trigger: "blur"
                        }
                    ],
                    phone: [
                        {
                            required: true,
                            message: "请输入电话号码",
                            trigger: "blur"
                        },
                        {
                            min: 4,
                            max: 16,
                            message: "长度在4到16个字符",
                            trigger: "blur"
                        }
                    ],
                    vip: [
                        {
                            required: false,
                            message: "请输入VIP",
                            trigger: "blur"
                        },
                        {
                            min: 1,
                            max: 1,
                            message: "长度1个字符",
                            trigger: "blur"
                        }
                    ],
                    checkMachine: [
                        {
                            required: false,
                            message: "请输入安检机",
                            trigger: "blur"
                        },
                        {
                            min: 1,
                            max: 2,
                            message: "长度在1到2个字符",
                            trigger: "blur"
                        }
                    ]
                },
            }
        },
        created(){
            if (!!this.userElements["truckList-add"]) {
                this.addStatus = this.userElements["truckList-add"].status;
            }
            if (!!this.userElements["truckList-out"]) {
                this.outStatus = this.userElements["truckList-out"].status;
            }
            this.getPage();
        },
        computed: {
            ...mapGetters(["userElements"])
        },
        methods: {
            getPage() {
                getTruckList(this.listQuery).then(response => {
                    if(response.code == 'S0000'){
                        let page = response.data;
                        this.dataList = page.data;
                        this.total = page.total;
                    }else{
                        this.$message({type: 'warning', message: response.msg});
                    }

                });

            },
            handleAdd(){
                this.title = '新增';
                this.resetForm();
                this.dialogFormVisible = true;
            },
            handleCancel(formName) {
                this.dialogFormVisible = false;
                this.resetForm();
            },
            save(formName){
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        save(this.form).then(response => {
                            if (response.code == 'S0000') {
                                this.$message({type: 'success', message: '操作成功！'});
                                this.dialogFormVisible = false;
                                this.getPage();
                            } else {
                                this.$message({type: 'warning', message: response.msg});
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            updateItem(item){
                this.resetFormEdit(item);
                this.dialogFormVisible = true;
                this.title = '修改';
            },
             resetFormEdit(item) {
                this.form = item;
            },
            out(id){
                this.$confirm('确认出场?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    out({"id":id}).then(response => {
                        if (response.code == 'S0000') {
                            this.$message({type: 'success', message: '操作成功！'});
                            this.getPage();
                        } else {
                            this.$message({type: 'warning', message: response.msg});
                        }
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '操作取消'});
                });
            },
            resetForm() {
                this.form = {
                    truckNo:undefined,
                    seqNo:undefined,
                    vip:undefined,
                    agentName:undefined,
                    phone:undefined,
                    urgent:0,
                    checkMachine:undefined,
                    remark:undefined,
                };
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getPage();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getPage();
            },

        }
    };
</script>


