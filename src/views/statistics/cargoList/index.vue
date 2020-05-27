<template>
    <div class="app-container calendar-list-container">
          <div class="filter-container">
              <el-input style="width: 120px" class="filter-item" placeholder="请输入航班号" v-model="listQuery.flightNo"></el-input>
              <el-date-picker  class="filter-item"
                @change="checkTime"
                    v-model="listQuery.flightDate"
                    type="date"
                    placeholder="选择航班日期"
                    format="yyyy-MM-dd" value-format="yyyy-MM-dd">
              </el-date-picker>
              <el-date-picker  class="filter-item"
                               @change="checkTime"
                               v-model="listQuery.startTime"
                               type="date"
                               placeholder="开始日期"
                               format="yyyy-MM-dd"
                               value-format="yyyy-MM-dd">
              </el-date-picker>
              <el-date-picker  class="filter-item"
                 @change="checkTime"
                    v-model="listQuery.endTime"
                    type="date"
                    placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
              </el-date-picker>
              <el-radio-group  class="filter-item" v-model="listQuery.searchType">
                <el-radio-button label= 1 >可进场</el-radio-button>
                <el-radio-button label= 2>进场</el-radio-button>
                <el-radio-button label= 3 >缓冲区</el-radio-button>
                <el-radio-button label= 4 >已销号</el-radio-button>
              </el-radio-group>
<!--
              <el-checkbox  class="filter-item" v-model="today" label="今日" border  size="medium" @change="checkToday"></el-checkbox>
-->
              <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="getPage">查询</el-button>
        </div>
        <div class="filter-container" >
<!--
            <span v-if="total"> 总数：{{this.total}}</span>&nbsp;&nbsp;&nbsp;
-->
            <span> CBA数据比对成功:{{this.cbaTotal}}</span>
        </div>
     <el-table :data="listData"  style="width: 100%">
         <el-table-column  align="center" label="序号" width="50" type="index"> </el-table-column>
      <el-table-column  align="center" prop="cargoNo" label="载货清单" width="170"> </el-table-column>
      <el-table-column  align="center" prop="truckNo" label="车牌号" width="140"> </el-table-column>
      <el-table-column  align="center" prop="phone" label="手机号" width="140"> </el-table-column>
      <el-table-column  align="center" prop="agentName" label="代理" width="250"> </el-table-column>
      <el-table-column  align="center" prop="checkMachine" label="安检机" width="80"> </el-table-column>
         <el-table-column  width="80" align="center" label="是否散货">
             <template slot-scope="scope">
                 <span v-if="scope.row.bulk == 0"> 否</span>
                 <span v-if="scope.row.bulk == 1">是</span>
             </template>
         </el-table-column>
      <el-table-column  align="center" prop="seqNo" label="排队号" width="70"> </el-table-column>
      <el-table-column  align="center" prop="vip" label="VIP等级" width="80"> </el-table-column>
      <el-table-column  align="center" prop="approachTime" label="进场时间" width="160">
          <template slot-scope="scope">
              {{scope.row.approachTime | dateformat}}
          </template>
      </el-table-column>
      <el-table-column  align="center" prop="overTime" label="出场时间" width="160">
          <template slot-scope="scope">
              {{scope.row.overTime | dateformat}}
          </template>
      </el-table-column>
         <el-table-column align="center" label="操作" width="200">
             <template slot-scope="scope">
                 <el-button  size="small" type="warning" @click="showDialog(scope.row)">运单比对详情</el-button>
             </template>
         </el-table-column>
    </el-table>
    <!--<el-table :data="listData"  style="width: 100%" v-if="searchValue === 2">
        <el-table-column  align="center" label="序号" width="50" type="index"> </el-table-column>
      <el-table-column  align="center" prop="cargo_no" label="载货清单" width="150"> </el-table-column>
         <el-table-column  align="center" prop="awb_no" label="运单号" width="120"> </el-table-column>
         <el-table-column  align="center" prop="flight_date" label="航班日期" width="120"> </el-table-column>
         <el-table-column  align="center" prop="weight" label="重量KG" width="90"> </el-table-column>
      <el-table-column  align="center" prop="truck_no" label="车牌号" width="140"> </el-table-column>
      <el-table-column  align="center" prop="phone" label="手机号" width="140"> </el-table-column>
      <el-table-column  align="center" prop="agent_name" label="代理" width="200"> </el-table-column>
      <el-table-column  align="center" prop="check_machine" label="安检机" width="80"> </el-table-column>
      <el-table-column  align="center" prop="bulk" label="是否散货" width="80"> </el-table-column>
      <el-table-column  align="center" prop="seq_no" label="排队号" width="70"> </el-table-column>
      <el-table-column  align="center" prop="vip" label="VIP等级" width="80"> </el-table-column>
      <el-table-column  align="center" prop="approach_time" label="进场时间" width="160">
          <template slot-scope="scope">
              {{scope.row.approach_time | dateformat}}
          </template>
      </el-table-column>
      <el-table-column  align="center" prop="over_time" label="出场时间" width="160">
          <template slot-scope="scope">
              {{scope.row.over_time | dateformat}}
          </template>
      </el-table-column>
    </el-table>-->
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible"  width="1000px">
            <el-table :data="listAwb" ref="myTable" border="" fit="" highlight-current-row="" style="width: 100%">
                <el-table-column align="center" label="序号" width="100" type="index">
                </el-table-column>
                <el-table-column width="120" align="center" label="运单">
                    <template slot-scope="scope">
                        <span>{{scope.row.awbNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="160" align="center" label="航班号">
                    <template slot-scope="scope">
                        <span>{{scope.row.flightNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="160" align="center" label="航班日期">
                    <template slot-scope="scope">
                        <span>{{scope.row.flightDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="160" align="center" label="件数">
                    <template slot-scope="scope">
                        <span>{{scope.row.rcpNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="160" align="center" label="重量">
                    <template slot-scope="scope">
                        <span>{{scope.row.weight}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="120" align="center" label="比对结果">
                    <template slot-scope="scope">
                        <span><i v-if="scope.row.awbStatus == 0" class="el-icon-circle-close"></i></span>
                        <span><i v-if="scope.row.awbStatus == 1" class="el-icon-success"></i></span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

    </div>
</template>

<script>
    import {getAwbInfoList,statisticsInfo,getCBACount} from 'api/CargoNo/index';
    import {mapGetters} from 'vuex';
    export default {
        data() {
            return {
                dialogVisible:false,
                searchValue:1,
                cargoNo:undefined,
                listAwb:[],
                dialogVisible:false,
                dialogTitle: '',
                total:undefined,
                listData:[],
                listQuery:{
                    pageNo:1,
                    pageSize:10,
                    flightNo:undefined,
                    flightDate:undefined,
                    startTime:undefined,
                    endTime:undefined,
                    searchType: 2
                   
                }, 
                cbaTotal:"",
                today:true
            }
        },
        created(){
            let nowDate = new Date();
            let year = nowDate.getFullYear();
            let month = this.num(nowDate.getMonth() + 1);
            let day = this.num(nowDate.getDate());
            this.listQuery.flightDate = year + '-' + month + '-' + day;
            this.getPage();
        },
        computed: {
            ...mapGetters(["userElements"])
        },
        methods: {
            num(s) {
                return s < 10 ? '0' + s: s;
            },
            getPage() {
                statisticsInfo(this.listQuery).then(response => {
                    const page = response.data;
                    this.listData = page.data;
                    this.total = page.total;
                });
                getCBACount(this.listQuery).then(response => {
                    this.cbaTotal = response.data;
                });
            },
            
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getPage();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getPage();
            },
            checkToday(){
                if(this.today){
                    this.listQuery.startTime= undefined;
                    this.listQuery.endTime = undefined;
                }
            },

            checkTime(){
                if(this.listQuery.startTime || this.listQuery.endTime ){
                    this.today = false;
                }

            },
            showDialog(row){
                this.dialogVisible = true;
                this.cargoNo = row.cargoNo;
                getAwbInfoList(row.cargoNo).then(response => {
                    this.listAwb = response.data;
                });
            },

          
            
        }
      
    };
</script>


