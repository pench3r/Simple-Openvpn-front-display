Simple front-end display
---

#### 项目描述: ####

一个简单的单页面应用.该项目主要配合后端收集的openvpn日志信息来进行数据展示的。项目使用element ui(2.2.0)和VUE.js(2.5.2)进行构建, 主要功能通过后端的API获取数据，在前端展示;前端负责的功能有搜索、分页、局部数据异步更新等功能

#### 项目初始构建:

安装 vue-cli

    $ npm install --global vue-cli

使用 "webpack" 模板创建一个新项目

    $ vue init webpack my-project

安装依赖，然后开始！
  
    $ cd my-project
    $ npm run dev

#### 后端API: ####

通过IP获取对应服务器上运行的VPN实例，参数ip：

	http://wos.idc.com/get_label/10.0.251.126

	{"data": ["vpncms", "intervpntj"]}

	
通过label和IP获取指定的当前连接日志信息，参数ip、label、name：

	http://wos.idc.com/current/detail/10.0.251.126_vpncms/zhangsan

	{"data": [{"id": "c2b5316404ede6822b5f04c8a6f91878", "private_ip": "10.101.0.6", "public_ip": "110.199.189.112:8815", "time_stamp": "2018-05-10 12:41:49", "user_name": "zhangsan", "vpn_tag": "vpncms"}]}

获取当前连接期间的内网连接信息，参数ip、label、name：

	http://wos.idc.com/current/detail/10.0.251.126_vpnbjtj/zhangsan

	{"data": ["tcp 10.0.150.234:4138", "tcp 10.0.150.232:22"]}

通过label和ip获取指定的历史连接信息，参数ip、label:

	http://wos.idc.hexun.com:81/history/10.0.251.126_vpncms

	{"data": [{"id": "c2b5316404ede6822b5f04c8a6f91878", "private_ip": "10.101.0.6", "public_ip": "111.199.189.112:8815", "time_stamp": "2018-05-10 12:41:49", "user_name": "zhangsan", "vpn_tag": "vpncms"}]}

获取历史连接期间的内网连接信息，参数ip、label、name、private_ip、time-stamp：

	http://wos.idc.hexun.com:81/history/detail/10.0.251.126_vpnbjtj/zhangsan/10.8.0.34/2018-05-10%2011:12:01

	{"data": [{"dst_ip": "tcp 10.199.8.1:443", "time_stamp": "Thu, 10 May 2018 12:18:26 GMT"}]}


#### API接口配置 ####

src/App.vue

      vpnLabelApi: 'http://wos.idc.com/get_label/',
      currentApi: 'http://wos.idc.com/current/',
      currentDetailApi: 'http://wos.idc.com/current/detail/',
      historyApi: 'http://wos.idc.com/history/',
      historyDetailApi: 'http://wos.idc.com/history/detail/'

#### screenshot: ####

![openvpn](https://github.com/pench3r/Simple-Openvpn-front-display/blob/master/demo1.png)
