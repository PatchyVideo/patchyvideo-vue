import axios from "axios";

export default {
  async list(vid) {
    return (
      await axios({
        method: "post",
        url: "/be/subtitles/list_for_video.do",
        data: {
          vid,
        },
      })
    ).data.data.items;
  },
  async get(subid) {
    return (
      await axios({
        method: "post",
        url: "/be/subtitles/get_single.do",
        data: {
          subid,
        },
      })
    ).data.data.item;
  },
};
