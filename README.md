### 更新日志：
具体更新日志请查看commit

---

### 这是一个基于 Vue 开发的东方 project 视频索引网站

域名： **[www.patchyvideo.com](www.patchyvideo.com)**


第一版基于 flask 框架开发，第二版基于 vue 框架开发。网站正常运作。基于用户可登陆注册上传修改视频，以及对 Tag 的增删改除。
目前vue版重构正式完成并已上线。
> 完整项目详情（第一版）可移至 [https://github.com/zyddnys/PatchyVideo](https://github.com/zyddnys/PatchyVideo)项目仓库查看
>
> >

感谢 zyddnys 的开源提供的后台接口，因目前本项目已经变成多人协作项目，需要详细开发流程进度，故在此标注

网页大致分为九个区域

- Home 
- Deatil(Video) 
- Playlists 
- Detail(Playlists) 
- Create Playlists 
- Post Video 
- Tags 
- Login \ Sign Up \ resetpassword 
- Users 

---

### 项目技术架构

插件：

- vue/cli-service
- vue/cli-plugin-babel
- vue/cli-plugin-router
- vue/cli-plugin-vuex
- vue/cli-plugin-element
- vue-infinite-scroll
- Less
- jquery
- jquery-textcomplete（已经无用）
- textcomplete（已经无用）
- v-textcomplete（已经无用）
- webpack
- echarts
- font-awesome
- ipfs
- videostream
- vue-cropper

项目依赖：

- core-js
- element-ui
- vue
- vue-router
- vuex

开发依赖

- vue-temmplate-compiler

---

### 具体实现——

一、Home：

1.数据的渲染  
2.分页功能实现  
3.element-ui 排序美化  
4.导航栏处 Search 功能的完善

二、Deatil(Video & Playlists)

1.数据的渲染  
2.各个链接间的通道
3.Edit Tags 样式位置调整

三、Playlists

1.数据的渲染  
2.分页功能实现  
3.element-ui 排序美化

三、LogIn / Sign Up

1.路由守卫  
2.element-ui 图标美化  
3.LogIn 表单验证功能  
4.登录成功失败状态提示、登录功能实现

---

### 需要完善——

一、Home：

1.导航栏处 Search 功能的完善

二、Deatil(Video)

1.Edit Tags 样式位置调整

三、Playlists

1.由于标题可能会超过一行导致视频列表高度变高，从而导致排版不太好看

四、Detail(Playlists)

1.播放列表里链接的复制功能因为涉及到对 dom 的直接操作，所以可能会有被抓住漏洞的风险

五、Login \ sign Up

1.多处异地登录可能导致登录出现问题

---

### 未来可能会上线的功能——

〇、多语言支持

一、推荐视频页面（与东方推荐刊的联动）

二、网站 Wiki 搭建（各种功能及使用的详细说明）

三、利用 IPFS 实现被消除的视频的保存

---

### 用到接口——

日后会专门整理接口文档

---

### 注意的点

实际开发中可能有多处考虑不周，设计模式上存在缺陷。还请多多包涵。如觉得本方案不适用可自废另起新路。

一、链接复制功能

因为使用了 jQuery 对 dom 进行直接操作，所以可能会增加被入侵的风险

二、cookie 储存功能

为了保证登录状态在网站被刷新/出现打开的时候不被刷新，网站利用 cookie 对用户名和登录状态进行了储存

username: 储存的用户名

在页面渲染的时候 TopNavbar 组件会对 username 进行调用以确定用户的登录状态

但是由于 TopNavbar 是确定登录状态的必须组件，所以当页面不包含 TopNavbar 组件的时候需要注意是否会影响路由的逻辑判断

---

### 写在最后

一、

非常荣幸 能够参与到 patchyvideo 的网站建设。  
zyddnys 最初的设计理念是偏向 Danbooru、 Gelbooru 风格的。  
我也是将他最开始的布局延展至今。

遗憾的是以我现有的拙劣水平尚不能穷尽这些美。  
我想我唯一的作用是让它稍微能入人眼目了，能让更多优秀的人寻着它，给它灿灿地生光、蓬勃地奋飞。

日新之谓盛德,生生之谓易

希望 patchyvideo 能留住这些好的故事

written by suwadaimyojin

二、

说起来，自己认识东方才大概一年的时间。  
曾几何时，受到一些前辈的影响，“为东方做出一些自己的贡献”，这种想法愈加强烈。  
自己也一直在把这种想法付诸实现。

重新拾起 vue，或许还能凭着自己以前的开发经验，为东方做些什么，自己是这么想的。  
虽然前辈们的背影离自己是那么的遥远，但这从来不是松懈的理由。  
用 vue 重构网站的过程并不是一帆风顺，很多时候会遇到各种各样奇怪的问题，但自己坚信，现在的努力，是不会没有意义的。  
曾经 vocaloid 的粉丝们用自己的双手搭建出了 Mikufans，东方的粉丝们也一定可以做到同样的事情，甚至做的会更好。
如果每一个东方众都为东方做出自己的贡献的话，东方就会永远向前。  
前辈们教会了自己这个道理，希望大家也能一起向前，不仅仅是 patchyvideo，还有所有的，东方的回忆，  
都能被永远的铭记。

written by wrzrmzx(freesia)
