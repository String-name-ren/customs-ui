<template>
    <el-dialog :title="textRoleLinkElementTitle" :visible.sync="visible" size="large">
        <el-row>
            <el-col>
                <el-card class="box-card">
                    <div class="filter-container">
                        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="编码" v-model="elementQuery.param.code"> </el-input>
                        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
                    </div>
                    <el-table :key="tableKey" :data="elementLinkData" v-loading.body="elementUnlinkLoading" ref="myTable" border="" fit="" highlight-current-row="" style="width: 100%">
                        <el-table-column align="center" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-checkbox :checked="scope.row.checked" v-model="scope.row.checked" @change="choice(scope.row)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="序号" width="100">
                            <template slot-scope="scope">
                                <span>{{scope.row.id}}</span>
                            </template>
                        </el-table-column>
                        <!--<el-table-column width="100px" align="center" label="类型">
                            <template slot-scope="scope">
                                <span>{{getTypeName(scope.row.type)}}</span>
                            </template>
                        </el-table-column>-->
                        <el-table-column width="300px" align="center" label="编码">
                            <template slot-scope="scope">
                                <span>{{scope.row.code}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="160px" align="center" label="名称">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="160px" align="center" label="图标">
                            <template slot-scope="scope">
                                <span>{{scope.row.icon}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="200px" align="center" label="链接">
                            <template slot-scope="scope">
                                <span>{{scope.row.href}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="200px" align="center" label="请求类型">
                            <template slot-scope="scope">
                                <span>{{scope.row.method}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="100px" align="center" label="状态">
                            <template slot-scope="scope">
                                <span>{{getStatusName(scope.row.status)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="400px" align="center" label="描述">
                            <template slot-scope="scope">
                                <span>{{scope.row.description}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="180" align="center" label="更新时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.updateAt | dateformat}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="200" align="center" label="更新人员">
                            <template slot-scope="scope">
                                <span>{{scope.row.updateBy}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div v-show="!elementUnlinkLoading" class="pagination-container">
                        <el-pagination @size-change="handleElementSizeChange" @current-change="handleElementCurrentChange" :current-page.sync="elementQuery.page" :page-sizes="[10,20,30, 50]" :page-size="elementQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="totalElement">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { list, select, create, remove, update } from "api/system/element/index";
import {
    selectElementAllMenu,
    selectUnlinkElementAllMenu,
    createLinkedElementAllMenu,
    removeLinkedElementAllMenu
} from "api/system/role/index";
export default {
    name: "user",
    data() {
        return {
            methodOptions: ["GET", "POST", "PUT", "DELETE"],
            statusOptions: [{ key: 0, name: "无效" }, { key: 1, name: "有效" }],
            typeOptions: [
                { key: "0", name: "其他" },
                { key: "10", name: "按钮" },
                { key: "20", name: "链接" }
            ],

            roleId: -1,
            visible: false,
            tableKey: 0,
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
            textRoleLinkElementTitle: "角色关联元素",

            elementLinkedLoading: false,
            elementQuery: {
                page: 1,
                size: 10,
                param: {
                    flag: undefined,
                    code: undefined,
                    roleId: undefined,
                    elementIds: []
                }
            },
            elementLinkData: [],
            elementUnlinkLoading: false,
            elementUnlinkData: [],
            totalElement: null,
            system_role_btn_element_link_create_status: false,
            system_role_btn_element_link_delete_status: false,
            system_role_btn_element_link_create_name: "新增",
            system_role_btn_element_link_delete_name: "删除"
        };
    },
    created() {
        if (!!this.userElements["system-role:btn_element_link_create"]) {
            this.system_role_btn_element_link_create_status = this.userElements[
                "system-role:btn_element_link_create"
            ].status;
            this.system_role_btn_element_link_create_name = !!this.userElements[
                "system-role:btn_element_link_create"
            ].name
                ? this.userElements["system-role:btn_element_link_create"].name
                : "新增";
        }
        if (!!this.userElements["system-role:btn_element_link_delete"]) {
            this.system_role_btn_element_link_delete_status = this.userElements[
                "system-role:btn_element_link_delete"
            ].status;
            this.system_role_btn_element_link_delete_name = !!this.userElements[
                "system-role:btn_element_link_delete"
            ].name
                ? this.userElements["system-role:btn_element_link_delete"].name
                : "删除";
        }
    },
    computed: {
        ...mapGetters(["userElements"])
    },
    methods: {
        choice(row) {
            this.elementQuery.param.roleId = this.roleId;
            if (row.checked) {
                this.$confirm("添加关联元素, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.elementQuery.param.elementIds.push(row.id);
                    const index = this.elementQuery.param.elementIds.indexOf(row.id);
                    this.setLinkedElement();
                });
            } else {
                this.$confirm("删除关联元素, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.elementQuery.param.elementIds.push(row.id);
                    const index = this.elementQuery.param.elementIds.indexOf(row.id);
                    this.setUnlinkElement();
                });
            }
        },
        getTypeName(type) {
            let name = type;
            for (let option of this.typeOptions) {
                if (option.key == type) {
                    name = option.name;
                    break;
                }
            }
            return name;
        },
        getStatusName(status) {
            let name = status;
            for (let option of this.statusOptions) {
                if (option.key == status) {
                    name = option.name;
                    break;
                }
            }
            return name;
        },
        handleFilter() {
            this.elementQuery.param.flag = "";
            this.getElement();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        getElementData() {
            this.elementLinkData = [];
            this.elementQuery.param.flag = "";
            this.elementQuery.param.filterText = "";
            this.getElement();
        },
        getElement() {
            this.elementQuery.param.roleId = this.roleId;
            this.elementLinkedLoading = true;
            selectElementAllMenu(this.elementQuery).then(response => {
                const code = response.code;
                const mesg = response.msg;
                const data = response.data;
                this.elementLinkData = data.datas;
                for (let pdata of this.elementLinkData) {
                    if (pdata.flag == 1) {
                        pdata.checked = true;
                    } else {
                        pdata.checked = false;
                    }
                }
                this.totalElement = data.total;
                this.elementLinkedLoading = false;
            });
        },
        handleElementSizeChange(val) {
            this.elementQuery.size = val;
            this.getElement();
        },
        handleElementCurrentChange(val) {
            this.elementQuery.page = val;
            this.getElement();
        },
        getUnlinkElement() {
            this.elementUnlinkQuery.roleId = this.roleId;
            this.elementUnlinkLoading = true;
            selectUnlinkElementAllMenu(this.elementUnlinkQuery).then(
                response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const data = response.data;

                    this.elementUnlinkData = data;
                    this.elementUnlinkLoading = false;
                }
            );
        },
        setLinkedElement() {
            createLinkedElementAllMenu(this.elementQuery).then(
                response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const page = response.data;
                    this.getElementData();
                    this.elementQuery.param.elementIds = [];
                }
            );
        },
        setUnlinkElement() {
            removeLinkedElementAllMenu(this.elementQuery).then(
                response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const page = response.data;

                    this.getElementData();

                    this.elementQuery.param.elementIds = [];
                }
            );
        },
        handleStatusChange() {
            if (this.value == 0) {
                this.elementQuery.param.flag = "";
                this.getElement();
            } else if (this.value == 1) {
                this.elementQuery.param.flag = "true";
                this.getElement();
            }
            if (this.value == 2) {
                this.elementQuery.param.flag = "false";
                this.getElement();
            }
        }
    }
};
</script>
