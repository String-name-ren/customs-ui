<template>
    <el-dialog :title="textRoleLinkMenuTitle" :visible.sync="visible" size="small">
        <div>
            <el-row>
                <el-col :span="24">
                    <el-card class="box-card" v-loading.body="menuLinkedLoading">
                        <div slot="header" class="clearfix">
                            <span>已选菜单</span>
                            <el-input
                                    placeholder="输入关键字进行过滤"
                                    v-model="filterMenuLinked"
                                    size="mini"
                                    style="display: inline-block; padding: 10px 0 3px;">
                            </el-input>
                        </div>

                        <div style="height: 300px; overflow: scroll;">
                            <el-tree
                                    class="filter-tree"
                                    :data="menuLinkedData"
                                    node-key="id"
                                    :props="defaultProps"
                                    :filter-node-method="filterLinkedNode"
                                    ref="menuTreeUnlink"
                                    default-expand-all
                                    :expand-on-click-node="false"
                                    show-checkbox
                                    :default-checked-keys="defaultcheckedkeys"
                                    :render-content="renderLinkedMenuContent">
                            </el-tree>
                        </div>
                        <div align="right">
                            <el-button  size="small" type="primary" @click="handleCheckChange" :disabled="isDisable">保存</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>菜单详情</span>
                    </div>
                    <el-table :key='tableKey' :data="meunDetailDatas" border fit highlight-current-row style="width: 100%">
                        <el-table-column align="center" label="序号" width="110">
                            <template slot-scope="scope">
                                <span>{{scope.row.id}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="100px" align="center" label="类型">
                            <template slot-scope="scope">
                                <span>{{getMenuTypeName(scope.row.type)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="200" align="center" label="编码">
                            <template slot-scope="scope">
                                <span>{{scope.row.code}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="200" align="center" label="名称">
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
                                <span>{{getMenuStatusName(scope.row.status)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" width="400" label="描述">
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
                        <el-table-column fixed="right" align="center" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button v-if="link_role_menu_element_flag" size="small" type="success" @click="handleElementLink(scope.row)">
                                    {{system_role_btn_menu_element_link_name}}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row v-if="edit_role_menu_element_flag" style="margin-top: 10px;">
                        <el-col :span="24">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>已选元素</span>
                                </div>
                                <div style="height: 300px; overflow: scroll;">
                                    <el-table :key='tableKey' :data="elementLinkedData" v-loading.body="elementLinkedLoading" border fit highlight-current-row style="width: 100%;">
                                        <el-table-column align="center" label="操作" width="100">
                                            <template slot-scope="scope">
                                                <el-checkbox :checked="scope.row.checked" v-model="scope.row.checked" @change="elementChoice(scope.row)"></el-checkbox>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="序号" width="100">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.id}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="100px" align="center" label="类型">
                                            <template slot-scope="scope">
                                                <span>{{getElementTypeName(scope.row.type)}}</span>
                                            </template>
                                        </el-table-column>
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
                                                <span>{{getElementStatusName(scope.row.status)}}</span>
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
                                        <!-- <el-table-column fixed="right" align="center" label="操作" width="100">
                                          <template slot-scope="scope">
                                            <el-button v-if="system_role_btn_menu_element_link_delete_status" size="small" type="danger" @click="handleElementLinkDel(scope.row)">
                                              {{system_role_btn_menu_element_link_delete_name}}
                                            </el-button>
                                          </template>
                                        </el-table-column> -->
                                    </el-table>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
            </el-row>
        </div>
    </el-dialog>
</template>

<script>
    import {
        buildTree
    } from 'utils/tree';
    import {
        tree, select, create, remove, update
    } from 'api/system/menu/index';
    import {
        selectLinkedMenu, selectUnlinkMenu,
        createLinkedMenu, removeLinkedMenu,
        selectLinkedElement, selectUnlinkElement,
        createLinkedElement, removeLinkedElement,
        batchCreateLinkedMenu, selectAllMenu,
        selectMenuElement,
    } from 'api/system/role/index';
    import { mapGetters } from 'vuex';
    export default {
        name: 'menu',
        components: {
            'menu-element': () => import('./element')
        },
        data() {
            return {
                isDisable: false,
                typeMenuOptions: [
                    {key: '0', name: '其他'},
                    {key: '10', name: '系统'},
                    {key: '20', name: '客户'},
                    {key: '30', name: '应用'}
                ],
                statusMenuOptions: [
                    {key: 0, name: '无效'},
                    {key: 1, name: '有效'}
                ],
                statusElementOptions: [
                    {key: 0, name: '无效'},
                    {key: 1, name: '有效'}
                ],
                typeElementOptions: [
                    {key: '0', name: '其他'},
                    {key: '10', name: '按钮'},
                    {key: '20', name: '链接'}
                ],

                roleId: -1,
                visible: false,
                selectMenuId: -1,

                tableKey: 0,

                textRoleLinkMenuTitle: '角色关联菜单',

                filterMenuLinked: '',
                menuLinkedLoading: false,
                menuLinkedQuery: {
                    roleId: undefined,
                    menuIds: []
                },
                menuLinkedData: [],
                defaultcheckedkeys: [],

                filterMenuUnlink: '',
                menuUnlinkLoading: false,
                menuUnlinkQuery: {
                    roleId: undefined,
                    menuIds: []
                },
                menuUnlinkData: [],

                elementLinkedLoading: false,
                elementLinkedQuery: {
                    roleId: undefined,
                    menuId: undefined,
                    elementIds: []
                },
                elementLinkedData: [],

                elementUnlinkLoading: false,
                elementUnlinkQuery: {
                    roleId: undefined,
                    menuId: undefined,
                    elementIds: []
                },
                elementUnlinkData: [],

                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                meunDetailDatas: [],
                menuDetailLoading: false,

                link_role_menu_element_flag: false,
                edit_role_menu_element_flag: false,

                system_role_btn_menu_link_create_status: false,
                system_role_btn_menu_link_delete_status: false,
                system_role_btn_menu_link_detail_status: false,
                system_role_btn_menu_element_link_status: false,

                system_role_btn_menu_element_link_create_status: false,
                system_role_btn_menu_element_link_delete_status: false,

                system_role_btn_menu_link_create_name: "新增",
                system_role_btn_menu_link_delete_name: "删除",
                system_role_btn_menu_link_detail_name: "详情",
                system_role_btn_menu_element_link_name: "页面元素",

                system_role_btn_menu_element_link_create_name: "新增",
                system_role_btn_menu_element_link_delete_name: "删除",

            }
        },
        watch: {
            filterMenuLinked(val) {
                this.$refs.menuTreeUnlink.filter(val);
            }
        },
        created() {
            if(!!this.userElements['system-role:btn_menu_link_create']){
                this.system_role_btn_menu_link_create_status = this.userElements['system-role:btn_menu_link_create'].status;
                this.system_role_btn_menu_link_create_name = !!this.userElements['system-role:btn_menu_link_create'].name ? this.userElements['system-role:btn_menu_link_create'].name : "新增";
            }
            if(!!this.userElements['system-role:btn_menu_link_delete']){
                this.system_role_btn_menu_link_delete_name = !!this.userElements['system-role:btn_menu_link_delete'].name ? this.userElements['system-role:btn_menu_link_delete'].name : "删除";
                this.system_role_btn_menu_link_delete_status = this.userElements['system-role:btn_menu_link_delete'].status;
            }
            if(!!this.userElements['system-role:btn_menu_link_detail']){
                this.system_role_btn_menu_link_detail_name = !!this.userElements['system-role:btn_menu_link_detail'].name ? this.userElements['system-role:btn_menu_link_detail'].name : "详情";
                this.system_role_btn_menu_link_detail_status = this.userElements['system-role:btn_menu_link_detail'].status;
            }
            if(!!this.userElements['system-role:btn_menu_element_link']){
                this.system_role_btn_menu_element_link_name = !!this.userElements['system-role:btn_menu_element_link'].name ? this.userElements['system-role:btn_menu_element_link'].name : "页面元素";
                this.system_role_btn_menu_element_link_status = this.userElements['system-role:btn_menu_element_link'].status;
            }
            if(!!this.userElements['system-role:btn_menu_element_link_create']){
                this.system_role_btn_menu_element_link_create_name = !!this.userElements['system-role:btn_menu_element_link_create'].name ? this.userElements['system-role:btn_menu_element_link_create'].name : "新增";
                this.system_role_btn_menu_element_link_create_status = this.userElements['system-role:btn_menu_element_link_create'].status;
            }
            if(!!this.userElements['system-role:btn_menu_element_link_delete']){
                this.system_role_btn_menu_element_link_delete_name = !!this.userElements['system-role:btn_menu_element_link_delete'].name ? this.userElements['system-role:btn_menu_element_link_delete'].name : "删除";
                this.system_role_btn_menu_element_link_delete_status = this.userElements['system-role:btn_menu_element_link_delete'].status;
            }
        },
        computed: {
            ...mapGetters([
                'userElements'
            ])
        },
        methods: {
            elementChoice(item){
                if(item.checked){
                    this.handleElementLinkAdd(item);
                }else{
                    this.handleElementLinkDel(item);
                }
            },
            handleCheckChange(da, checked, indeterminate) {
                //let clist = this.$refs.menuTreeUnlink.getCheckedKeys();
                this.isDisable=true;
                let nodes = this.$refs.menuTreeUnlink.getCheckedNodes();
                var set = new Set();
                nodes.forEach(function (item) {
                    set.add(item.id);
                    if(!!item.parentId){
                        set.add(item.parentId);
                    }
                });
                this.menuLinkedQuery.roleId = this.roleId;
                this.menuLinkedQuery.menuIds = Array.from(set);
                this.batchSetLinkedMenu();
                this.menuLinkedQuery.menuIds = [];
            },
            getMenuTypeName(type) {
                let name = type;
                for(let option of this.typeMenuOptions){
                    if(option.key == type){
                        name = option.name;
                        break;
                    }
                }

                return name;
            },
            getMenuStatusName(status) {
                let name = status;
                for(let option of this.statusMenuOptions){
                    if(option.key == status){
                        name = option.name;
                        break;
                    }
                }

                return name;
            },
            getElementTypeName(type) {
                let name = type;
                for(let option of this.typeElementOptions){
                    if(option.key == type){
                        name = option.name;
                        break;
                    }
                }

                return name;
            },
            getElementStatusName(status) {
                let name = status;
                for(let option of this.statusElementOptions){
                    if(option.key == status){
                        name = option.name;
                        break;
                    }
                }

                return name;
            },
            renderLinkedMenuContent(h, { node, data, store }) {
                if(!!data){
                    return (
                        <span class="custom-tree-node" on-click={ () => this.handleMenuDetail(data, true) }>
                <span>{data.name}</span>
                    </span>);
                }
            },
            getMenuData() {
                this.meunDetailDatas = [];
                this.edit_role_menu_element_flag = false;
                this.elementLinkedData = [];
                this.elementUnlinkData = [];
                this.selectAllMenu();
            },
            selectAllMenu(){
                this.menuLinkedQuery.roleId = this.roleId;
                selectLinkedMenu(this.menuLinkedQuery).then(response => {
                    this.defaultcheckedkeys = [];
                    for(let option of response.data){
                        if(option.parentId != 0){
                            this.defaultcheckedkeys.push(option.id);
                        }
                    }
                    selectAllMenu(this.menuLinkedQuery).then(response => {
                        const code = response.code;
                        const mesg = response.msg;
                        const data = response.data;

                        let menuTree = buildTree(data);

                        this.menuLinkedData = menuTree;
                        this.menuLinkedLoading = false;
                    });
                });
            },
            selLinkedMenu(){
                this.menuLinkedQuery.roleId = this.roleId;
                selectLinkedMenu(this.menuLinkedQuery).then(response => {
                    this.defaultcheckedkeys = response.data;
                });
            },
            getUnlinkMenu() {
                this.menuUnlinkQuery.roleId = this.roleId;
                this.menuUnlinkLoading = true;
                selectUnlinkMenu(this.menuUnlinkQuery).then(response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const data = response.data;

                    let menuTree = buildTree(data);

                    this.menuUnlinkData = menuTree;
                    this.menuUnlinkLoading = false;
                });
            },
            setLinkedMenu() {
                createLinkedMenu(this.menuLinkedQuery)
                    .then(response => {
                        const code = response.code;
                        const mesg = response.msg;
                        const page = response.data;

                        this.getMenuData();

                        this.menuLinkedQuery.menuIds = [];
                    })
            },
            batchSetLinkedMenu() {
                batchCreateLinkedMenu(this.menuLinkedQuery).then(response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const result = response.data;
                    if(code == "S0000"){
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success',
                            duration: 2000
                        });
                    }else{
                        this.$notify({
                            title: '失败',
                            message: mesg,
                            type: 'error',
                            duration: 2000
                        });
                    };
                    this.isDisable=false;
                })
            },
            setUnlinkMenu() {
                removeLinkedMenu(this.menuUnlinkQuery)
                    .then(response => {
                        const code = response.code;
                        const mesg = response.msg;
                        const page = response.data;

                        this.getMenuData();

                        this.menuUnlinkQuery.menuIds = [];
                    })
            },
            getElementData() {
                this.edit_role_menu_element_flag = true;
                this.elementLinkedData = [];
                this.elementUnlinkData = [];

                this.getMenuElement();
            },
            getMenuElement() {
                this.elementLinkedQuery.roleId = this.roleId;
                this.elementLinkedQuery.menuId = this.selectMenuId;

                selectLinkedElement(this.elementLinkedQuery).then(response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const data = response.data;

                    for(let linkedData of data){
                        if(linkedData.isRelation == 1){
                            linkedData.checked = true;
                        }
                    }

                    this.elementLinkedData = data;
                    this.elementLinkedLoading = false;
                });
            },
            getUnlinkElement() {
                this.elementUnlinkQuery.roleId = this.roleId;
                this.elementUnlinkQuery.menuId = this.selectMenuId;

                this.elementUnlinkLoading = true;
                selectUnlinkElement(this.elementUnlinkQuery).then(response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const data = response.data;

                    this.elementUnlinkData = data;
                    this.elementUnlinkLoading = false;
                });
            },
            setLinkedElement() {
                createLinkedElement(this.elementLinkedQuery)
                    .then(response => {
                        const code = response.code;
                        const mesg = response.msg;
                        const page = response.data;

                        this.elementLinkedQuery.elementIds = [];
                    })
            },
            setUnlinkElement() {
                removeLinkedElement(this.elementUnlinkQuery)
                    .then(response => {
                        const code = response.code;
                        const mesg = response.msg;
                        const page = response.data;

                        this.elementUnlinkQuery.elementIds = [];
                    })
            },
            filterLinkedNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            filterUnlinkNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            getUnlinkNodeData(data) {
                this.meunDetailDatas = [data];
            },
            handleMenuLinkAdd(data) {
                this.menuLinkedQuery.roleId = this.roleId;
                this.menuLinkedQuery.menuIds.push(data.id);
                const index = this.menuUnlinkQuery.menuIds.indexOf(data.id);
                this.menuUnlinkQuery.menuIds.splice(index, 1);

                this.setLinkedMenu();
            },
            handleMenuLinkDel(data) {
                this.menuUnlinkQuery.roleId = this.roleId;
                this.menuUnlinkQuery.menuIds.push(data.id);
                const index = this.menuLinkedQuery.menuIds.indexOf(data.id);
                this.menuLinkedQuery.menuIds.splice(index, 1);

                this.setUnlinkMenu();
            },
            handleMenuDetail(data, flag) {
                if(this.system_role_btn_menu_element_link_status && flag){
                    this.link_role_menu_element_flag = flag;
                }

                select(data.id).then(response => {
                    const code = response.code;
                    const mesg = response.msg;
                    const data = response.data;

                    this.meunDetailDatas = [data];
                });

                this.selectMenuId = 0;
                this.edit_role_menu_element_flag = false;
                this.elementLinkedData = [];
                this.elementUnlinkData = [];
            },
            handleElementLink(menu) {
                this.selectMenuId = menu.id;

                this.getElementData();
            },
            handleElementLinkAdd(data) {
                this.elementLinkedQuery.roleId = this.roleId;
                this.elementLinkedQuery.menuId = this.selectMenuId;
                this.elementLinkedQuery.elementIds.push(data.id);
                const index = this.elementUnlinkQuery.elementIds.indexOf(data.id);
                this.elementUnlinkQuery.elementIds.splice(index, 1);

                this.setLinkedElement();
            },
            handleElementLinkDel(data) {
                this.elementUnlinkQuery.roleId = this.roleId;
                this.elementUnlinkQuery.menuId = this.selectMenuId;
                this.elementUnlinkQuery.elementIds.push(data.id);
                const index = this.elementLinkedQuery.elementIds.indexOf(data.id);
                this.elementLinkedQuery.elementIds.splice(index, 1);

                this.setUnlinkElement();
            },
        }
    }
</script>
