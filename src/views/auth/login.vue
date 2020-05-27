<template>
<div class="login-container">
  <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
    <h3 class="title">海关大屏展示管理系统</h3>
    <el-form-item prop="username">
      <span class="svg-container"><icon-svg icon-class="login-account"></icon-svg></span>
      <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="账户"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <span class="svg-container"><icon-svg icon-class="login-password"></icon-svg></span>
      <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="codeImg" style="width:215px;float:left;">
      <span class="svg-container"><icon-svg icon-class="login-checked"></icon-svg></span>
      <el-input style="width:150px;" name="codeImg" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.codeImg" autoComplete="on" placeholder="验证码"></el-input>
    </el-form-item>
    <img :src="img" style="width:100px;height:40px;margin-top:5px;margin-left:15px;" title="点击更换" @click="codeMaker">
    <el-form-item style="margin-top: 22px;">
      <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
        登录
      </el-button>
    </el-form-item>
  </el-form>

  <el-dialog title="第三方验证" :visible.sync="showDialog">
    邮箱登录成功,请选择第三方验证
    <social-sign></social-sign>
  </el-dialog>

</div>
</template>

<script>
import socialSign from './socialsignin';
//import {login} from './api/auth/index';
export default {
  components: {
    socialSign
  },
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        callback();
      }
    };
    return {
      img: undefined,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{
          required: true,
          message: '账户不能为空',
          trigger: 'blur'
        }],
        codeImg: [{
          required: true,
          message: '验证码不能为空',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePass
        }]
      },
      loading: false,
      showDialog: false
    }
  },
  methods: {
    codeMaker() {
      this.$store.dispatch('CodeMaker').then(Response => {
        this.img = Response.codeImg;
        if(this.img==null || this.img==''){
            window.setTimeout(() => {
                this.codeMaker()
            }, 15000);
        }
      }).catch(() => {
        window.setTimeout(() => {
            this.codeMaker()
        }, 15000);
        this.loading = false;
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;//CodeImgLogin
          this.$store.dispatch('CodeImgLogin', this.loginForm).then(() => {
            this.loading = false;
            this.$router.push({
              path: '/'
            });
            // this.showDialog = true;
          }).catch(() => {
            this.codeMaker();
            this.loading = false;
          });
        } else {
          console.log('error submit!!');
          this.codeMaker();
          return false;
        }
      });
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1);
      // const hashObj = getQueryObject(hash);
      // const originUrl = window.location.origin;
      // history.replaceState({}, '', originUrl);
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // };
      // const codeName = hashObj[codeMap[this.auth_type]];
      // if (!codeName) {
      //   alert('第三方登录失败');
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' });
      //   });
      // }
    }
  },
  created() {
    this.codeMaker();
    // window.addEventListener('hashchange', this.afterQRScan);
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan);
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
.tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 5px;
}

.login-container {
    @include relative;
    height: 100vh;
    background-color: #2d3a4b;
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
        -webkit-text-fill-color: #fff !important;
    }
    input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: #eeeeee;
        height: 47px;
    }
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
    }
    .svg-container {
        padding: 6px 5px 6px 15px;
        color: #889aa4;
    }
    .title {
        font-size: 26px;
        font-weight: 400;
        color: #eeeeee;
        margin: 0 auto 40px;
        text-align: center;
        font-weight: bold;
    }
    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 400px;
        padding: 35px 35px 15px;
        margin: 120px auto;
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
    .forget-pwd {
        color: #fff;
    }
}
</style>
