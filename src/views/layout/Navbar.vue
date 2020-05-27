<template>
<el-menu class="navbar" mode="horizontal">
  <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
  <levelbar></levelbar>
  <tabs-view></tabs-view>
  <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log>
  <screenfull class='screenfull'></screenfull>
  <!--<el-select class="language_bar" v-model="changLanguage" placeholder="全球" @change="selectLanguage">
    <el-option v-for="item in inLanguage" :key="item.key" :label="item.name" :value="item.key"></el-option>
  </el-select>-->
<!--
  <el-button class="download_bar" icon="el-icon-download" @click="goExportList()">下载管理</el-button>
-->
  <el-dropdown class="avatar-container" trigger="click">
    <div class="avatar-wrapper"> <img class="user-avatar" src="./head.png"> <i class="el-icon-caret-bottom"></i> </div>
    <el-dropdown-menu class="user-dropdown" slot="dropdown">
      <router-link class='inlineBlock' to="/">
        <el-dropdown-item> 首页 </el-dropdown-item>
      </router-link>
      <a>
        <el-dropdown-item><span @click="updatePassWords" style="display:block;">修改密码</span></el-dropdown-item>
      </a>
      <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

  <el-dialog :title="updatePassWordTitle" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="原密码" prop="passWord">
        <el-input type="passWord" v-model="form.passWord" placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassWord1">
        <el-input type="passWord" v-model="form.newPassWord1" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassWord2">
        <el-input type="passWord" v-model="form.newPassWord2" placeholder="请输入新密码"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel('form')">取 消</el-button>
      <el-button type="primary" @click="handleUpdate('form')">确 定</el-button>
    </div>
  </el-dialog>

  <exportList :visible="dialogExportList" ref="exportList"></exportList>
</el-menu>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import Levelbar from './Levelbar';
import TabsView from './TabsView';
import Hamburger from 'components/Hamburger';
import Screenfull from 'components/Screenfull';
import ErrorLog from 'components/ErrLog';
import errLogStore from 'store/errLog';
import {
  updatePassWord
} from 'api/auth/index';
import { removeToken } from 'utils/auth';
import exportList from '../components/asyncexport';

export default {
  components: {
    Levelbar,
    TabsView,
    Hamburger,
    ErrorLog,
    Screenfull,
    exportList
  },
  data() {
    return {
      changLanguage:'',
      inLanguage: [
        {key: 'en', name: '英语'},
        {key: 'cn', name: '中文'}
      ],
      log: errLogStore.state.errLog,
      form: {
        passWord: undefined,
        newPassWord1: undefined,
        newPassWord2: undefined
      },
      rules: {
        passWord: [
          {
            required: true,
            message: '请输入原密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 32,
            message: '长度在6到32个字符',
            trigger: 'blur'
          }
        ],
        newPassWord1: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 32,
            message: '长度在6到32个字符',
            trigger: 'blur'
          }
        ],
        newPassWord2: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 32,
            message: '长度在6到32个字符',
            trigger: 'blur'
          }
        ]
      },
      dialogFormVisible: false,
      dialogExportList:false,
      updatePassWordTitle:"修改密码"
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    selectLanguage(){
      if(this.changLanguage=='cn'){
        this.$i18n.locale = 'cn';
      }
      if(this.changLanguage=='en'){
        this.$i18n.locale = 'en';
      }
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogout')
        .then(() => {
            sessionStorage.clear()
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
    },
    updatePassWords() {
        this.dialogFormVisible = true;
    },
    handleCancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    handleUpdate(formName) {
      if(this.form.newPassWord1 != this.form.newPassWord2){
        this.$notify({
                      title: '警告',
                      message: '2次输入的新密码不一致',
                      type: 'warning',
                      duration: 2000
                  });
        return;
      }

      if(null == this.form.newPassWord1 || "" == this.form.newPassWord1 || undefined == this.form.newPassWord1){
        return;
      }

      this.$confirm('确定修改密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
          const set = this.$refs;
          set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            updatePassWord(this.form.passWord,this.form.newPassWord1).then(response => {
              const code = response.code;
              const mesg = response.msg;
              this.dialogFormVisible = false;
              //modify by fushuan 2019.01.19 修改密码后 移除token 跳转到登录界面。
                this.$notify({
                title: '密码修改成功,请重新登录',
                message: mesg,
                type: 'success',
                duration: 2000
              });
              removeToken();
              this.$router.push({path:'/login'})
              //add by fushuan 2019.01.19 修改密码后 移除token 跳转到登录界面。
            });
          } else {
            return false;
          }
        });
      });
    },
    goExportList(){
      this.$refs.exportList.pageInit();
      this.$refs.exportList.exportListVisible=true;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0 !important;
    .hamburger-container {
        line-height: 58px;
        height: 50px;
        float: left;
        padding: 0 10px;
    }
    .errLog-container {
        display: inline-block;
        position: absolute;
        right: 150px;
    }
    .screenfull {
        position: absolute;
        right: 90px;
        top: 16px;
        color: red;
    }
    .download_bar {
      position: absolute;
      right: 127px;
      width: 120px;
      top: 10px;
    }
  .language_bar {
    position: absolute;
    right: 254px;
    width: 120px;
    top: 1px;
  }
    .avatar-container {
        height: 50px;
        display: inline-block;
        position: absolute;
        right: 35px;
        .avatar-wrapper {
            cursor: pointer;
            margin-top: 5px;
            position: relative;
            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 10px;
            }
            .el-icon-caret-bottom {
                position: absolute;
                right: -20px;
                top: 25px;
                font-size: 12px;
            }
        }
    }
}
</style>
