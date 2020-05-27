<template>
    <el-dialog :title="this.titleName" :visible.sync="visible" size="small" center :close-on-click-modal="false" @close="back()" append-to-body>
        <div>
            <el-form :model="item" :rules="rules" ref="item" label-width="120px">
                <el-row>
                    <!--<el-form-item label="id:" prop="id">-->
                        <!--<el-input v-model="item.id" style="width: 50%;" placeholder="请输入数据字典表id"> </el-input>-->
                    <!--</el-form-item>-->
                    <el-form-item label="数据字典编码:" prop="tag">
                        <el-input v-model="item.tag" style="width: 50%;" placeholder="请输入数据字典编码"> </el-input>
                    </el-form-item>
                    <el-form-item label="数据字典名称:" prop="name">
                        <el-input v-model="item.name" style="width: 50%;" placeholder="请输入数据字典名称"> </el-input>
                    </el-form-item>
                    <el-form-item label="数据字典状态:" prop="status">
                        <el-select v-model="item.status" style="width: 50%;" placeholder="请输入数据字典状态">
                            <el-option v-for="item in dictionaryOptions" :key="item.key" :label="item.name" :value="item.key"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据字典说明:" prop="remark">
                        <el-input type="textarea" v-model="item.remark" style="width: 80%;" placeholder="请输入数据字典说明"> </el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button v-if="nextcommit && system_dictionary_btn_nextcommit_status" @click="commitupdateNext('item')">{{system_dictionary_btn_nextcommit_name}}</el-button>
                <el-button v-if="addcommit && system_dictionary_btn_addcommit_status" @click="commit('item')">{{system_dictionary_btn_addcommit_name}}</el-button>
                <el-button v-if="addcommitnext && system_dictionary_btn_addcommitnext_status" @click="commitNext('item')">{{system_dictionary_btn_addcommitnext_name}}</el-button>
                <el-button v-if="updatecommit && system_dictionary_btn_updatecommit_status" @click="commitupdate('item')">{{system_dictionary_btn_updatecommit_name}}</el-button>
                <el-button @click="back">关闭</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import {
        create,selectSysDeptById,update
    } from "api/system/dictionary/index";

    import { mapGetters } from "vuex";
    export default {
        components: {
        },
        data() {
            return {
                addcommitnext:false,
                addcommit:false,
                nextcommit:false,
                updatecommit:false,
                titleName: "添加数据字典",
                item: {
                    id:undefined,
                    tag:undefined,
                    name:undefined,
                    status:undefined,
                    remark:undefined,
                    parentId:undefined,
                },
                dictionaryOptions: [
                    {key: '0', name: '无效'},
                    {key: '1', name: '有效'}
                ],
                visible: false,
                system_dictionary_btn_addcommit_status:false,
                system_dictionary_btn_addcommit_name:"保存",
                system_dictionary_btn_addcommitnext_status:false,
                system_dictionary_btn_addcommitnext_name:"保存",
                system_dictionary_btn_updatecommit_status:false,
                system_dictionary_btn_updatecommit_name:"保存",
                system_dictionary_btn_nextcommit_status:false,
                system_dictionary_btn_nextcommit_name:"保存",
                rules: {
                    tag: [
                        {
                            required: true,
                            message: '请输入数据字典编码',
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: '请输入数据字典名称',
                            trigger: 'blur'
                        }
                    ],
                    status: [
                        {
                            required: true,
                            message: '请选择数据字典状态',
                            trigger: 'blur'
                        }
                    ],
                    remark: [
                        {
                            required: true,
                            message: '请输入数据字典说明',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        created(){
            if(!!this.userElements['org_dictionary:btn_addcommit']){
                this.system_dictionary_btn_addcommit_status = this.userElements['org_dictionary:btn_addcommit'].status;
                this.system_dictionary_btn_addcommit_name = this.userElements['org_dictionary:btn_addcommit'].name ? this.userElements['org_dictionary:btn_addcommit'].name : "保存";
            }
            if(!!this.userElements['org_dictionary:btn_addcommitnext']){
                this.system_dictionary_btn_addcommitnext_status = this.userElements['org_dictionary:btn_addcommitnext'].status;
                this.system_dictionary_btn_addcommitnext_name = this.userElements['org_dictionary:btn_addcommitnext'].name ? this.userElements['org_dictionary:btn_addcommitnext'].name : "保存";
            }
            if(!!this.userElements['org_dictionary:btn_updatecommit']){
                this.system_dictionary_btn_updatecommit_status = this.userElements['org_dictionary:btn_updatecommit'].status;
                this.system_dictionary_btn_updatecommit_name = this.userElements['org_dictionary:btn_updatecommit'].name ? this.userElements['org_dictionary:btn_updatecommit'].name : "保存";
            }
            if(!!this.userElements['org_dictionary:btn_extcommit']){
                this.system_dictionary_btn_nextcommit_status = this.userElements['org_dictionary:btn_extcommit'].status;
                this.system_dictionary_btn_nextcommit_name = this.userElements['org_dictionary:btn_extcommit'].name ? this.userElements['org_dictionary:btn_extcommit'].name : "保存";
            }
        },
        computed: {
            ...mapGetters(["userElements"])
        },
        methods: {
            normalizer(node) {
                return {
                    id: node.id,
                    label: node.name,
                    children: node.children.length > 0 ? node.children : undefined
                }
            },
            resetTemp() {
                this.item ={
                    id:undefined,
                    tag:undefined,
                    name:undefined,
                    status:undefined,
                    remark:undefined,
                    parentId:undefined,
                };
                this.addcommit=false;
                this.updatecommit=false;
                this.nextcommit=false;
                this.addcommitnext=false;
            },
            commit(formName) {
                if (this.addcommit){
                    this.item.parentId=0;
                }
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        create(this.item).then(response => {
                            if (response.code === 'S0000') {
                                this.$notify({
                                    title: '提示',
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                if (this.addcommit) {
                                    this.$emit('changeClick', null)
                                }
                                if (this.nextcommit){
                                    this.$emit('changeNext', null)
                                }
                                this.visible = false;
                            }
                        })
                    }
                });
            },
            commitNext(formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        create(this.item).then(response => {
                            if (response.code === 'S0000') {
                                this.$notify({
                                    title: '提示',
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.$emit('changeNext',this.item.parentId);
                                this.visible = false;
                            }
                        })
                    }
                });
            },
            commitupdate(formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        update(this.item).then(response => {
                            if (response.code === 'S0000') {
                                this.$notify({
                                    title: '提示',
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                //this.getPageNext();
                                this.$parent.getPage();
                                this.visible = false;
                            }
                        })
                    }
                });
            },
            commitupdateNext(formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        update(this.item).then(response => {
                            if (response.code === 'S0000') {
                                this.$notify({
                                    title: '提示',
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.$emit('changeNext',this.item.parentId);
                                this.visible = false;
                            }
                        })
                    }
                });
            },
            getSysDeptById(id){
                this.item.id=id;
                selectSysDeptById(this.item.id).then(response => {
                        const code = response.code;
                        const mesg = response.msg;
                        const data = response.data;
                        this.item=data;
                    }
                )
            },
            back(){
                this.visible = false;
                this.resetTemp();
            }
        }
    }
</script>

