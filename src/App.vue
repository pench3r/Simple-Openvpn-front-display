<template>
  <div id="app">
    <el-container class="container-main">
      <el-container>
        <el-aside style="width: 18%; border: 1px solid; min-width: 200px">
          <el-menu default-active="1" text-color="#E7E7E7" background-color="#2A3F54">
            <el-menu-item index="1" @click="toTarget">
              <i class="el-icon-tickets"></i>
              天津联通-10.0.251.126
            </el-menu-item>
            <el-menu-item index="2" @click="toTarget">
              <i class="el-icon-tickets"></i>
              天津电信-10.0.90.244
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container style="width: 85%; display: block; margin-left: 8%; min-height: 300px">
          <el-breadcrumb style="font-size: 150%; height: 8%; margin-top: 1.5%" separator="/">
            <el-breadcrumb-item>{{serverIp}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{dataType}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{vpnTag}}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-container>
            <el-row>
            <strong>vpn_tag: </strong>
            <el-select v-model="vpnTag" @change="updateVpnTag" placeholder="请选择">
              <el-option v-for="tag in vpnTags" :key="tag" :label="tag" :value="tag"></el-option>
            </el-select>
            </el-row>
          </el-container>
          <el-row>
          <strong>search:&nbsp;&nbsp;</strong>
          <el-input placeholder="input user_name or private_ip ..." class="table-search" v-model="searchQuery" style="width: 20%; display: inline-block"></el-input>
          </el-row>
          <el-row style="margin-right: 15%; margin-top: 1%; width: 1228px">
          <el-col :span="19">
            <el-radio-group v-model="dataType" @change="updateVpnTag">
              <el-radio-button label="current">current</el-radio-button>
              <el-radio-button label="history">history</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="4">
          <el-button type="primary" @click="parentUpdate">Update</el-button>
          </el-col>
          </el-row>
          <el-main class="table-data-main" style="height: 82%; overflow: auto">
            <keep-alive>
            <history-table-component ref="historytable" :ser-ip="serverIp" :search-key="searchQuery" :history-api="historyApi" :detail-api="historyDetailApi" :tag="vpnTag" v-if="dataType === 'history'"></history-table-component>
            <current-table-component ref="currentable" :ser-ip="serverIp" :search-key="searchQuery" :current-api="currentApi" :detail-api="currentDetailApi" :tag="vpnTag" v-else></current-table-component >
            </keep-alive>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import currentTableData from './components/currentdata'
import historydata from './components/historydata'

export default {
  name: 'App',
  components: {
    'current-table-component': currentTableData,
    'history-table-component': historydata
  },
  data () {
    return {
      searchQuery: '',
      dataType: 'current',
      serverIp: '10.0.251.126',
      vpnTags: [],
      vpnTag: '',
      vpnLabelApi: 'http://wos.idc.hexun.com:81/get_label/',
      currentApi: 'http://wos.idc.hexun.com:81/current/',
      currentDetailApi: 'http://wos.idc.hexun.com:81/current/detail/',
      historyApi: 'http://wos.idc.hexun.com:81/history/',
      historyDetailApi: 'http://wos.idc.hexun.com:81/history/detail/'
    }
  },
  created: function () {
    this.getLabel()
  },
  methods: {
    updateVpnTag: function () {
      this.parentUpdate()
    },
    getLabel: function () {
      // get the vpn label
      var vm = this
      this.$http.get(this.vpnLabelApi + this.serverIp).then(function (response) {
        vm.vpnTags = JSON.parse(response.bodyText).data
        vm.vpnTag = vm.vpnTags[0]
        vm.parentUpdate()
      })
    },
    toTarget: function (event) {
      var el = event.$el
      // get the content of the click tag
      this.serverIp = el.innerText.split('-')[1]
      this.getLabel()
    },
    parentUpdate: function () {
      if (this.dataType === 'current') {
        // calling a child component function in a parent component
        this.$refs.currentable.updateData(this.vpnTag, this.serverIp)
      } else {
        this.$refs.historytable.updateData(this.vpnTag, this.serverIp)
      }
    }
  }
}
</script>

<style>
body {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  color: #73879C;
}
.el-menu {
  border: 1px solid;
}
.container-main {
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
.el-header {
  text-align: center;
  vertical-align: middle;
  border: 1px solid;
  color: #9ad3de;
}
.el-aside {
  width: 18%;
  height: auto;
  margin-right: 0;
  background: #2A3F54;
}
.table-data-main {
  padding-top: 2%;
}
.table-search {
  width: 10%;
  margin-bottom: 20px;
  display: block;
  margin-top: 2%;
}
.el-table__header-wrapper {
  overflow: unset;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}
</style>
