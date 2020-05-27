<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="筛选" v-model="listLogQuery.param.filterText">
            </el-input>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                搜索
            </el-button>
            <!--<el-button class="filter-item" v-if="system_user_btn_create_status" style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-edit">
                {{system_user_btn_create_name}}
            </el-button>-->
        </div>
        <el-table :key="tableKey" :data="listUser" v-loading.body="listUserLoading" border="" fit="" highlight-current-row="" style="width: 100%">
            <el-table-column align="center" label="序号" width="110">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" align="center" label="用户id">
                <template slot-scope="scope">
                    <span>{{scope.row.userId}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="登录用户名">
                <template slot-scope="scope">
                    <span>{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <!--<el-table-column width="200" align="center" label="姓名">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>-->
            <el-table-column width="200" align="center" label="用户操作">
                <template slot-scope="scope">
                    <span>{{scope.row.operation}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="响应时间">
                <template slot-scope="scope">
                    <span>{{scope.row.time}}</span>
                </template>
            </el-table-column>
            <el-table-column width="350" align="center" label="请求方法">
                <template slot-scope="scope">
                    <span>{{scope.row.method}}</span>
                </template>
            </el-table-column>
            <el-table-column width="350px" align="center" label="请求参数">
                <template slot-scope="scope">
                    <span>{{scope.row.params}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="100" label="IP地址">
                <template slot-scope="scope">
                    <span>{{scope.row.ip}}</span>
                </template>
            </el-table-column>
            <el-table-column width="180" align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.gmtCreate | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
            </el-table-column>
           <!-- <el-table-column width="200" align="center" label="更新人员">
                <template slot-scope="scope">
                    <span>{{scope.row.updateBy}}</span>
                </template>
            </el-table-column>-->
            <!--<el-table-column fixed="right" align="center" label="首页操作" width="220">
                <template slot-scope="scope">
                    <el-button v-if="system_user_btn_update_status" size="small" type="success" @click="handleEdt(scope.row)">
                        {{system_user_btn_update_name}}
                    </el-button>
                    <el-button v-if="system_user_btn_delete_status" size="small" type="danger" @click="handleDel(scope.row)">
                        {{system_user_btn_delete_name}}
                    </el-button>
                    <el-button v-if="system_user_btn_role_link_status" size="small" type="warning" @click="handleRole(scope.row)">
                        {{system_user_btn_role_link_name}}
                    </el-button>
                </template>
            </el-table-column>-->
        </el-table>
        <div v-show="!listUserLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listLogQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listLogQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="totalUser">
            </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="类型" prop="type">
                    <el-select class="filter-item" v-model="form.type" placeholder="请输入类型" :disabled="dataSign">
                        <el-option v-for="item in typeUserOptions" :key="item.key" :label="item.name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账户" prop="username">
                    <el-input v-if="dialogStatus == 'create'" v-model="form.username" placeholder="请输入账户"></el-input>
                    <el-input v-else v-model="form.username" :disabled="dataSign"></el-input>
                </el-form-item>
                <el-form-item v-if="dialogStatus == 'create'" label="密码" prop="password" required>
                    <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item v-else label="密码" prop="password">
                    <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" placeholder="请输入姓名" :disabled="dataSign"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                    <el-input v-model="form.icon" placeholder="请输入图标" :disabled="dataSign"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入电话" :disabled="dataSign"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱" :disabled="dataSign"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入描述" v-model="form.description" :disabled="dataSign">
                    </el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select class="filter-item" v-model="form.status" placeholder="请输入状态" :disabled="dataSign">
                        <el-option v-for="item in statusUserOptions" :key="item.key" :label="item.name" :value="item.key">
                        </el-option>
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
                <el-button v-else="" type="primary" @click="handleUpdate('form')">
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :title="textRoleTitle" :visible.sync="dialogRoleVisible" size="large">
            <el-row>
                <el-col>
                    <el-card class="box-card">
                        <div class="filter-container">
                            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="筛选" v-model="listRoleQuery.param.filterText"> </el-input>
                            <el-select v-model="value" placeholder="请选择" class="filter-item" @change="handleStatusChange">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="roleHandleFilter">搜索</el-button>
                        </div>
                        <el-table :key="tableKey" :data="listRole" v-loading.body="listLinkedRoleLoading" ref="myTable" border="" fit="" highlight-current-row="" style="width: 100%">
                            <el-table-column align="center" label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-checkbox :checked="scope.row.checked" v-model="scope.row.checked" @change="choice(scope.row)"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="序号" width="110">
                                <template slot-scope="scope">
                                    <span>{{scope.row.id}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="100px" align="center" label="类型">
                                <template slot-scope="scope">
                                    <span>{{getRoleTypeName(scope.row.type)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="200" align="center" label="编码">
                                <template slot-scope="scope">
                                    <span>{{scope.row.code}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="200" align="center" label="姓名">
                                <template slot-scope="scope">
                                    <span>{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="200" align="center" label="图标">
                                <template slot-scope="scope">
                                    <span>{{scope.row.icon}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="100px" align="center" label="状态">
                                <template slot-scope="scope">
                                    <span>{{getRoleStatusName(scope.row.status)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" width="400" label="描述">
                                <template slot-scope="scope">
                                    <span>{{scope.row.description}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="180" align="center" label="更新时间">
                                <template slot-scope="scope">
                                    <span>{{scope.row.updateAt | formatTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="200" align="center" label="更新人员">
                                <template slot-scope="scope">
                                    <span>{{scope.row.updateBy}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div v-show="!listLinkedRoleLoading" class="pagination-container">
                            <el-pagination @size-change="handleRoleSizeChange" @current-change="handleRoleCurrentChange" :current-page.sync="listRoleQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listRoleQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="totalRole">
                            </el-pagination>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
  <script>
import {
    page,
    create,
    select,
    remove,
    update,
    createLinkedRole,
    removeLinkedRole,
    rolePage,
    parRolePage
} from "api/system/log/index";
import { mapGetters } from "vuex";
export default {
    name: "user",
    data() {
        return {
            dataSign: false,
            typeUserOptions: [
                { key: "0", name: "其他" },
                { key: "10", name: "系统" },
                { key: "20", name: "客户" },
                { key: "30", name: "供应商" }
            ],
            statusUserOptions: [
                { key: 0, name: "无效" },
                { key: 1, name: "有效" }
            ],
            typeRoleOptions: [
                { key: "0", name: "其他" },
                { key: "10", name: "系统" },
                { key: "20", name: "客户" },
                { key: "30", name: "供应商" }
            ],
            statusRoleOptions: [
                { key: 0, name: "无效" },
                { key: 1, name: "有效" }
            ],
            form: {
                type: undefined,
                username: undefined,
                password: undefined,
                name: undefined,
                icon: undefined,
                phone: undefined,
                email: undefined,
                description: undefined,
                status: 1
            },
            options: [
                {
                    value: "0",
                    label: "全部"
                },
                {
                    value: "1",
                    label: "已选择"
                },
                {
                    value: "2",
                    label: "未选择"
                }
            ],
            value: "0",
            rules: {
                type: [
                    {
                        required: true,
                        message: "请输入类型",
                        trigger: "blur"
                    }
                ],
                username: [
                    {
                        required: true,
                        message: "请输入账户",
                        trigger: "blur"
                    },
                    {
                        min: 3,
                        max: 32,
                        message: "长度在3到32个字符",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        message: "请输入密码",
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 32,
                        message: "长度在6到32个字符",
                        trigger: "blur"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "请输入用户",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 64,
                        message: "长度在2到64个字符",
                        trigger: "blur"
                    }
                ],
                icon: [
                    {
                        min: 4,
                        max: 256,
                        message: "长度在4到256个字符",
                        trigger: "blur"
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: "请输入邮箱",
                        trigger: "blur"
                    },
                    {
                        min: 4,
                        max: 16,
                        message: "长度在4到16个字符",
                        trigger: "blur"
                    }
                ],
                email: [
                    {
                        required: true,
                        message: "请输入邮箱",
                        trigger: "blur"
                    },
                    {
                        min: 3,
                        max: 64,
                        message: "长度在3到64个字符",
                        trigger: "blur"
                    }
                ],
                description: [
                    {
                        max: 512,
                        message: "长度要小于512个字符",
                        trigger: "blur"
                    }
                ]
            },
            checked: "",
            listUser: null,
            totalUser: null,
            listUserLoading: true,
            listLogQuery: {
                page: 1,
                size: 10,
                param: {
                    filterText: undefined
                }
            },
            listLinkedRole: null,
            listLinkedRoleLoading: true,
            listLinkedRoleQuery: {
                selUid: undefined,
                roleIds: []
            },
            listUnlinkRole: null,
            listUnlinkRoleLoading: true,
            listUnlinkRoleQuery: {
                selUid: undefined,
                roleIds: []
            },
            listQuery: {
                page: 1,
                size: 10,
                param: {
                    filterText: undefined,
                    status: 1
                }
            },
            listRole: null,
            totalRole: null,
            listRoleQuery: {
                page: 1,
                size: 10,
                param: {
                    filterText: undefined,
                    selUid: undefined,
                    mark: undefined
                }
            },
            dialogFormVisible: false,
            dialogStatus: "",
            sign: "",
            dialogRoleVisible: false,
            system_user_btn_update_status: false,
            system_user_btn_create_status: false,
            system_user_btn_delete_status: false,
            system_user_btn_role_link_status: false,
            system_user_btn_role_link_create_status: false,
            system_user_btn_role_link_delete_status: false,
            system_user_btn_update_name: "编辑",
            system_user_btn_create_name: "新增",
            system_user_btn_delete_name: "删除",
            system_user_btn_role_link_name: "角色",
            system_user_btn_role_link_create_name: "新增",
            system_user_btn_role_link_delete_name: "删除",
            textRoleTitle: "用户关联角色",
            textMap: {
                create: "创建",
                update: "编辑",
                delete: "删除"
            },
            tableKey: 0
        };
    },
    created() {
        if (!!this.userElements["system-user:btn_create"]) {
            this.system_user_btn_create_status = this.userElements[
                "system-user:btn_create"
            ].status;
            this.system_user_btn_create_name = !!this.userElements[
                "system-user:btn_create"
            ].name
                ? this.userElements["system-user:btn_create"].name
                : "新增";
        }
        if (!!this.userElements["system-user:btn_update"]) {
            this.system_user_btn_update_status = this.userElements[
                "system-user:btn_update"
            ].status;
            this.system_user_btn_update_name = !!this.userElements[
                "system-user:btn_update"
            ].name
                ? this.userElements["system-user:btn_update"].name
                : "编辑";
        }
        if (!!this.userElements["system-user:btn_delete"]) {
            this.system_user_btn_delete_status = this.userElements[
                "system-user:btn_delete"
            ].status;
            this.system_user_btn_delete_name = !!this.userElements[
                "system-user:btn_delete"
            ].name
                ? this.userElements["system-user:btn_delete"].name
                : "删除";
        }
        if (!!this.userElements["system-user:btn_role_link"]) {
            this.system_user_btn_role_link_status = this.userElements[
                "system-user:btn_role_link"
            ].status;
            this.system_user_btn_role_link_name = !!this.userElements[
                "system-user:btn_role_link"
            ].name
                ? this.userElements["system-user:btn_role_link"].name
                : "角色";
        }
        if (!!this.userElements["system-user:btn_role_link_create"]) {
            this.system_user_btn_role_link_create_status = this.userElements[
                "system-user:btn_role_link_create"
            ].status;
            this.system_user_btn_role_link_create_name = !!this.userElements[
                "system-user:btn_role_link_create"
            ].name
                ? this.userElements["system-user:btn_role_link_create"].name
                : "新增";
        }
        if (!!this.userElements["system-user:btn_role_link_delete"]) {
            this.system_user_btn_role_link_delete_status = this.userElements[
                "system-user:btn_role_link_delete"
            ].status;
            this.system_user_btn_role_link_delete_name = !!this.userElements[
                "system-user:btn_role_link_delete"
            ].name
                ? this.userElements["system-user:btn_role_link_delete"].name
                : "删除";
        }
        this.getPage();
    },
    computed: {
        ...mapGetters(["userElements"])
    },
    methods: {
        choice(row) {
            this.dialogRoleVisible = true;
            if (row.checked) {
                this.$confirm("添加关联角色, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.listLinkedRoleQuery.roleIds.push(row.id);
                    this.setLinkedRole();
                });
            } else {
                this.$confirm("删除关联角色, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.listLinkedRoleQuery.roleIds.push(row.id);
                    this.setUnlinkRole();
                });
            }
        },
        getUserTypeName(key) {
            let name = key;
            for (let option of this.typeUserOptions) {
                if (option.key == key) {
                    name = option.name;
                    break;
                }
            }
            return name;
        },
        getUserStatusName(key) {
            let name = key;
            for (let option of this.statusUserOptions) {
                if (option.key == key) {
                    name = option.name;
                    break;
                }
            }
            return name;
        },
        getRoleTypeName(key) {
            let name = key;
            for (let option of this.typeRoleOptions) {
                if (option.key == key) {
                    name = option.name;
                    break;
                }
            }

            return name;
        },
        getRoleStatusName(key) {
            let name = key;
            for (let option of this.statusRoleOptions) {
                if (option.key == key) {
                    name = option.name;
                    break;
                }
            }
            return name;
        },
        getPage() {
            this.listUserLoading = true;
            page(this.listLogQuery).then(response => {
                const code = response.code;
                const mesg = response.msg;
                const page = response.data;

                this.listUser = page.datas;
                this.totalUser = page.total;
                this.listUserLoading = false;
            });
        },
        getParRolePage() {
            this.listLinkedRoleLoading = true;
            parRolePage(this.listRoleQuery).then(response => {
                const code = response.code;
                const mesg = response.msg;
                const data = response.data;

                this.listLinkedRole = data;
                this.listLinkedRoleLoading = false;
            });
        },
        getRolePage() {
            this.listLinkedRoleLoading = true;
            let that = this;
            rolePage(this.listRoleQuery).then(response => {
                const code = response.code;
                const mesg = response.msg;
                const data = response.data;

                this.listRole = data.datas;
                for (let pdata of this.listRole) {
                    if (pdata.mark == 1) {
                        pdata.checked = true;
                    } else {
                        pdata.checked = false;
                    }
                }
                this.totalRole = data.total;
                this.listLinkedRoleLoading = false;
            });
        },
        handleStatusChange() {
            if (this.value == 0) {
                this.listRoleQuery.param.mark = "";
                this.getRolePage();
            } else if (this.value == 1) {
                this.listRoleQuery.param.mark = "true";
                this.getRolePage();
            }
            if (this.value == 2) {
                this.listRoleQuery.param.mark = "false";
                this.getRolePage();
            }
        },
        setLinkedRole() {
            this.listLinkedRoleLoading = true;
            createLinkedRole(this.listLinkedRoleQuery).then(response => {
                const code = response.code;
                const mesg = response.msg;
                const page = response.data;
                this.listLinkedRoleLoading = false;
                this.getRolePage();
                this.listLinkedRoleQuery.roleIds = [];
            });
        },
        setUnlinkRole() {
            this.listLinkedRoleLoading = true;
            removeLinkedRole(this.listLinkedRoleQuery).then(response => {
                const code = response.code;
                const mesg = response.msg;
                const page = response.data;
                this.listLinkedRoleLoading = false;
                this.getRolePage();
                this.listLinkedRoleQuery.roleIds = [];
            });
        },
        handleFilter() {
            this.getPage();
        },
        roleHandleFilter() {
            this.listRoleQuery.page = 1;
            this.getRolePage();
        },
        handleSizeChange(val) {
            this.listLogQuery.size = val;
            this.getPage();
        },
        handleCurrentChange(val) {
            this.listLogQuery.page = val;
            this.getPage();
        },
        handleRoleSizeChange(val) {
            this.listRoleQuery.size = val;
            this.getRolePage();
        },
        handleRoleCurrentChange(val) {
            this.listRoleQuery.page = val;
            this.getRolePage();
        },
        handleAdd() {
            this.resetTemp();
            this.dialogStatus = "create";
            this.dialogFormVisible = true;
        },
        handleEdt(row) {
            select(row.id).then(response => {
                this.form = response.data;
                this.form.password = undefined;
                if(null != this.form.linkId){
                    this.dataSign = true;
                }else{
                    this.dataSign = false;
                }
                this.dialogFormVisible = true;
                this.dialogStatus = "update";
                this.getPage();
            });
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
                    const index = this.listUser.indexOf(row);
                    this.listUser.splice(index, 1);
                });
            });
        },
        handleRole(row) {
            this.dialogRoleVisible = true;
            this.listLinkedRoleQuery.selUid = row.id;
            this.listUnlinkRoleQuery.selUid = row.id;
            this.listRoleQuery.param.selUid = row.id;
            this.listRoleQuery.page = 1;
            this.listRoleQuery.param.filterText = "";
            this.listRoleQuery.param.mark = "";
            this.value = "";
            this.getRolePage();
        },
        handleCreate(formName) {
            const set = this.$refs;
            set[formName].validate(valid => {
                if (valid) {
                    create(this.form).then(response => {
                        if(response.data == true){
                            this.dialogFormVisible = false;
                            this.getPage();
                            this.$notify({
                                title: "成功",
                                message: "创建成功",
                                type: "success",
                                duration: 2000
                            });
                        }else{
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
            if(null == this.form.password || "" == this.form.password || undefined == this.form.password){
                this.form.password = undefined;
                this.updateUserInfo(formName);
            }else{
                this.$confirm('是否确定修改用户密码?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.updateUserInfo(formName);
                });
            }
        },
        updateUserInfo(formName) {
            const set = this.$refs;
            set[formName].validate(valid => {
                if (valid) {
                    this.dialogFormVisible = false;
                    update(this.form.id, this.form).then(response => {
                        if(response.data == true){
                            this.dialogFormVisible = false;
                            this.getPage();
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
                                type: 'success',
                                duration: 2000
                            });
                        }else{
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
            this.form = {
                type: undefined,
                username: undefined,
                password: undefined,
                name: undefined,
                icon: undefined,
                phone: undefined,
                email: undefined,
                description: undefined,
                status: 1
            };
        }
    }
};
</script>