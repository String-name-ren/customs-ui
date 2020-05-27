<template>
    <el-dialog :title="this.titleName" :visible.sync="visible" size="small" center customClass="customWidth" :close-on-click-modal="false">
        <div class="filter-container">
            <el-form ref="pageBoForm" :inline="true" :model="listObjectQuery.param" class="demo-form-inline">
                <el-button v-if="system_dictionary_next_btn_add_status" @click="handleAdd" type="primary" icon="el-icon-edit">{{system_dictionary_next_btn_add_name}}</el-button>
            </el-form>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border="" fit="" highlight-current-row="" style="width: 100%">
            <el-table-column align="center" label="数据字典id" style="width: 20%">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="数据字典父id" style="width: 20%">
                <template slot-scope="scope">
                    <span>{{scope.row.parentId}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="数据字典编码" style="width: 20%">
                <template slot-scope="scope">
                    <span>{{scope.row.tag}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="数据字典名称" style="width: 20%">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="数据字典状态" style="width: 50%">
                <template slot-scope="scope">
                    <span>{{getDictionaryOptions(scope.row.status)}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="数据字典说明" style="width: 50%">
                <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" style="width: 10%">
                <template slot-scope="scope">
                    <el-button v-if="system_dictionary_next_btn_edit_status" size="small" type="success" @click="handleEdt(scope.row,scope.$index)">
                        {{system_dictionary_next_btn_edit_name}}
                    </el-button>
                    <el-button v-if="system_dictionary_next_btn_delete_status" size="small" type="success" @click="handleDel(scope.row)">
                        {{system_dictionary_next_btn_delete_name}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <approveflow-next :visible="showAddNext" ref="approveflowNext" @changeNext="changeDataNext"></approveflow-next>

    </el-dialog>
</template>

<script>
    import {
        page,remove,create,selectSysDeptById,update
    } from "api/system/dictionary/index";
    import { mapGetters } from "vuex";
    export default{
        components: {
            'approveflow-next': () => import('./dialog'),
        },
        data() {
            return {
                addcommit:false,
                updatecommit:false,
                listLoading:false,
                list:null,
                showAddNext:false,
                titleName: "添加数据字典",
                listObjectQuery: {
                    page: 1,
                    size: 10,
                    param: {
                        parentId:undefined
                    }
                },
                // item: {
                //     id:undefined,
                //     tag:undefined,
                //     name:undefined,
                //     status:undefined,
                //     remark:undefined,
                //     parentId:undefined,
                // },
                dictionaryOptions: [
                    {key: '0', name: '无效'},
                    {key: '1', name: '有效'}
                ],
                visible: false,
                system_dictionary_next_btn_add_status:false,
                system_dictionary_next_btn_add_name:"添加数据字典",
                system_dictionary_next_btn_edit_status:false,
                system_dictionary_next_btn_edit_name:"编辑",
                system_dictionary_next_btn_delete_status:false,
                system_dictionary_next_btn_delete_name:"删除",
                rules: {
                    tag: [
                        {
                            required: true,
                            message: '请输入数据字典编码',
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: '请输入数据字典名称',
                            trigger: 'blur'
                        }
                    ],
                    status: [
                        {
                            required: true,
                            message: '请选择数据字典状态',
                            trigger: 'blur'
                        }
                    ],
                    remark: [
                        {
                            required: true,
                            message: '请输入数据字典说明',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        created(){
            if(!!this.userElements['org_dictionary_next:btn_add']){
                this.system_dictionary_next_btn_add_status = this.userElements['org_dictionary_next:btn_add'].status;
                this.system_dictionary_next_btn_add_name = this.userElements['org_dictionary_next:btn_add'].name ? this.userElements['org_dictionary_next:btn_add'].name : "添加数据字典";
            }
            if(!!this.userElements['org_dictionary_next:btn_edit']){
                this.system_dictionary_next_btn_edit_status = this.userElements['org_dictionary_next:btn_edit'].status;
                this.system_dictionary_next_btn_edit_name = this.userElements['org_dictionary_next:btn_edit'].name ? this.userElements['org_dictionary_next:btn_edit'].name : "编辑";
            }
            if(!!this.userElements['org_dictionary_next:btn_delete']){
                this.system_dictionary_next_btn_delete_status = this.userElements['org_dictionary_next:btn_delete'].status;
                this.system_dictionary_next_btn_delete_name = this.userElements['org_dictionary_next:btn_delete'].name ? this.userElements['org_dictionary_next:btn_delete'].name : "删除";
            }
        },
        computed: {
            ...mapGetters(["userElements"])
        },
        methods: {
            changeDataNext(parentId) {
                this.getPageNextRefresh1(parentId);
            },
            getPageNextRefresh() {
                this.listLoading = true;
                page(this.listObjectQuery).then(response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const page = response.data;
                    this.list = page.datas;
                    this.listLoading = false;
                });
            },
            getPageNext(row) {
                this.listLoading = true;
                this.listObjectQuery.param.parentId=row.id;
                page(this.listObjectQuery).then(response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const page = response.data;
                    this.list = page.datas;
                    this.listLoading = false;
                });
            },
            getPageNextRefresh1(parentId) {
                this.listLoading = true;
                this.listObjectQuery.param.parentId=parentId;
                page(this.listObjectQuery).then(response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const page = response.data;
                    this.list = page.datas;
                    this.listLoading = false;
                });
            },
            getDictionaryOptions(type){
                let name=type;
                for(let option of this.dictionaryOptions){
                    if(option.key==type){
                        name=option.name;
                        break;
                    }
                }
                return name;
            },
            resetTemp() {
                // this.item ={
                //     id:undefined,
                //     tag:undefined,
                //     name:undefined,
                //     status:undefined,
                //     remark:undefined,
                //     parentId:undefined,
                // };
                this.getPageNext();
            },
            getSysDeptById(id){
                this.item.id=id;
                selectSysDeptById(this.item.id).then(response => {
                        const code = response.code;
                        const mesg = response.msg;
                        const data = response.data;
                        this.item=data;
                    }
                )
            },
            back(){
                this.visible = false;
                this.resetTemp();
            },
            handleAdd(){
                this.$refs.approveflowNext.item.parentId=this.listObjectQuery.param.parentId;
                this.$refs.approveflowNext.visible = true;
                this.$refs.approveflowNext.addcommitnext = true;
                this.$refs.approveflowNext.system_dictionary_btn_addcommitnext_status = true;
            },
            handleEdt(row,index) {
                this.$refs.approveflowNext.visible = true;
                this.$refs.approveflowNext.nextcommit = true;
                this.$refs.approveflowNext.system_dictionary_btn_nextcommit_status = true;
                this.$refs.approveflowNext.item=this.list[index];
                this.$refs.approveflowNext.item.status=this.list[index].status.toString();
            },
            handleDel(row) {
                this.listObjectQuery.param.parentId=row.parentId;
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    remove(row.id).then(() => {
                        this.$notify({
                            title: "成功",
                            message: "删除成功",
                            type: "success",
                            duration: 2000
                        });
                        // const index = this.list.indexOf(row);
                        // this.list.splice(index, 1);
                        this.getPageNextRefresh1(this.listObjectQuery.param.parentId);
                    });
                });
            }
        }
    };
</script>

<style scoped>
    .customWidth {
        width: 60%;
        height: 80%;
    }
</style>
