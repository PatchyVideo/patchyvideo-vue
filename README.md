<p align="center">
  <img src="https://raw.githubusercontent.com/PatchyVideo/patchyvideo-vue/master/public/favicon.png" alt="Logo" width="72" height="72">
</p>

<h3 align="center">PatchyVideo-Vue</h3>

<p align="center">
  <img alt="Commit activity" src="https://img.shields.io/github/commit-activity/m/PatchyVideo/patchyvideo-vue" />
  <img alt="Version" src="https://img.shields.io/github/package-json/v/PatchyVideo/patchyvideo-vue">
  <img alt="Code size" src="https://img.shields.io/github/languages/code-size/PatchyVideo/patchyvideo-vue">
  <img alt="Contributors" src="https://img.shields.io/github/contributors/PatchyVideo/patchyvideo-vue" />
  <img alt="License" src="https://img.shields.io/github/license/PatchyVideo/patchyvideo-vue" />
</p>

这是一个基于 Vue 开发的 东方 Project 视频索引网站。

目前部署在：[https://thvideo.tv/](https://thvideo.tv/) | [https://patchyvideo.com/](https://patchyvideo.com/)

Wiki：[https://patchyvideo.wiki/](https://patchyvideo.wiki/)

第一版基于 Flask 框架开发，第二版基于 Vue 框架开发。网站目前正常运作。
基于用户可登陆注册上传修改视频，以及对 Tag 的增删改除，目前 Vue 版重构正式完成并已上线。

> 后端/第一版可至 [PatchyVideo/PatchyVideo](https://github.com/PatchyVideo/PatchyVideo) 查看
> 移动端可至 [PatchyVideo/patchyvideo-mobile](https://github.com/PatchyVideo/patchyvideo-mobile) 查看

同时感谢 zyddnys 提供的开源后端接口，让此项目的出现和运营成为可能。

## 网页架构

网页目前大致分为六个区域：

### 主架

- Home：主页/订阅
- 404：错误页

### 视频相关

- Deatil：视频详情页
- PostVideo：发布视频页

### 标签相关

- Edittag：编辑标签页
- ContributionLogs：标签编辑历史/排榜

### 播放列表相关

- Lists：播放列表页
- ListDetail：播放列表详情页
- CreateVideoList：创建播放列表页

### 讨论板相关

- Forum：讨论板主页
- ForumDetail：板块详情页
- ThreadDetail：帖子详情页

### 用户相关

- Login：登录页
- SignUp：注册页
- ResetPassword：重置密码页
- ForgetPassword：找回密码页
- User：用户页

## 项目依赖表

在这里列出本项目使用的开源项目，同时感谢这些项目作者的付出。

- eslint：代码分析
  - eslint-plugin-prettier：Prettier 插件
  - eslint-plugin-vue：Vue 插件
  - babel-eslint：Babel 插件
  - lint-staged：提交审查
- prettier：格式化
- webpack-bundle-analyzer：大小分析
- vue：框架
- vue-router：路由
  - vue-temmplate-compiler：动态路由
- vuex：数据存储
- @vue/cli-service：Vue CLI
  - @vue/cli-plugin-router：Router
  - @vue/cli-plugin-vuex：Vuex
  - @vue/cli-plugin-element：Element
  - @vue/cli-plugin-babel：Babel
  - @vue/cli-plugin-eslint：ESLint
- element-ui：组件库
- vue-i18n：国际化
  - @kazupon/vue-i18n-loader：Loader
- axios：数据获取
  - vue-axios：Vue 适配
- jquery：滚动动画和一些 DOM 操作
- moment: 日期格式化
- less-loader：Less 样式
- font-awesome：图标
- echarts：统计图表
- vue-cropper：上传头像裁剪
- vue-linkify：链接转换
- html-entities：HTML 编码
- markdown-it：Markdown 渲染
  - markdown-it-abbr：缩写
  - markdown-it-container：框
  - markdown-it-deflist：列表
  - markdown-it-footnote：脚注
  - markdown-it-ins：更改
  - markdown-it-mark：标记
  - markdown-it-sub：下标
  - markdown-it-sup：上标
- highlight.js：代码高亮

## 未来可能会上线的功能（卫星）

- 多语言完善
- 推荐视频页面（与东方推荐刊的联动）
- 被消除的视频的保存

## 用到的接口

日后会专门整理接口文档

## 注意事项

注：实际开发中可能有多处考虑不周，设计模式上存在缺陷。还请多多包涵。如觉得本方案不适用可自废另起新路。

一、链接复制功能

因为使用了 jQuery 对 dom 进行直接操作，所以可能会增加被入侵的风险。

二、cookie 储存功能

为了保证登录状态在网站被刷新/出现打开的时候不被刷新，网站利用 cookie 对用户名和登录状态进行了储存。

username: 储存的用户名

在页面渲染的时候 TopNavbar 组件会对 username 进行调用以确定用户的登录状态。

但是由于 TopNavbar 是确定登录状态的必须组件，所以当页面不包含 TopNavbar 组件的时候需要注意是否会影响路由的逻辑判断。

## 关于贡献

你可以按照以下的说明为本项目提供贡献。

### 一些注意事项

1. 所有贡献建议先从开个 Issue 表明自己的想法开始，如果条件受限可以加群讨论。
2. 请从 dev 分支 fork 代码进行更改，master 分支不一定包含最新功能。
3. 代码应当符合 [Vue 风格指南](https://cn.vuejs.org/v2/style-guide/) 的必要、强烈推荐和推荐部分，不符合的代码将无法通过 ESLint 分析。
4. 代码应当使用 [Prettier](https://prettier.io/) 进行格式化以确保项目风格一致，没有使用可能会导致 ESLint 报出 Warning。
5. 所有非实验性代码都应当保证 0 Error、0 Warning 后再进行 Pull Request，合并到生产分支的代码应当进行深度测试，CI 暂未部署。

### 一些基本操作

```bash
# 拉取代码
$ git clone https://github.com/PatchyVideo/patchyvideo-vue.git
$ cd patchyvideo-vue

# 安装依赖
$ npm i

# 运行代码检查/格式化
$ npm run lint

# 启动本地调试
$ npm run serve

# 构建
$ npm run build
```

## 写在最后

一、

非常荣幸 能够参与到 PatchyVideo 的网站建设。  
zyddnys 最初的设计理念是偏向 Danbooru、Gelbooru 风格的。  
我也是将他最开始的布局延展至今。

遗憾的是以我现有的拙劣水平尚不能穷尽这些美。  
我想我唯一的作用是让它稍微能入人眼目了，能让更多优秀的人寻着它，给它灿灿地生光、蓬勃地奋飞。

日新之谓盛德，生生之谓易。

希望 PatchyVideo 能留住这些好的故事。

written by suwadaimyojin

二、

说起来，自己认识东方才大概一年的时间。  
曾几何时，受到一些前辈的影响，“为东方做出一些自己的贡献”，这种想法愈加强烈。  
自己也一直在把这种想法付诸实现。

重新拾起 Vue，或许还能凭着自己以前的开发经验，为东方做些什么，自己是这么想的。  
虽然前辈们的背影离自己是那么的遥远，但这从来不是松懈的理由。  
用 Vue 重构网站的过程并不是一帆风顺，很多时候会遇到各种各样奇怪的问题，但自己坚信，现在的努力，是不会没有意义的。  
曾经 Vocaloid 的粉丝们用自己的双手搭建出了 Mikufans，东方的粉丝们也一定可以做到同样的事情，甚至做的会更好。
如果每一个东方众都为东方做出自己的贡献的话，东方就会永远向前。  
前辈们教会了自己这个道理，希望大家也能一起向前，不仅仅是 PatchyVideo，还有所有的，东方的回忆，都能被永远的铭记。

written by wrzrmzx(freesia)
