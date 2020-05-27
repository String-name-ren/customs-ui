<template>
    <el-dialog :title="textRoleLinkMerchantTitle" :visible.sync="visible" size="small">
        <el-row>
            <el-col>
                <el-card class="box-card">
                    <div class="filter-container">
                        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listUserQuery.param.name">
                        </el-input>
                        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="编号" v-model="listUserQuery.param.code">
                        </el-input>
                        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="手机" v-model="listUserQuery.param.phone">
                        </el-input>
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                            {{org_user_btn_search_name}}
                        </el-button>
                    </div>
                    <el-table :data="listUser" v-loading.body="listUserLoading" ref="myTable" border="" fit="" highlight-current-row="" style="width: 100%">
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
                        <el-table-column width="200" align="center" label="名称">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="160" align="center" label="编号">
                            <template slot-scope="scope">
                                <span>{{scope.row.code}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="200" align="center" label="联系方式">
                            <template slot-scope="scope">
                                <span>{{scope.row.phone}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="200" align="center" label="地址">
                            <template slot-scope="scope">
                                <span>{{scope.row.addr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="200" align="center" label="邮箱">
                            <template slot-scope="scope">
                                <span>{{scope.row.email}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="100px" align="center" label="状态">
                            <template slot-scope="scope">
                                <span>{{getUserStatusName(scope.row.status)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="180" align="center" label="创建时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.gmtCreated | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="180" align="center" label="更新时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.gmtModified | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div v-show="!listUserLoading" class="pagination-container">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listUserQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listUserQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="totalUser">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {
        getAllMerchant,createLinkedMerchant,removeLinkedMerchant,getAllCheckMerchant
    } from 'api/system/role/index';
    export default {
        name: "merchant",
        data(){
            return{
                checked: "",
                roleId: -1,
                visible: false,
                textRoleLinkMerchantTitle: '角色关联商户',
                listUser: null,
                totalUser: null,
                listUserLoading: true,
                listUserQuery: {
                    page: 1,
                    size: 10,
                    param: {
                        name: undefined,
                        code: undefined,
                        phone: undefined,
                        addr: undefined,
                        email: undefined,
                        status: undefined

                    }
                },
                listLinkedMerchantQuery: {
                    selRoleId: undefined,
                    merchantCode: undefined,
                },
                statusUserOptions: [
                    { key: 0, name: "正常" },
                    { key: 1, name: "冻结" }
                ],
                org_user_btn_search_name:"搜索"
            }
        },
        created() {

        },
        computed: {
            ...mapGetters(["userElements"])
        },
        methods:{
            roleHandleFilter() {
                this.listUserQuery.page = 1;
                this.getAllCheckMerchant();
            },
            handleSizeChange(val) {
                this.listUserQuery.size = val;
                this.getAllCheckMerchant();
            },
            handleCurrentChange(val) {
                this.listUserQuery.page = val;
                this.getAllCheckMerchant();
            },
            getAllMerchant() {
                this.listUserLoading = true;
                getAllMerchant(this.listUserQuery).then(response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const page = response.data;
                    this.listUser = page.datas;
                    this.totalUser = page.total;
                    this.listUserLoading = false;
                });
            },
            getAllCheckMerchant(){
                this.listUserLoading = true;
                getAllCheckMerchant(this.listUserQuery,this.roleId).then(response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const page = response.data;
                    this.listUser = page.datas;
                    this.totalUser = page.total;
                    for (let pdata of this.listUser) {
                        if (pdata.mark== true) {
                            pdata.checked = true;
                        } else {
                            pdata.checked = false;
                        }
                    }
                    this.listUserLoading = false;
                });

            },
            choice(row) {
                this.dialogRoleVisible = true;
                if (row.checked) {
                    this.listLinkedMerchantQuery.selRoleId=this.roleId;
                    this.listLinkedMerchantQuery.merchantCode=row.code;
                    this.setLinkedMerchant();
                } else {
                    this.listLinkedMerchantQuery.selRoleId=this.roleId;
                    this.listLinkedMerchantQuery.merchantCode=row.code;
                    this.setUnlinkRole();
                }
            },
            setLinkedMerchant() {
                this.listUserLoading = true;
                createLinkedMerchant(this.listLinkedMerchantQuery).then(response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const page = response.data;
                    this.listUserLoading = false;
                    this.getAllCheckMerchant();
                    //this.listLinkedMerchantQuery.merchantCode = '';
                });
            },
            setUnlinkRole() {
                this.listUserLoading = true;
                removeLinkedMerchant(this.listLinkedMerchantQuery).then(response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const page = response.data;
                    this.listUserLoading = false;
                    this.getAllCheckMerchant();
                    //this.listLinkedMerchantQuery.merchantCode = '';
                });
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
            handleFilter() {
                this.listUserQuery.page=1;
                this.getAllCheckMerchant();
            },


        }
    };
</script>

<style scoped>

</style>
