<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="编码" v-model="listQuery.param.code"> </el-input>
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="角色名称" v-model="listQuery.param.name"> </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item"  v-if="system_role_btn_create_status"  style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-edit">
      {{$t('message.system.role.system_role_btn_create_name')}}
    </el-button>
    <el-radio-group class="filter-item" v-model="listQuery.param.status" style="float: right;" @change="handleStatusChange">
      <el-radio-button label="1">有效</el-radio-button>
      <el-radio-button label="0" color="danger">无效</el-radio-button>
    </el-radio-group>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="序号" width="110">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column width="200" align="center" label="编码">
      <template slot-scope="scope">
        <span>{{scope.row.code}}</span>
      </template>
    </el-table-column>
    <el-table-column width="200" align="center" label="角色名称">
      <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <!--<el-table-column width="200" align="center" label="图标">-->
      <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.icon}}</span>-->
      <!--</template>-->
    <!--</el-table-column>-->
    <el-table-column width="100px" align="center" label="状态">
      <template slot-scope="scope">
        <span>{{getStatusName(scope.row.status)}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" width="400" label="描述">
      <template slot-scope="scope">
        <span>{{scope.row.description}}</span>
      </template>
    </el-table-column>
    <el-table-column width="180" align="center" label="更新时间">
      <template slot-scope="scope">
        <span>{{scope.row.gmtModified | dateformat}}</span>
      </template>
    </el-table-column>
    <el-table-column width="200" align="center" label="更新人员">
      <template slot-scope="scope">
        <span>{{scope.row.modifier}}</span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" align="center" label="操作" width="280">
      <template slot-scope="scope">
        <el-button v-if="system_role_btn_update_status" size="small" type="success" @click="handleEdt(scope.row)">
          {{system_role_btn_update_name}}
        </el-button>
        <el-button v-if="system_role_btn_delete_status" size="small" type="danger" @click="handleDel(scope.row)">
          {{system_role_btn_delete_name}}
        </el-button>
        <el-button v-if="system_role_btn_menu_link_status" size="small" type="warning" @click="handleMenu(scope.row)">
          {{system_role_btn_menu_link_name}}
        </el-button>
       <!-- <el-button v-if="system_role_btn_element_link_status" size="small" type="primary" @click="handleElement(scope.row)">
          {{system_role_btn_element_link_name}}
        </el-button>-->
        <!--<el-button v-if="system_role_btn_merchant_link_status" size="small" type="warning" @click="handleMerchant(scope.row)">
          {{system_role_btn_merchant_link_name}}
        </el-button>-->
      </template>
    </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入编码"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <!--<el-form-item label="图标" prop="icon">-->
        <!--<el-input v-model="form.icon" placeholder="请输入图标"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="描述">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入描述" v-model="form.description"> </el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select class="filter-item" v-model="form.status" placeholder="请输入状态">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="handleCreate('form')">确 定</el-button>
      <el-button v-else type="primary" @click="handleUpdate('form')">确 定</el-button>
    </div>
  </el-dialog>
  <role-menu :roleId='currentId' :visible="showMenu" ref="roleMenu"></role-menu>
  <role-element :roleId='currentId' :visible="showElement" ref="roleElement"></role-element>
  <role-merchant :roleId='currentId' :visible="showMerchant" ref="roleMerchant"></role-merchant>
</div>
</template>

<script>
import {
  page, create, select, remove, update
} from 'api/system/role/index';
import {
  getDicInfo
} from "api/system/user/index";
import { mapGetters } from 'vuex';

export default {
  name: 'role',
  components: {
      'role-menu': () => import('./components/menu'),
      'role-element': () => import('./components/element'),
      'role-merchant': () => import('./components/merchant')
  },
  data() {
    return {
      showMenu: false,
      showElement: false,
      showMerchant: false,
      typeOptions: [
        //{key: '0', name: '其他'},
        //   { key: "10", name: "系统" },
        //   { key: "20", name: "供应商" },
        //   { key: "30", name: "电销" },
        //   { key: "40", name: "客服" }
      ],
      statusOptions: [
        {key: 0, name: '无效'},
        {key: 1, name: '有效'}
      ],
      form: {
        type: undefined,
        code: undefined,
        name: undefined,
        description: undefined,
        status: 1
      },
      rules: {
        code: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 32,
            message: '长度在2到32个字符',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 64,
            message: '长度在2到64个字符',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        param: {
          code: undefined,
          name: undefined,
          status: 1
        }
      },
      currentId: undefined,
      dialogFormVisible: false,
      dialogStatus: '',
      roleMenuVisible: false,
      system_role_btn_create_status: false,
      system_role_btn_update_status: false,
      system_role_btn_delete_status: false,

      system_role_btn_menu_link_status: false,
      system_role_btn_element_link_status: false,
        system_role_btn_merchant_link_status:true,
        system_role_btn_merchant_link_name:"关联商户",

      system_role_btn_create_name: "新增",
      system_role_btn_update_name: "编辑",
      system_role_btn_delete_name: "删除",

      system_role_btn_menu_link_name: "菜单",
      system_role_btn_element_link_name: "页面元素",

      textMap: {
        create: '创建',
        update: '编辑',
        delete: '删除'
      },
      tableKey: 0
    }
  },
  created() {
      if(!!this.userElements['system-role:btn_create']){
          this.system_role_btn_create_status = this.userElements['system-role:btn_create'].status;
          this.system_role_btn_create_name = this.userElements['system-role:btn_create'].name ? this.userElements['system-role:btn_create'].name : "新增";
      }
      if(!!this.userElements['system-role:btn_update']){
          this.system_role_btn_update_status = this.userElements['system-role:btn_update'].status;
          this.system_role_btn_update_name = this.userElements['system-role:btn_update'].name ? this.userElements['system-role:btn_update'].name : "编辑";
      }
      if(!!this.userElements['system-role:btn_delete']){
          this.system_role_btn_delete_status = this.userElements['system-role:btn_delete'].status;
          this.system_role_btn_delete_name = this.userElements['system-role:btn_delete'].name ? this.userElements['system-role:btn_delete'].name : "删除";
      }
      if(!!this.userElements['system-role:btn_menu_link']){
          this.system_role_btn_menu_link_status = this.userElements['system-role:btn_menu_link'].status;
          this.system_role_btn_menu_link_name = this.userElements['system-role:btn_menu_link'].name ? this.userElements['system-role:btn_menu_link'].name : "菜单";
      }
      if(!!this.userElements['system-role:btn_element_link']){
          this.system_role_btn_element_link_status = this.userElements['system-role:btn_element_link'].status;
          this.system_role_btn_element_link_name = this.userElements['system-role:btn_element_link'].name ? this.userElements['system-role:btn_element_link'].name : "页面元素";
      }

    this.getPage();
    //this.getDictType();
  },
  computed: {
    ...mapGetters([
      'userElements'
    ])
  },
  methods: {
      getDictType(){
          getDicInfo('SYS_ROLE_TYPE').then(response => {
              const code = response.appCode;
              const mesg = response.appMesg;
              const page = response.data;
              if (page != null) {
                  this.typeOptions = page;
                  let userTypeTmp = [];
                  if (this.typeOptions != null && this.typeOptions.length > 0) {
                      for (let item of this.typeOptions) {
                          userTypeTmp.push({key: item.tag+'', name: item.name});
                      }
                      this.typeOptions = userTypeTmp;
                  }
              }
          });
      },
    getTypeName(type) {
      let name = type;
      for(let option of this.typeOptions){
        if(option.key == type){
          name = option.name;
          break;
        }
      }

      return name;
    },
    getStatusName(status) {
      let name = status;
      for(let option of this.statusOptions){
        if(option.key == status){
          name = option.name;
          break;
        }
      }

      return name;
    },
    getPage() {
      this.listLoading = true;
      page(this.listQuery)
        .then(response => {
          const code = response.code;
          const mesg = response.msg;
          const page = response.data;

          this.list = page.data;
          this.total = page.total;
          this.listLoading = false;
        })
    },
    handleFilter() {
      this.getPage();
    },
    handleStatusChange() {
      this.getPage();
    },
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getPage();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getPage();
    },
    handleAdd() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleEdt(row) {
      select(row.id).then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
          this.getPage();
        });
    },
    handleDel(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            });
        });
    },
    handleMenu(row) {
      this.currentId = row.id;
      this.$refs.roleMenu.visible = true;
      this.$refs.roleMenu.roleId = row.id;
      this.$refs.roleMenu.getMenuData();
    },
    handleElement(row) {
        this.currentId = row.id;
        this.$refs.roleElement.visible = true;
        this.$refs.roleElement.roleId = row.id;
        this.$refs.roleElement.getElementData();
    },
      handleMerchant(row) {
          this.currentId = row.id;
          this.$refs.roleMerchant.visible = true;
          this.$refs.roleMerchant.roleId = row.id;
          this.$refs.roleMerchant.checked = false;
          this.$refs.roleMerchant.getAllCheckMerchant();
      },
    handleCreate(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          if(!this.form.status){
            this.form.status = 0;
          }
          create(this.form)
            .then((response) => {
                const code = response.code;
                const mesg = response.msg;
                const result = response.data;
                if(code == "S0000"){
                    this.dialogFormVisible = false;
                    this.getPage();
                    this.$notify({
                        title: '成功',
                        message: '创建成功',
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
                }
            })
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
          this.form.password = undefined;
          update(this.form.id, this.form).then((response) => {
              const code = response.code;
              const mesg = response.msg;
              if(code == "S0000"){
                  this.dialogFormVisible = false;
                  this.getPage();
                  this.$notify({
                      title: '成功',
                      message: '创建成功',
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
        code: undefined,
        name: undefined,
        icon: undefined,
        description: undefined,
        status: 1
      };
    }
  }
}
</script>
