<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="编码" v-model="listQuery.param.code"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="system_menu_element_btn_create_status" style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-edit">
        {{system_menu_element_btn_create_name}}
      </el-button>
      <el-radio-group class="filter-item" v-model="listQuery.param.status" style="float: right;" @change="handleStatusChange">
          <el-radio-button label="1">有效</el-radio-button>
          <el-radio-button label="0" color="danger">无效</el-radio-button>
      </el-radio-group>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="类型">
        <template slot-scope="scope">
          <span>{{getTypeName(scope.row.type)}}</span>
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
          <span>{{scope.row.updateAt | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="更新人员">
        <template slot-scope="scope">
          <span>{{scope.row.updateBy}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="system_menu_element_btn_update_status" size="small" type="success" @click="handleEdit(scope.row)">
            {{system_menu_element_btn_update_name}}
          </el-button>
          <el-button v-if="system_menu_element_btn_delete_status" size="small" type="danger" @click="handleDelete(scope.row)">
            {{system_menu_element_btn_delete_name}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="类型" prop="type">
           <el-select class="filter-item" v-model="form.type" placeholder="请输入类型">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.name" :value="item.key"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="href">
          <el-input v-model="form.href" placeholder="请输入链接"></el-input>
        </el-form-item>
        <el-form-item label="请求类型" prop="method">
          <el-select class="filter-item" v-model="form.method" placeholder="请输入请求类型">
            <el-option v-for="item in methodOptions" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入描述"> </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="filter-item" v-model="form.status" placeholder="请输入状态">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key" > </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="handleCreate('form')">确 定</el-button>
        <el-button v-else type="primary" @click="handleUpdate('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  page, create, select, remove, update
} from 'api/system/element/index';
import { mapGetters } from 'vuex';
export default {
  name: 'element',
  // props: {
  //   menuId: {
  //     default: '1'
  //   }
  // },
  data() {
    return {
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
      statusOptions: [
        {key: 0, name: '无效'},
        {key: 1, name: '有效'}
      ],
      typeOptions: [
        {key: '0', name: '其他'},
        {key: '10', name: '按钮'},
        {key: '20', name: '链接'}
      ],
      form: {
        menuId: undefined,
        type: undefined,
        code: undefined,
        name: undefined,
        icon: undefined,
        href: undefined,
        method: undefined,
        description: undefined,
        status: 1
      },
      formJsonStr:"",
      rules: {
        type: [{
          required: true,
          message: '请输入类型',
          trigger: 'blur'
        }
        ],
        code: [{
          required: true,
          message: '请输入编码',
          trigger: 'blur'
        },
        {
          min: 4,
          max: 64,
          message: '长度在4到64个字符',
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
        href: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        {
          min: 4,
          max: 256,
          message: '长度在4到256个字符',
          trigger: 'blur'
        }
        ],
        method: [{
          required: true,
          message: '请输入请求类型',
          trigger: 'blur'
        }
        ],
        description: [
        {
          max: 512,
          message: '长度要小于512个字符',
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
          menuId: this.menuId,
          status: 1
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      system_menu_element_btn_create_status: false,
      system_menu_element_btn_update_status: false,
      system_menu_element_btn_delete_status: false,

      system_menu_element_btn_create_name: "新增",
      system_menu_element_btn_update_name: "更新",
      system_menu_element_btn_delete_name: "删除",

      menuId: -1,
      textMap: {
        create: '元素-创建',
        update: '元素-编辑',
        delete: '元素-删除'
      },
      tableKey: 0
    }
  },
  created() {
      if(!!this.userElements['system-menu:btn_element_create']){
          this.system_menu_element_btn_create_status = this.userElements['system-menu:btn_element_create'].status;
          this.system_menu_element_btn_create_name = !!this.userElements['system-menu:btn_element_create'].name ? this.userElements['system-menu:btn_element_create'].name : "新增";
      }
      if(!!this.userElements['system-menu:btn_element_update']){
          this.system_menu_element_btn_update_status = this.userElements['system-menu:btn_element_update'].status;
          this.system_menu_element_btn_update_name = !!this.userElements['system-menu:btn_element_update'].name ? this.userElements['system-menu:btn_element_update'].name : "更新";
      }
      if(!!this.userElements['system-menu:btn_element_delete']){
          this.system_menu_element_btn_delete_status = this.userElements['system-menu:btn_element_delete'].status;
          this.system_menu_element_btn_delete_name = !!this.userElements['system-menu:btn_element_delete'].name ? this.userElements['system-menu:btn_element_delete'].name : "删除";
      }

    this.getPage();
  },
  computed: {
    ...mapGetters([
      'userElements'
    ])
  },
  methods: {
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
      this.listQuery.param.menuId = this.menuId;
      page(this.listQuery).then(response => {
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
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getPage();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getPage();
    },
    handleStatusChange() {
      this.getPage();
    },
    handleAdd() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleEdit(row) {
      select(row.id).then(response => {
        const code = response.code;
        const mesg = response.msg;
        const data = response.data;
        //(xuhui 2018.07.26)序列化form数据，用于提交时对比form数据是否有变化
        this.formJsonStr = JSON.stringify(data);
        this.form = data;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row.id).then(() => {
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
    handleCreate(formName) {
      const set = this.$refs;
      this.form.menuId = this.menuId;
      if(this.form.menuId == -1){
          this.$notify({
              title: "提示",
              message: "请选择菜单",
              type: "warning",
              duration: 2000
          });
          return;
      }
      set[formName].validate(valid => {
        if (valid) {
          create(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getPage();
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          })
        } else {
          return false;
        }
      });
    },
    handleCancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
    },
    handleUpdate(formName) {
      //(xuhui 2018.07.26)如果表单数据无变化则不能提交
      if(this.formJsonStr === JSON.stringify(this.form)){
          this.$notify({
              title: '警告',
              message: '数据无变化则不能更新',
              type: 'warning',
              duration: 2000
            });
          return false;
      }
      const set = this.$refs;
      //this.form.menuId = this.menuId;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          update(this.form.id, this.form).then(() => {
              this.dialogFormVisible = false;
                this.getPage();
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
              });
          });
        } else {
          return false;
        }
      });
    },
    resetTemp() {
      this.form = {
        menuId: undefined,
        type: undefined,
        code: undefined,
        name: undefined,
        icon: undefined,
        href: undefined,
        method: undefined,
        description: undefined,
        status: 1
      };
    }
  }
}
</script>
