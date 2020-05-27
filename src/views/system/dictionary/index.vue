<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-form ref="pageBoForm" :inline="true" :model="listObjectQuery.param" class="demo-form-inline">
                <el-button v-if="system_dictionary_btn_add_status"  @click="handleAdd" type="primary" icon="el-icon-edit">{{system_dictionary_btn_add_name}}</el-button>
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
                    <el-button v-if="system_dictionary_btn_edit_status" size="small" type="success" @click="handleEdt(scope.row,scope.$index)">
                        {{system_dictionary_btn_edit_name}}
                    </el-button>
                    <el-button v-if="system_dictionary_btn_delete_status" size="small" type="success" @click="handleDel(scope.row)">
                        {{system_dictionary_btn_delete_name}}
                    </el-button>
                    <el-button v-if="system_dictionary_btn_append_status" size="small" type="success" @click="handleAddNext(scope.row)">
                        {{system_dictionary_btn_append_name}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listUserQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listUserQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="totalUser">
            </el-pagination>
        </div>
        <approveflow-addnext :visible="showAddNext" ref="approveflowAddNext"></approveflow-addnext>
        <approveflow-add :visible="showAdd" ref="approveflowAdd" @changeClick="changeData"></approveflow-add>
    </div>
</template>
  <script>
import {
    page,remove
} from "api/system/dictionary/index";
import { mapGetters } from "vuex";
export default {
    components: {
        'approveflow-addnext': () => import('./add/addnext'),
        'approveflow-add': () => import('./add/dialog')
    },
    name: "dictionary",
    data() {
        return {
            form: {
            },
            listObjectQuery: {
                page: 1,
                size: 10,
                param: {
                    parentId:undefined
                }
            },
            dictionaryOptions: [
                {key: '0', name: '无效'},
                {key: '1', name: '有效'}
            ],
            listLoading:false,
            list:null,
            totalUser:null,
            listUserQuery: {
                page: 1,
                size: 10,
                param: {
                }
            },
            showAdd:false,
            showAddNext:false,
            system_dictionary_btn_add_status:false,
            system_dictionary_btn_add_name:"添加数据字典",
            system_dictionary_btn_edit_status:false,
            system_dictionary_btn_edit_name:"编辑",
            system_dictionary_btn_delete_status:false,
            system_dictionary_btn_delete_name:"删除",
            system_dictionary_btn_append_status:false,
            system_dictionary_btn_append_name:"查看",
            rules: {

            }
        };
    },
    created() {
        if(!!this.userElements['org_dictionary:btn_add']){
            this.system_dictionary_btn_add_status = this.userElements['org_dictionary:btn_add'].status;
            this.system_dictionary_btn_add_name = this.userElements['org_dictionary:btn_add'].name ? this.userElements['org_dictionary:btn_add'].name : "添加数据字典";
        }
        if(!!this.userElements['org_dictionary:btn_edit']){
            this.system_dictionary_btn_edit_status = this.userElements['org_dictionary:btn_edit'].status;
            this.system_dictionary_btn_edit_name = this.userElements['org_dictionary:btn_edit'].name ? this.userElements['org_dictionary:btn_edit'].name : "编辑";
        }
        if(!!this.userElements['org_dictionary:btn_delete']){
            this.system_dictionary_btn_delete_status = this.userElements['org_dictionary:btn_delete'].status;
            this.system_dictionary_btn_delete_name = this.userElements['org_dictionary:btn_delete'].name ? this.userElements['org_dictionary:btn_delete'].name : "删除";
        }
        if(!!this.userElements['org_dictionary:btn_append']){
            this.system_dictionary_btn_append_status = this.userElements['org_dictionary:btn_append'].status;
            this.system_dictionary_btn_append_name = this.userElements['org_dictionary:btn_append'].name ? this.userElements['org_dictionary:btn_append'].name : "查看";
        }
        this.getPage();
    },
    computed: {
        ...mapGetters(["userElements"])
    },
    methods: {
        changeData() {
            this.getPage()
        },
        getPage() {
            this.listLoading = true;
            this.listObjectQuery.param.parentId=0;
            page(this.listObjectQuery).then(response => {
                const code = response.code;
                const mesg = response.msg;
                const page = response.data;
                this.list = page.datas;
                this.totalUser = page.total;
                this.listLoading = false;
            });
        },
        handleAddNext(row){
            this.$refs.approveflowAddNext.visible = true;
            this.$refs.approveflowAddNext.getPageNext(row);
        },
        handleEdt(row,index) {
            this.$refs.approveflowAdd.visible = true;
            this.$refs.approveflowAdd.updatecommit = true;
            this.$refs.approveflowAdd.system_dictionary_btn_updatecommit_status = true;
            //this.$refs.approveflowAdd.getSysDeptById(row.id);
            this.$refs.approveflowAdd.item=this.list[index];
            this.$refs.approveflowAdd.item.status=this.list[index].status.toString();
        },
        handleDel(row) {
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
                    this.getPage();
                });
            });
        },
        handleSizeChange(val) {
            this.listUserQuery.size = val;
            this.getPage();
        },
        handleCurrentChange(val) {
            this.listUserQuery.page = val;
            this.getPage();
        },
        handleAdd(){
            this.$refs.approveflowAdd.visible = true;
            this.$refs.approveflowAdd.addcommit = true;
            this.$refs.approveflowAdd.parentId = 0;
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
    }
};
</script>
