<template>
    <el-dialog :title="exportListTitle" :visible.sync="exportListVisible" top="12vh" width="60%" size="small" style="margin-top: -10vh;" :close-on-click-modal="false">
        <el-table :data="list" :v-loading="listLoading"  border fit highlight-current-row style="width: 100%; margin-top: -4vh;">
            <el-table-column label="ID" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column label="文件申请时间" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.gmtCreated | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="类型" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.code}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="文件任务备注" min-width="100%" header-align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="状态" min-width="100%" header-align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.status|getOptionValue(statusDescOption)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot="header" slot-scope="scope">
                    操作
                    <el-button type="primary" icon="el-icon-refresh" size="small" @click="winReload"></el-button>
                </template>
                <template slot-scope="scope">
                    <el-button type="text" @click="downloadfile(scope.row.attach)" v-if="scope.row.status == 2">下载</el-button>
                    <el-button type="text" @click="renameAsync(scope.row)">修改备注</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="[10,20, 30]" :page-size="listQuery.size"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
    </el-dialog>
</template>
<script>
    import { page, update } from 'api/system/async/index';
    import { CheckResp, getOptionValue } from "api/common/util";

    export default {
        comments: {},
        name: 'exportList',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    size: 10,
                    param: {
                        dflag: 1,
                        type: 2
                    }
                },
                statusDescOption: [
                    {key: undefined, name: ''},
                    {key: 1, name: '正在生成文件，请稍后查看'},
                    {key: 2, name: '文件生成成功'},
                    {key: 3, name: '文件生成异常，请重新导出'}
                ],
                exportListTitle: "下载管理↓",
                exportListVisible: false,
                asyncCodeList:[]
            }
        },
        created() {
            //this.pageInit();
        },
        methods: {
            winReload:function(cond) {
                this.pageInit();
            },
            pageInit() {
                this.list = null;
                this.listQuery.page = 1;
                this.listQuery.size = 10;
                this.getPage();
            },
            downloadfile(url) {
                window.open(url,'top');
            },
            handleStatusChange() {
                this.getPage();
            },
            handleSizeChange(val) {
                this.listQuery.page = 1;
                this.listQuery.size = val;
                this.getPage();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getPage();
            },
            renameAsync(row){
                this.$prompt("<b>任务 ( <span style='color: red'>" + row.id + "</span> ) 当前备注：</b><br/>&nbsp; &nbsp; " + row.name + '&nbsp; <br/><b>请输入新任务备注：</b>', '修改任务备注', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '修改',
                    cancelButtonText: '取消',
                    inputValidator: (value) => {
                        if(value == null || value ==undefined || value.trim().length == 0 || value.trim().length > 60){
                            return false;
                        }
                        return true;
                    },
                    inputErrorMessage: "请输入少于60个字符的任务备注"
                }).then( ({ value }) => {
                    value = value.trim();
                    update({id: row.id, name: value}).then(response => {
                        if(CheckResp(response)) {
                            this.$notify({
                                title: '提示',
                                message: "任务备注修改成功",
                                type: 'success',
                                duration: 2000
                            });
                            this.getPage();
                        } else {
                            this.$notify({
                                title: '异常',
                                message: response.mesg,
                                type: 'error',
                                duration: 2000
                            });
                        }
                    }).catch(() => {
                        this.$notify({
                            title: '异常',
                            message: '任务备注修改失败',
                            type: 'error',
                            duration: 2000
                        });
                    });
                }).catch(() => {
                });
            },
            getPage() {
                this.listLoading = true;
                page(this.listQuery).then(response => {
                    if(CheckResp(response)) {
                        const page = response.data;
                        this.listLoading = false;
                        if (page != null) {
                            this.list = page.datas;
                            this.total = page.total;
                        }
                    } else {
                        this.$notify({
                            title: '异常',
                            message: response.mesg,
                            type: 'error',
                            duration: 2000
                        });
                        this.listLoading = false;
                    }
                }).catch(() => {
                    this.$notify({
                        title: '异常',
                        message: '下载管理列表查询失败',
                        type: 'error',
                        duration: 2000
                    });
                    this.listLoading = false;
                });
            }
        },
        filters: {
            getOptionValue
        }
    }

</script>

