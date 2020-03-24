<!--    vue页面：IPFS.vue     -->
<!--
    组件：网站的幻想之物界面
    功能：播放IPFS视频等
    更新日志：
    2/9/2020: v1.0 
      release
-->
<i18n>
{
  "CHS": {
    "title":"",
    "content":{
        "introduce":"所见所闻皆遁入幻想",
        "part1":{
            "title":"设计思路",
            "l1":"東方视频备份站",
            "l2":"为被削除的東方视频提供备份服务",
            "l3":"暂时只提供人工审核通道，有备份需求的up请移步群:757676234,私聊管理 \"IPFS归档处\"",
            "l4":"备份站使用IPFS 分布式网络播放视频，可能会出现卡顿情况",
            "l5":"了解<a href=\"https://ipfs.io\">IPFS</a> 技术可更好地使用本站功能"
        },
        "part2":{
            "title":"暂行标准",
            "l1":"限東方Project相关视频",
            "l2":"转载视频推荐搬运至B站",
            "l3":"外网作者同意搬运至B站，B站屑审核削除的视频 （可能需要重新和作者取得搬运权限）",
            "l4":"在B站因政策原因打码、遮挡，影响观看体验而想保留原版备份的视频",
            "l5":"不接收明确标有 R-18\\R-18G 的视频"
        },
        "video_test":{
            "title":"示例视频",
            "link":"实验性播放页",
            "player_tip":"实验性播放器",
            "err_tip":"您的浏览器不支持\"video\"标签",
            "video_switch_test_tip":"视频切换测试，点击下列文字即可切换",
            "click_tip":"不要点我！(╯‵□′)╯︵┻━┻  点击下列文字！"
        },
        "image_test":"图片测试"
    }
  },
  "ENG": {
    "title":"",
    "content":{
        "introduce":"What you see and what you hear is a fantasy",
        "part1":{
            "title":"Design ideas",
            "l1":"Touhou Video Backup Station",
            "l2":"Provide backup services for the deleted Touhou Video",
            "l3":"Only provide manual review channels for the time being，If you have backup requirements, please move to the QQgroup:757676234,Private chat with manager who named \"IPFS归档处\"",
            "l4":"Backup Station Plays Video Using IPFS Distributed Network, Stuck",
            "l5":" Understanding <a href=\"https://ipfs.io\">IPFS</a> technology can make better use of the functions of this site "
        },
        "part2":{
            "title":"Interim standard",
            "l1":"Touhou related videos only",
            "l2":"Reproduced video is recommended to be transferred to Bilibili",
            "l3":"Video deleted by the bad reviewer of Bilibili and author agrees to move to Bilibili（May need to regain permission with the author）",
            "l4":"In Bilibili, due to policy reasons, blocking, blocking, and affecting the viewing experience, I want to keep the original backup video",
            "l5":"Do not receive videos explicitly labeled R-18\\R-18G"
        },
        "video_test":{
            "title":"Sample video",
            "link":"Experimental play page",
            "player_tip":"Experimental player",
            "err_tip":"您Your browser does not support \"video\" tag",
            "video_switch_test_tip":"Video switching test, click the following text to switch",
            "click_tip":"Don't click me！(╯‵□′)╯︵┻━┻  Click the following text！"
        },
        "image_test":"Image test"

    }
  },
  "CHT": {
    "title":"",
    "content":{
        "introduce":"所見所聞皆遁入幻想",
        "part1":{
            "title":"設計思路",
            "l1":"東方視頻備份站",
            "l2":"為被削除的東方視頻提供備份服務",
            "l3":"暫時只提供人工審核通道，有備份需求的up請移步群:757676234,私聊管理 \"IPFS歸檔處\"",
            "l4":"備份站使用IPFS 分布式網絡播放視頻，可能會出現卡頓情況",
            "l5":"了解<a href=\"https://ipfs.io\">IPFS</a> 技術可更好地使用本站功能"
        },
        "part2":{
            "title":"暫行標準",
            "l1":"限東方Project相關視頻",
            "l2":"轉載視頻推薦搬運至B站",
            "l3":"外網作者同意搬運至B站，B站屑審核削除的視頻 （可能需要重新和作者取得搬運權限）",
            "l4":"在B站因政策原因打碼、遮擋，影響觀看體驗而想保留原版備份的視頻",
            "l5":"不接收明確標有 R-18\\R-18G 的視頻"
        },
        "video_test":{
            "title":"示例視頻",
            "link":"實驗性播放頁",
            "player_tip":"實驗性播放器",
            "err_tip":"您的瀏覽器不支持\"video\"標簽",
            "video_switch_test_tip":"視頻切換測試，點擊下列文字即可切換",
            "click_tip":"不要點我！(╯‵□′)╯︵┻━┻  點擊下列文字！"
        },
        "image_test":"圖片測試"
    }
  }
}
</i18n>


<template>
  <div>
    <topnavbar />
    <div class="w main-page-background-img">
      <div class="content">
        <p>...{{$t('content.introduce')}}...</p>
        <h1>{{$t('content.part1.title')}}</h1>
        <ul>
          <li>{{$t('content.part1.l1')}}</li>
          <li>{{$t('content.part1.l2')}}</li>
          <li>{{$t('content.part1.l3')}}</li>
          <li>{{$t('content.part1.l4')}}</li>
          <li v-html="$t('content.part1.l5')"></li>
        </ul>

        <h1>{{$t('content.part2.title')}}</h1>
        <ul>
          <li>{{$t('content.part2.l1')}}</li>
          <li>{{$t('content.part2.l2')}}</li>
          <li>{{$t('content.part2.l3')}}</li>
          <li>{{$t('content.part2.l4')}}</li>
          <li>{{$t('content.part2.l5')}}</li>
        </ul>

        <h1>{{$t('content.video_test.title')}}</h1>
        <router-link to="/ipfs/player">{{$t('content.video_test.link')}}</router-link>
        <p>{{$t('content.video_test.player_tip')}}</p>
        <p></p>
        <video
          src="https://ipfs.globalupload.io/QmcAmXANyKjCfRoy9HAHA2tK4c3ujHH2yekwZwNTD6gTDh"
          id="player"
          controls
          loop
          width="50%"
        >
          <p>{{$t('content.video_test.err_tip')}}</p>
        </video>
        <p />
        <button id="button" @click="changeSrc()">{{buttonInnerHTML}}</button>
        <p />
        <a id="badapple" @click="playBadapple()">bad apple!!</a>
        <p />
        <a id="lanlanlu" @click="playLanlanlu()">最终鬼畜蓝蓝路</a>
        <p />
        <a @click="playErxiaojie()">最终鬼畜二小姐</a>
        <p />
        <h1>{{$t('content.image_test')}}</h1>
        <!-- TODO: 也可采用数据库检索hash值 -->
        <img src="https://ipfs.globalupload.io/QmQH2mFR9mwv5PM1toYech1uXSr5k8Tdu2qQ6XEaVy9QtL" />
        <p />
        <img src="https://ipfs.globalupload.io/QmRnp2Fz84MDRNLriRAD5cKMGwaGRcX21i5iRXTUdPTsiS" />
        <p />
        <img src="https://ipfs.globalupload.io/Qmak58VTfTjegyLE1pzeDK864xp6wWtDqrk43YuMTU9PVq" />
        <p>by liuAbin</p>
        <!-- <img src="https://ipfs.globalupload.io/QmPuwsMMtx2cMPFqRTRK3qfDutiLMhLD9eyosJn3H1N6pP"> -->
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import Footer from "../components/Footer.vue";
export default {
  data() {
    return {
      buttonInnerHTML: this.$t('content.video_test.video_switch_test_tip'),
      badapple:
        "https://ipfs.globalupload.io/QmcAmXANyKjCfRoy9HAHA2tK4c3ujHH2yekwZwNTD6gTDh",
      lanlanlu:
        "https://ipfs.globalupload.io/QmT2LT2D513dTe1bNuBogfDCpZakaEuPquJmozYx6X6Gmq",
      erxiaojie:
        "https://ipfs.globalupload.io/QmNdrzSXnYyiTJGS3tj3SswhpJLpjhmNbTLm15hWR7kLdE",
      count: 0
    };
  },
  computed: {
    // 搜索的关键字
    player() {
      return document.getElementById("player");
    }
  },
  created() {
    // player.autoplay = "true"
    // 初始化页面名为fantasy
    this.$store.commit("changeBgc", "fantasy");
    // 修改网站标题
    document.title = "幻想之物 - Patchyvideo";
  },
  methods: {
    changeSrc() {
      this.count++;
      if (this.count == 1) {
        this.buttonInnerHTML = this.$t('content.video_test.click_tip');
      } else if (this.count == 10) {
        alert("have fun!");
      } else {
        // this.count++;
      }
    },
    playBadapple() {
      this.player.src = this.badapple;
    },
    playLanlanlu() {
      this.player.src = this.lanlanlu;
    },
    playErxiaojie() {
      this.player.src = this.erxiaojie;
    }
  },
  components: { topnavbar, Footer }
};
</script>

<style scoped>
.w {
  text-align: left;
}
.main-page-background-img {
/*  background-image: url("./../static/img/imoto3.jpg");*/
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
  margin-top: 20px;
}
.content {
  background-color: #ffffffc9;
}
</style>