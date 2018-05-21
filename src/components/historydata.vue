<template>
<div id="historydata">
  <el-table v-loading="loadingstate" :data="showData" :row-key="getRowKeys" :expand-row-keys="expands" @row-click="updateItem" style="width: 1200px">
    <el-table-column type="expand">
      <div>
      <table style="border: 1">
        <tr>
          <th class="cell">connect_time</th>
          <th class="cell">target_ip</th>
        </tr>
        <tr  v-for="info in detailData" :key="info.id">
          <td class="cell">{{info.time_stamp}}</td>
          <td class="cell">{{info.dst_ip}}</td>
        </tr>
      </table>
      </div>
    </el-table-column>
    <el-table-column prop="time_stamp" label="Date" align="left" width="230px"></el-table-column>
    <el-table-column prop="user_name" label="User_name" width="210px"></el-table-column>
    <el-table-column prop="private_ip" label="Private_ip" width="200px"></el-table-column>
    <el-table-column prop="public_ip" label="Public_ip" align="left" width="200px"></el-table-column>
    <el-table-column label="Vpn_tag" align="center" width="200px">
      <template slot-scope="scope">
        <el-tag type="success" close-transition>  {{scope.row.vpn_tag}}</el-tag>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      layout="prev, pager, next, total"
      @current-change="handleIndexChange"
      :page-size="pagesize"
      :total="pagetotal">
  </el-pagination>
  {{ tmpData }}
</div>
</template>

<script>

export default {
  name: 'historydata',
  props: {
    historyApi: {
      type: String
    },
    detailApi: {
      type: String
    },
    tag: {
      type: String
    },
    searchKey: {
      type: String
    },
    serIp: {
      type: String
    }
  },
  data () {
    return {
      loadingstate: true,
      search: this.searchKey,
      pagesize: 8,
      pagetotal: 20,
      expands: [],
      activeState: null,
      // tickEvent: '',
      pageindex: 1,
      showData: [],
      detailData: [],
      detailData1: [],
      historyData: [],
      filterData: []
    }
  },
  created: function () {
    var vm = this
    this.$http.get(this.historyApi + this.serIp + '_' + this.tag).then(function (response) {
      vm.historyData = JSON.parse(response.bodyText).data
      vm.showData = vm.historyData.slice((vm.pageindex - 1) * vm.pagesize, vm.pageindex * vm.pagesize)
      vm.pagetotal = vm.historyData.length
      vm.loadingstate = false
    })
  },
  deactivated: function () {
    console.log('history deactivated')
    this.activeState = false
  // clearTimeout(this.tickEvent)  auto update
  },
  activated: function () {
    console.log('history activated')
    this.activeState = true
  //  this.updateData(this.tag)
  //  this.updateData()
  // this.tickEvent = setTimeout(() => {  auto update
  //   this.updateData()
  // }, 5000)
  },
  methods: {
    getRowKeys: function (row) {
      return row.id
    },
    updateItem: function (row) {
      // for get data when clicking each row
      if (row.id === this.expands[0]) {
        this.expands = []
      } else {
        this.expands = []
        this.expands.push(row.id)
      }
      var vm = this
      this.$http.get(this.detailApi + this.serIp + '_' + this.tag + '/' + row.user_name + '/' + row.private_ip + '/' + row.time_stamp).then(function (response) {
        vm.detailData = JSON.parse(response.bodyText).data
      })
    },
    updateData: function (tag, serIp) {
      if (this.activeState) {
        // Get historical data via ip and tag
        var vm = this
        this.$http.get(this.historyApi + serIp + '_' + tag).then(function (response) {
          vm.historyData = JSON.parse(response.bodyText).data
          vm.showData = vm.historyData.slice((vm.pageindex - 1) * vm.pagesize, vm.pageindex * vm.pagesize)
          vm.pagetotal = vm.historyData.length
          vm.loadingstate = false
        })// .then(function () {  auto update
        // vm.tickEvent = setTimeout(() => {
        //   vm.updateData()
        // }, 5000) })
      }
    },
    handleIndexChange: function (index) {
      // implement paging
      this.pageindex = index
      var pageStart = (index - 1) * this.pagesize
      if (this.filterData.length > 0) {
        this.showData = this.filterData.slice(pageStart, pageStart + this.pagesize)
      } else {
        this.showData = this.historyData.slice(pageStart, pageStart + this.pagesize)
      }
    }
  },
  watch: {
    searchKey: function (val) {
      // Receive data from the parent component
      this.search = val
    }
  },
  computed: {
    tmpData: function () {
      // implement search by ip and name
      var key = this.search
      var vm = this
      if (key.length > 0) {
        if ('123456789'.indexOf(key[0]) === -1) {
          vm.filterData = this.historyData.filter(function (item) {
            return item.user_name.toLowerCase().indexOf(key.toLowerCase()) !== -1
          })
        } else {
          vm.filterData = this.historyData.filter(function (item) {
            return item.private_ip.toLowerCase().indexOf(key.toLowerCase()) !== -1
          })
        }
        vm.pagetotal = vm.filterData.length
        vm.showData = vm.filterData.slice(0, vm.pagesize)
        return console.log('search')
      } else {
        vm.filterData = []
        vm.pagetotal = vm.historyData.length
        vm.showData = vm.historyData.slice(0, vm.pagesize)
        return console.log('nothing search')
      }
    }
  }
}

</script>

<style scoped>
#historydata {
  width: 1200px;
  margin-right: 12%;
  height: 78%;
  overflow: auto;
}
.el-table {
  overflow: unset;
}
</style>
