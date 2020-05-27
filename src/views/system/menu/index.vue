<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button type="primary" v-if="system_menu_btn_create_status" icon="el-icon-plus" @click="handleAdd">
            {{system_menu_btn_create_name}}
        </el-button>
        <el-button type="primary" v-if="system_menu_btn_update_status" icon="el-icon-edit" @click="handleEdit">
            {{system_menu_btn_update_name}}
        </el-button>
        <el-button type="primary" v-if="system_menu_btn_delete_status" icon="el-icon-delete" @click="handleDelete">
            {{system_menu_btn_delete_name}}
        </el-button>
      </el-button-group>
    </div>

    <el-row>
      <el-col :span="8" style='margin-top:15px;'>
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree
          class="filter-tree"
          :data="treeData"
          node-key="id"
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="menuTree"
          @node-click="getNodeData"
          >
        </el-tree>
      </el-col>
      <el-col :span="16" style='margin-top:15px;'>
         <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>菜单信息</span>
          </div>
          <el-form :label-position="labelPosition" label-width="80px" :model="form" :rules="rules" ref="form">
            <el-form-item v-if="formStatus != 'create'" label="序号" prop="id">
                <el-input v-model="form.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="父节点" prop="parentId">
                <el-input v-model="form.parentId" :disabled="true" placeholder="请输入父节点"></el-input>
            </el-form-item>
            <el-form-item label="编码" prop="code">
                <el-input v-model="form.code" :disabled="formEdit" placeholder="请输入编码"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" :disabled="formEdit" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入图标"></el-input>
            </el-form-item>
            <el-form-item label="路径" prop="path">
                <el-input v-model="form.path" :disabled="formEdit" placeholder="请输入链接"></el-input>
            </el-form-item>
            <el-form-item label="链接" prop="href">
                <el-input v-model="form.href" :disabled="formEdit" placeholder="请输入链接"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input v-model="form.order" :disabled="formEdit" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" v-model="form.description" :autosize="{ minRows: 3, maxRows: 5}" :disabled="formEdit" placeholder="请输入描述"> </el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select class="filter-item" v-model="form.status" placeholder="请输入状态">
                <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
              <el-button type="primary" @click="handleUpdate('form')">更新</el-button>
              <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
              <el-button type="primary" @click="handleCreate('form')">保存</el-button>
              <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
          </el-form>
         </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>页面元素</span>
          </div>
          <menu-element :menuId='currentId' ref="menuElement" :visible.sync="showElement"></menu-element>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  tree, select, create, remove, update
} from 'api/system/menu/index';
import {
    getDicInfo
} from "api/system/user/index";
import { mapGetters } from 'vuex';
export default {
  name: 'menu',
  components: {
    'menu-element': () => import('./components/element')
  },
  data() {
    return {
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
      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      showElement: false,
      listQuery: {
        filterText: undefined,
          status:1
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      formJsonStr:"",
      form: {
        parentId: undefined,
        code: undefined,
        name: undefined,
        icon: undefined,
        path: undefined,
        href: undefined,
        order: undefined,
        description: undefined,
        status: 1
      },
      rules: {
        code: [{
          required: true,
          message: '请输入编码',
          trigger: 'blur'
        },
        {
          min: 4,
          max: 32,
          message: '长度在2到32个字符',
          trigger: 'blur'
        }
        ],
        name: [{
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
        ],
        icon: [{
          max: 256,
          message: '长度要小于256个字符',
          trigger: 'blur'
        }
        ],
        path: [{
          required: true,
          message: '请输入路径',
          trigger: 'blur'
        },
        {
          min: 4,
          max: 256,
          message: '长度在4到256个字符',
          trigger: 'blur'
        }
        ],
        href: [{
          required: true,
          message: '请输入链接',
          trigger: 'blur'
        },
        {
          min: 4,
          max: 256,
          message: '长度在4到256个字符',
          trigger: 'blur'
        }
        ],
        order: [{
          required: true,
          message: '请输入排序的序号'
//          trigger: 'blur'
        },{
          pattern: /^[0-9]+$/,
          message: '必须为数字'
        }
        ]
      },
      currentId: 0,
      system_menu_btn_create_status: false,
      system_menu_btn_update_status: false,
      system_menu_btn_delete_status: false,

      system_menu_btn_create_name: "新增",
      system_menu_btn_update_name: "编辑",
      system_menu_btn_delete_name: "删除"
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  created() {
      if(!!this.userElements['system-menu:btn_create']){
          this.system_menu_btn_create_status = this.userElements['system-menu:btn_create'].status;
          this.system_menu_btn_create_name = !!this.userElements['system-menu:btn_create'].name ? this.userElements['system-menu:btn_create'].name : "新增";
      }
      if(!!this.userElements['system-menu:btn_update']){
          this.system_menu_btn_update_status = this.userElements['system-menu:btn_update'].status;
          this.system_menu_btn_update_name = !!this.userElements['system-menu:btn_update'].name ? this.userElements['system-menu:btn_update'].name : "编辑";
      }
      if(!!this.userElements['system-menu:btn_delete']){
          this.system_menu_btn_delete_status = this.userElements['system-menu:btn_delete'].status;
          this.system_menu_btn_delete_name = !!this.userElements['system-menu:btn_delete'].name ? this.userElements['system-menu:btn_delete'].name : "删除";
      }
    this.getTree();
      //this.getDictType();
  },
  computed: {
    ...mapGetters([
      'userElements'
    ])
  },
  methods: {
      getDictType(){
          getDicInfo('SYS_MENU_TYPE').then(response => {
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
    getTree() {
        this.listQuery.status=null;
      tree(this.listQuery).then(response => {
        const code = response.code;
        const mesg = response.msg;
        const data = response.data;

        this.treeData = data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update';
      }
      select(data.id).then(response => {
        const code = response.code;
        const mesg = response.msg;
        const data = response.data;

        this.form = data;
        this.formJsonStr = JSON.stringify(this.form);
      });
      this.currentId = data.id;
      this.showElement = true;
      this.$refs.menuElement.menuId = data.id;
      this.$refs.menuElement.getPage();
    },
    handleEdit() {
      if (this.form.id) {
        this.formEdit = false;
        this.formStatus = 'update';
      }
    },
    handleAdd() {
      this.resetForm();
      this.formEdit = false;
      this.formStatus = 'create';
    },
    handleDelete() {
        if (this.currentId == 0) {
            this.$notify({
                title: "提示",
                message: "请选择需要删除的菜单",
                type: "warning",
                duration: 2000
            });
            return;
        }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(this.currentId).then(() => {
          this.getTree();
          this.resetForm();
          this.onCancel();
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        });
      });
    },
    handleUpdate(formName) {
      if(JSON.stringify(this.form) === this.formJsonStr){
          this.$notify({
                      title: '警告',
                      message: '没有变更则不能提交',
                      type: 'warning',
                      duration: 2000
                  });
          return false;
      }
      const set = this.$refs;
      set[formName].validate(valid => {
          if (valid) {
              update(this.form.id, this.form).then(() => {
                  this.getTree();
                  this.$notify({
                      title: '成功',
                      message: '更新成功',
                      type: 'success',
                      duration: 2000
                  });
              });
          }else{
              return false;
          }
      });
    },
    handleCreate(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
            if (valid) {
                create(this.form).then(() => {
                    this.getTree();
                    this.$notify({
                        title: '成功',
                        message: '创建成功',
                        type: 'success',
                        duration: 2000
                    });
                });
            }else{
                return false;
            }
        });
    },
    handleCancel() {
      this.formEdit = true;
      this.formStatus = '';
    },
    resetForm() {
      this.form = {
        parentId: this.currentId,
        code: undefined,
        name: undefined,
        icon: undefined,
        path: undefined,
        href: undefined,
        order: undefined,
        description: undefined,
        status: 1
      };
    }
  }
}
</script>
