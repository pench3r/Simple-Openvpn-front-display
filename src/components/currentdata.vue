<template>
<div id="tabledata">
  <el-table v-loading="loadingstate" :data="showData" :row-key="getRowKeys" :expand-row-keys="expands" @row-click="updateItem" style="width: 1200px">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline v-for="conn_ip in connect_ip" :key="conn_ip.id">
          <el-form-item label="connect_ip" size="small" label-width="100px">
            <span>{{ conn_ip }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column prop="time_stamp" label="Date" align="left" width="230px"></el-table-column>
    <el-table-column prop="user_name" label="User_name" align="left" width="210px"></el-table-column>
    <el-table-column prop="private_ip" label="Private_ip" align="left" width="200px"></el-table-column>
    <el-table-column prop="public_ip" label="Public_ip" align="left" width="200px"></el-table-column>
    <el-table-column label="Vpn_tag" align="center" width="200px">
      <template slot-scope="scope">
        <el-tag type="success" close-transition>{{scope.row.vpn_tag}}</el-tag>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      layout="prev, pager, next, total"
      @current-change="handleIndexChange"
      :page-size="pagesize"
      :total="pagetotal">
  </el-pagination>
  {{tmpData}}
</div>
</template>

<script>

export default {
  name: 'currentTableData',
  props: {
    currentApi: {
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
      expands: [],
      pagesize: 8,
      pagetotal: 0,
      connect_ip: [],
      pageindex: 1,
      // tickEvent: '',
      activeState: null,
      showData: [],
      currentData: [],
      filterData: []
    }
  },
  activated: function () {
    console.log('current activated')
    this.activeState = true
  //  this.updateData(this.tag)
  // this.tickEvent = setTimeout(() => {   auto update
  //   this.updateData()
  // }, 5000)
  },
  deactivated: function () {
    console.log('current deactivated')
    this.activeState = false
  // clearTimeout(this.tickEvent)   auto update
  },
  methods: {
    filterName: function (value, row, column) {
      return row.user_name === value
    },
    updateItem: function (row) {
      // for get data when clicking each row
      var vm = this
      var url = this.detailApi + this.serIp + '_' + this.tag + '/'
      this.$http.get(url + row.user_name).then(function (response) {
        vm.connect_ip = JSON.parse(response.bodyText).data
      })
      if (row.id === this.expands[0]) {
        this.expands = []
      } else {
        this.expands = []
        this.expands.push(row.id)
      }
    },
    getRowKeys: function (row) {
      return row.id
    },
    handleIndexChange: function (index) {
      // implement paging
      this.pageindex = index
      var pageStart = (index - 1) * this.pagesize
      if (this.filterData.length > 0) {
        this.showData = this.filterData.slice(pageStart, pageStart + this.pagesize)
      } else {
        this.showData = this.currentData.slice(pageStart, pageStart + this.pagesize)
      }
    },
    updateData: function (tag, serIp) {
      if (this.activeState) {
        // get current data via ip and tag
        var vm = this
        this.$http.get(this.currentApi + serIp + '_' + tag).then(function (response) {
          vm.currentData = JSON.parse(response.bodyText).data
          vm.showData = vm.currentData.slice((vm.pageindex - 1) * vm.pagesize, vm.pageindex * vm.pagesize)
          vm.pagetotal = vm.currentData.length
          vm.loadingstate = false
        })// then(function () {   auto update
        // vm.tickEvent = setTimeout(() => {
        //   vm.updateData()
        // }, 5000)})
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
      // implements search by name and ip
      var key = this.search
      var vm = this
      vm.pageindex = 1
      if (key.length > 0) {
        if ('123456789'.indexOf(key[0]) === -1) {
          vm.filterData = this.currentData.filter(function (item) {
            return item.user_name.toLowerCase().indexOf(key.toLowerCase()) !== -1
          })
        } else {
          vm.filterData = this.currentData.filter(function (item) {
            return item.private_ip.toLowerCase().indexOf(key.toLowerCase()) !== -1
          })
        }
        vm.pagetotal = vm.filterData.length
        vm.showData = vm.filterData.slice(0, vm.pagesize)
        return console.log('search')
      } else {
        vm.filterData = []
        vm.pagetotal = vm.currentData.length
        vm.showData = vm.currentData.slice(0, vm.pagesize)
        return console.log('nothing search')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#tabledata {
  width: 1200px;
  margin-right: 12%;
  height: 78%;
  overflow: auto
}
</style>
