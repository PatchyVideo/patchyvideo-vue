### 这是一个基于 Vue 开发的东方 project 视频索引网站

域名： **[www.patchyvideo.com](www.patchyvideo.com)**

目前上线的版本基于 flask 框架开发，网站正常运作。

用户可登陆注册上传修改视频，以及对 Tag 的增删改除

> 完整项目详情可移至 [https://github.com/zyddnys/PatchyVideo](https://github.com/zyddnys/PatchyVideo)项目仓库查看
>
> >

感谢 zyddnys 的开源提供的后台接口，因目前本项目已经变成多人协作项目，需要详细开发流程进度，故在此标注

网页大致分为七个区域

- Home √
- Playlists X
- Post Viddeo X
- Tags X
- Deatil √
- Login \ sign Up√
- Users X

#### X:无进度

#### √:待完成

---

### 项目技术架构

插件：

- vue/cli-service
- vue/cli-plugin-babel
- vue/cli-plugin-router
- vue/cli-plugin-vuex
- vue/cli-plugin-element
- vue-infinite-scroll
- stylus
- jquery
- webpack

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

二、Deatil

1.数据的渲染  
2.localStorage 本地存储，支持新窗口打开和刷新

三、LogIn / Sign Up

1.路由守卫  
2.element-ui 图标美化  
3.LogIn 表单验证功能  
4.登录成功失败状态提示、登录功能实现

---

### 需要完善——

一、Home：

1.左侧 Tags 栏的颜色区分高亮、以及点击相应的 Tags 渲染筛选出的视频  
2.video-list 下具体跳转链接右侧，拥有复制功能的字体图标的添加  
3.视频排序  
4.导航栏处 Search 以及 Log out 功能的实现

二、Deatil

1.左侧 Tags 栏的颜色区分高亮、以及点击相应的 Tags 渲染筛选出的视频  
2.Edit Tags 样式位置调整  
3.Copies 和 Playlists 区的功能完善

三、LogIn / Sign Up

1. Sign Up 表单验证功能
2. 注册功能的实现
3. 登录功能的完善

---

### 用到接口——

方法均为 post

一、listvideo.do

输入：  


> page：数字，代表第几页

> page_size：数字，代表每页大小

输出：

> videos：视频数组

> count：总视频数

> page_count：总页数

> tags：关联 tag

二、query_tag_categories.do

输入：

> "tags":[{“touhou”，“xxxx”}] ：Tags

输出：

> categorie_map：Tag 所属分类

---

### 注意的点

本人为 vue 初学者实际开发中可能有多处考虑不周，设计模式上存在缺陷。还请多多包涵。如接任者觉得本方案不适用可自废另起新路。  
实际开发中采用的是 planA

> _plan A_

1.接口请求一次：为了防止多次请求接口 ①，在渲染 home 页面时，我并没有一次性获取全部视频数据。仅储存当前页面最多二十个最少一个的视频数据。当用户点击哪一页，就重新请求接口获取那一页的数据并渲染。

2.当前页面和之前页面的数据被保存在 vuex(可能会用到，不需要可以清除)和 localStorage 中

3.当用户点击 Deatil 跳转到其详细页面时，复用了 listvideo.do 接口
根据传递过去的 ID 值在 localStorage 中查询找到该视频并渲染

缺点： 点击相应的 Tags 渲染筛选出的视频和视频的排序功能 需要其他接口的支持才能实现。

_①_:因为接口 listvideo.do 中需要提交的数据 data 中 page 量是未知的（我无法事先得知视频总页数大小），如果要想获取全部数据可能需要请求第二次。

> _plan B_

接口请求两次：获得总视频数据，分页模块数组分割存储，这样用户点击下一页就不用在发起新请求。

优点： 点击相应的 Tags 渲染筛选出的视频和视频的排序功能 只需要一个接口就能实现。

缺点：数据量大，用户可能并不希望打开网页时就需要立即加载全部视频数据。

---

### 写在最后

网站在初期建设时，我刚结束 JS 部分的学习。  
起初群里招人时，似乎没人愿意胜任这份无薪酬的工作。  
我抱着学习尝试的态度加入了只有两人的开发群，
非常感谢 zyddnys 允许一个毫无经验的初学者来参与他的网站建设。  
zyddnys 最初的设计理念是偏向 Danbooru、 Gelbooru 风格的。  
我也是将他最开始的布局延展至今。

遗憾的是以我现有的拙劣水平尚不能穷尽这些美。  
从开始的茫然到制作的喜悦。
从两人的寂静到诸位的热闹。

我见证了从最初的两人演变至现在的三十八人。
我见证了宣传后的人们一齐涌入的热情。
我想我唯一的作用是让它稍微能入人眼目了，能让更多优秀的人寻着它，给它灿灿地生光、蓬勃地奋飞。

日新之谓盛德,生生之谓易

希望 patchyvideo 能留住这些好的故事
