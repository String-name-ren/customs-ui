<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" v-if="sys_loan_btn_create_status" style="margin-left: 10px;"
                       @click="handleAdd" type="primary" icon="el-icon-edit">
                {{sys_loan_btn_create_name}}
            </el-button>
        </div>
        <el-table :data="listLoan" v-loading.body="listUserLoading" ref="myTable" border="">
            <el-table-column align="center" label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="位置">
                <template slot-scope="scope">
                    <span>{{getTypeOption(scope.row.position)}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200" align="center" label="标题">
                <template slot-scope="scope">
                    <span>{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200" align="center" label="内容描述">
                <template slot-scope="scope">
                    <span>{{scope.row.describes}}</span>
                </template>
            </el-table-column>
            <el-table-column width="400" align="center" label="图片">
                <template slot-scope="scope">
                    <span>{{scope.row.image}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="是否跳转">
                <template slot-scope="scope">
                    <span>{{getStatusName(scope.row.isBlank)}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200" align="center" label="跳转链接">
                <template slot-scope="scope">
                    <span>{{scope.row.blankUrl}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="排序">
                <template slot-scope="scope">
                    <span>{{scope.row.sort}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="是否显示">
                <template slot-scope="scope">
                    <span>{{getStatusName(scope.row.isDisplay)}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200" align="center" label="操作时间">
                <template slot-scope="scope">
                    <span>{{scope.row.gmtModified | dateformat('YYYY-MM-DD')}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button v-if="sys_loan_btn_update_status" size="small" type="success"
                               @click="handleEdt(scope.row)">
                        {{sys_loan_btn_update_name}}
                    </el-button>
                    <el-button v-if="sys_loan_btn_delete_status" size="small" type="danger"
                               @click="handleDel(scope.row)">
                        {{sys_loan_btn_delete_name}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listUserLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listLoanQuery.page" :page-sizes="[10,20,30, 50]"
                           :page-size="listLoanQuery.size" layout="total, sizes, prev, pager, next, jumper"
                           :total="totalUser">
            </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
                   customClass="customWidth">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="位置" prop="position">
                    <el-select class="filter-item" v-model="form.position" placeholder="请选择位置">
                        <el-option v-for="item in typeOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="内容描述">
                    <el-input v-model="form.describes" placeholder="请输入内容描述"></el-input>
                </el-form-item>
                <el-form-item label="图片：" prop="image">
                    <el-upload :action="fileUploadUrl"
                               :show-file-list="false"
                               list-type="picture-card"
                               :on-success="handleSuccess">
                        <img v-if="form.image" :src="form.image" class="avatar">
                        <i v-else class="el-icon-plus"></i>
                        <div v-show="!form.image" slot="tip" class="el-upload__tip"></div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="跳转详情页" prop="isBlank">
                    <el-select class="filter-item" v-model="form.isBlank" placeholder="请选择是否跳转详情页">
                        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转链接" prop="ourCounterpart">
                    <el-input v-model="form.blankUrl" placeholder="请输入跳转链接"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="form.sort" placeholder="请选择排序" type="number"
                              onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" min="0"></el-input>
                </el-form-item>
                <el-form-item label="是否显示" prop="isDisplay">
                    <el-select class="filter-item" v-model="form.isDisplay" placeholder="请选择是否显示">
                        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel('form')">
                    取 消
                </el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="handleCreate('form')">
                    确 定
                </el-button>
                <el-button v-if="dialogStatus=='update'" type="primary" @click="handleUpdate('form')">
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        deleteAppBanner, findAppBannerById, updateAppBanner, addAppBanner, findAppBannerPage
    } from 'api/banner/index';
    import {mapGetters} from 'vuex';
    import {
        getDicInfo
    } from "api/system/user/index";

    export default {
        data() {
            return {
                typeOptions: [],
                fileUploadUrl: process.env.BASE_API + "/core/sys/file/image/upload",
                visible: false,
                listLoan: null,
                totalUser: null,
                listUserLoading: false,
                listLoanQuery: {
                    page: 1,
                    size: 10,
                    param: {
                        id: null
                    }
                },
                statusOptions: [
                    {key: 0, name: "否"},
                    {key: 1, name: "是"}
                ],
                form: {
                    id: undefined,
                    position: undefined,
                    describes: undefined,
                    image: undefined,
                    isBlank: undefined,
                    blankUrl: undefined,
                    sort: undefined,
                    isDisplay: undefined
                },
                dialogFormVisible: false,
                dialogStatus: "",
                textMap: {
                    create: "创建",
                    update: "编辑",
                    delete: "删除"
                },
                sys_loan_btn_search_name: "搜索",
                sys_loan_btn_update_status: true,
                sys_loan_btn_create_status: true,
                sys_loan_btn_delete_status: true,
                sys_loan_btn_update_name: "编辑",
                sys_loan_btn_create_name: "新增",
                sys_loan_btn_delete_name: "删除",
                rules: {
                    title: [
                        {
                            required: true,
                            message: '请输入标题',
                            trigger: 'blur'
                        }
                    ],
                    position: [
                        {
                            required: true,
                            message: '请输入位置',
                            trigger: 'blur'
                        }
                    ],
                    image: [
                        {
                            required: true,
                            message: '请上传图片',
                            trigger: 'blur'
                        }
                    ],
                    isBlank: [
                        {
                            required: true,
                            message: '请选择是否调整详情页',
                            trigger: 'blur'
                        }
                    ],
                    sort: [
                        {
                            required: true,
                            message: '请输入排序',
                            trigger: 'blur'
                        }
                    ],
                    isDisplay: [
                        {
                            required: true,
                            message: '请选择是否显示',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        created() {
            if (!!this.userElements["sys-app:banner_create"]) {
                this.sys_loan_btn_create_status = this.userElements[
                    "sys-app:banner_create"
                    ].status;
                this.sys_loan_btn_create_name = !!this.userElements[
                    "sys-app:banner_create"
                    ].name
                    ? this.userElements["sys-app:banner_create"].name
                    : "新增";
            }
            if (!!this.userElements["sys-app:banner_update"]) {
                this.sys_loan_btn_update_status = this.userElements[
                    "sys-app:banner_update"
                    ].status;
                this.sys_loan_btn_update_name = !!this.userElements[
                    "sys-app:banner_update"
                    ].name
                    ? this.userElements["sys-app:banner_update"].name
                    : "编辑";
            }
            if (!!this.userElements["sys-app:banner_delete"]) {
                this.sys_loan_btn_delete_status = this.userElements[
                    "sys-app:banner_delete"
                    ].status;
                this.sys_loan_btn_delete_name = !!this.userElements[
                    "sys-app:banner_delete"
                    ].name
                    ? this.userElements["sys-app:banner_delete"].name
                    : "删除";
            }
            this.getAllMerchant();
            this.getDictType();
        },
        computed: {
            ...mapGetters(["userElements"])
        },
        methods: {
            getDictType() {
                getDicInfo('SYS_BANNER_TYPE').then(response => {
                    const page = response.data;
                    if (page != null) {
                        this.typeOptions = page;
                        let userTypeTmp = [];
                        if (this.typeOptions != null && this.typeOptions.length > 0) {
                            for (let item of this.typeOptions) {
                                userTypeTmp.push({key: parseInt(item.tag) + '', name: item.name});
                            }
                            this.typeOptions = userTypeTmp;
                        }
                    }
                });
            },
            handleSuccess(res) {
                if (res.code === "S0000") {
                    this.form.image = res.data;
                } else {
                    this.$notify({
                        title: '提示',
                        message: res.mesg,
                        type: 'error',
                        duration: 2000
                    });
                }
            },
            handleSizeChange(val) {
                this.listLoanQuery.size = val;
                this.getAllMerchant();
            },
            handleCurrentChange(val) {
                this.listLoanQuery.page = val;
                this.getAllMerchant();
            },
            getAllMerchant() {
                this.listUserLoading = true;
                findAppBannerPage(this.listLoanQuery).then(response => {
                    const page = response.data;
                    this.listLoan = page.datas;
                    this.totalUser = page.total;
                    this.listUserLoading = false;
                });
            },
            getTypeOption(key) {
                let name = key;
                for (let option of this.typeOptions) {
                    if (option.key === key) {
                        name = option.name;
                        break;
                    }
                }
                return name;
            },
            getStatusName(key) {
                let name = key;
                for (let option of this.statusOptions) {
                    if (option.key === key) {
                        name = option.name;
                        break;
                    }
                }
                return name;
            },
            handleFilter() {
                this.listLoanQuery.page = 1;
                this.getAllMerchant();
            },
            handleAdd() {
                this.form = {
                    id: undefined,
                    companyName: undefined,
                    status: undefined,
                    companyAbbreviation: undefined,
                    companyType: undefined,
                    merchantReceiver: undefined,
                    pickUpMobile: undefined,
                    ourCounterpart: undefined,
                    settlementMethod: undefined,
                    logo: undefined,
                    ramake: undefined
                }
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
            },
            handleEdt(row) {
                findAppBannerById(row.id).then(response => {
                    this.form = response.data;
                    this.dialogFormVisible = true;
                    this.dialogStatus = "update";
                });
            },
            handleDel(row) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    deleteAppBanner(row.id).then(() => {
                        this.$notify({
                            title: "成功",
                            message: "删除成功",
                            type: "success",
                            duration: 2000
                        });
                        this.handleFilter();
                    });
                });
            },
            handleCreate(formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        addAppBanner(this.form).then(response => {
                            if (response.flag === true) {
                                this.dialogFormVisible = false;
                                this.getAllMerchant();
                                this.$notify({
                                    title: "成功",
                                    message: "创建成功",
                                    type: "success",
                                    duration: 2000
                                });
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: response.msg,
                                    type: 'warning',
                                    duration: 2000
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleCancel(formName) {
                this.dialogFormVisible = false;
                this.$refs[formName].resetFields();
            },
            handleUpdate(formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        updateAppBanner(this.form).then(response => {
                            if (response.flag === true) {
                                this.dialogFormVisible = false;
                                this.getAllMerchant();
                                this.$notify({
                                    title: '成功',
                                    message: '修改成功',
                                    type: 'success',
                                    duration: 2000
                                });
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: response.msg,
                                    type: 'warning',
                                    duration: 2000
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.listLoanQuery.param = {
                    id: undefined,
                    companyName: undefined,
                    companyAbbreviation: undefined,
                    status: undefined
                };
            }
        }
    };
</script>
<style>
    .avatar {
        width: 146px;
        height: 146px;
        display: block;
    }

    .customWidth {
        width: 30%;
    }
</style>

