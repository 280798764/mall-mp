<!-- 智能增效页面 -->
<template>
  <div class="intelligent">
    <detail-head :headInfo="headInfo" :isOnline="backInfo.isOnline" :actName="backInfo.actName" :isEdit="false"></detail-head>
    <div class="intelligent-pattern">
      <p class="intelligent-title">运行模式</p>
      <div class="intelligent-image">
        <div>
          <img src="../../../static/images/ic_study.png" v-if="backInfo.runType === '不干预'">
          <img src="../../../static/images/ic_nonintervention.png" v-else>
          <p>不干预</p>
        </div>
        <div>
          <img src="../../../static/images/ic_study.png" v-if="backInfo.runType === '量产学习'">
          <img src="../../../static/images/ic_nonintervention.png" v-else>
          <p>量产学习</p>
        </div>
        <div>
          <img src="../../../static/images/ic_study.png" v-if="backInfo.runType === '量产优化'">
          <img src="../../../static/images/ic_nonintervention.png" v-else>
          <p>量产优化</p>
        </div>
      </div>
      <div class="intelligent-text">说明：自适应加工APP需对当前加工程序进行完整的学习后，才能进行量产优化。</div>
      <div class="intelligent-btn" @click="goOptimized">优化记录</div>
    </div>
    <div class="intelligent-material">
      <span>工件材质</span>
      <div>
        <picker @change="handlePickerChange" :value="index" :range="materialList" :range-key="'material'">
          <view class="picker">
            <span>{{backInfo.material}}</span>
            <span class="arrow"></span>
            <!-- 当前消息：{{ materialList[index].material }} -->
          </view>
        </picker>
      </div>
    </div>
    <div class="intelligent-pattern">
      <p class="intelligent-title">刀架型号</p>
      <div class="intelligent-table">
        <div class="table-head">
          <span>序号</span>
          <span>型号</span>
          <span>操作</span>
        </div>
        <div class="table-body" v-for="(item, index) in backInfo.list" :key="index">
          <div>{{index + 1}}</div>
          <div>{{item.knifeType}}</div>
          <div class="btn">
            <div @click="editKnife(item)"></div>
            <div @click="deleteKnife(item.id)"></div>
          </div>
        </div>
      </div>
      <div class="intelligent-btn" @click="addKnife">添加刀架</div>
    </div>
    <add-knife-rest v-if="isAdd" @cancel="cancel" @saveAdd="save" :knifeInfo="knifeInfo"></add-knife-rest>
    <common-confirm-dialog :pageInfo="dialogPageInfo" @resultClick="dialogClickResult"></common-confirm-dialog>
  </div>
</template>
<script>
import { INITIBOX_URL, ALIAS_URL, INSERT_KNIFE_URL, DELETE_KNIFE_URL, UPDATE_KNIFE_URL, MATERIAL_URL, MAKEINIT_URL } from "@/api/Intelligent.js"
import addKnifeRest  from '@/components/Dialog/addKnifeRest.vue'
import detailHead from '@/components/detailHead.vue'
import CommonConfirmDialog from '@/components/CommonModal'
import MininsDtail from "@/mixins/MixinsDtail.js"
export default {
  mixins: [MininsDtail],
  data() {
    return {
      isAdd: false,
      id: '',
      parameters: {
        iboxNo: ''
      },
      date: '',
      index: 0,
      materialList: [],
      backInfo: {},
      knifeInfo: {},
      dialogPageInfo: {
        isShow: false,
        title: '提示',
        content: '确认删除该刀架么',
        leftBtn: "取消",
        rightBtn: "确定",
        clickMaskHideDialog: false,
        isConfirmModal: true
      }
    }
  },
  components: {
    addKnifeRest,
    detailHead,
    CommonConfirmDialog
  },
  mounted() {
    this.parameters.iboxNo = this.$mp.query.machineNo
    this.getMakeInitByIboxNo()
    this.selectAliasByNo()
    this.getAllMaterial()
  },
  methods: {
    // 修改工件材质
    handlePickerChange (e) {
      this.index = e.mp.detail.value
      let materialCode = this.materialList[this.index].code
      let iboxNo = this.$mp.query.machineNo
      let parameters = {
        iboxNo,
        materialCode
      }
      this.$api.post(MAKEINIT_URL, parameters).then(backInfo => {
        console.log(backInfo)
        if (backInfo.isSuccess) {
          this.getMakeInitByIboxNo()
        }
      })
    },
    // 工件材质列表
    getAllMaterial () {
      this.$api.post(MATERIAL_URL).then(backInfo => {
        this.materialList = backInfo.response
      })
    },
    // 刀架添加
    save (knifeInfo) {
      let url  = knifeInfo.id ? UPDATE_KNIFE_URL : INSERT_KNIFE_URL
      let params = {
        iboxNo: this.parameters.iboxNo,
        knifeType: knifeInfo.knifeType
      }
      if (knifeInfo.id) {
        params.id = knifeInfo.id
      }
      this.$api.post(url, params).then(backInfo => {
        this.isAdd = false
        this.getMakeInitByIboxNo()
      })
    },
    // 删除刀架
    deleteKnife (id) {
      this.dialogPageInfo.isShow = true
      this.id = id
    },
    dialogClickResult (isConfirm) {
      if (isConfirm) {
        this.$api.post(DELETE_KNIFE_URL, {iboxNo: this.parameters.iboxNo, id: this.id}).then(backInfo => {
          this.getMakeInitByIboxNo()
        })
      }
    },
    // 获取详情
    getMakeInitByIboxNo () {
      this.$api.post(INITIBOX_URL, {iboxNo: this.parameters.iboxNo}).then(backInfo => {
        this.backInfo = backInfo.response
      })
    },
    // 修改刀架
    editKnife (item) {
      this.knifeInfo = item
      this.isAdd = true
    },
    addKnife () {
      this.knifeInfo = {}
      this.isAdd = true
    },
    // 取消新增编辑
    cancel (knifeType, knifeInfo) {
      if (knifeInfo.id) {
        this.isAdd = false
        this.knifeInfo.knifeType = knifeType
      } else {
        this.isAdd = false
      }
    },
    // 跳转优化记录
    goOptimized () {
      let params = {
        iboxNo: this.backInfo.iboxNo || '',
        actName: this.backInfo.actName || '',
        isOnline: this.backInfo.isOnline || '',
        aliasName: this.headInfo.aliasName || ''
      }
      this.$router.navigateTo("/pages/optimizeRecord/main", params);
    }
  }
}
</script>

<style lang="less" scoped>
.intelligent {
  padding: 16px 15px 36px 15px;
  font-size: 14px;
  background-color: #EDEDED;
}
.intelligent-pattern {
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px 3px #e4e4e4;
}
.intelligent-pattern .intelligent-title {
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 18px;
}
.intelligent-image {
  display: flex;
  align-items: center;
  justify-content: center;
}
.intelligent-image > div {
  margin-bottom: 15px;
  width: 85px;
  height: 100px;
  color: #535353;
  text-align: center;
  img {
    width: 100%;
    height: 85px;
  }
}
.intelligent-image > div:nth-of-type(2) {
  margin-left: 30px;
  margin-right: 30px;
}
.intelligent-text {
  margin-bottom: 20px;
  color: #777;
}
.intelligent-btn {
  margin: 20px auto 0;
  width: 204px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border-radius: 30px;
  background-color: #fbe059;
  box-shadow: 0 0 10px 3px #fdf1b3;
}
.intelligent-material {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 16px;
  color: #333;
  background-color: #fff;
  .arrow {
    display: inline-block;
    border-top: 2px solid;
    border-right: 2px solid;
    width: 10px;
    height: 10px;
    margin-left: 3px;
    border-color: #000;
    transform: rotate(45deg);
  }
}
.table-head {
  display: flex;
  padding: 10px 25px;
  background-color: #f3f8fd;
  border-radius: 30px;
  color: #535353;
  justify-content: space-between;
}
.table-head span:nth-of-type(1) {
  width: 70px;
}
.table-head span:nth-of-type(2) {
  flex: 2;
}
.table-head span:nth-of-type(3) {
  margin-right: 10px;
}
.table-body {
  display: flex;
  color: #535353;
  align-items: center;
  padding: 10px 25px;
}
.table-body > div:nth-of-type(1) {
  width: 70px;
  text-indent:  10px;
}
.table-body > div:nth-of-type(2) {
  flex: 2;
}
.btn {
  display: flex;
}
.btn div {
  width: 15px;
  height: 15px;
}
.btn > div:nth-of-type(1) {
  margin-right: 20px;
  background: url($STATIC_URL/ic_edit.png) no-repeat;
  background-size: cover;
}
.btn > div:nth-of-type(2) {
  background: url($STATIC_URL/ic_detele.png) no-repeat;
  background-size: cover;
}
</style>
