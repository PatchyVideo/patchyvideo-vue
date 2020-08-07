import axios from "axios";

export const query = async (vid) => {
  return (
    await axios({
      method: "post",
      url: "/be/subtitles/query_ocr_status.do",
      data: {
        vid,
      },
    })
  ).data?.data?.status;
};

export const req = async (vid) => {
  return (
    (
      await axios({
        method: "post",
        url: "/be/subtitles/request_ocr.do",
        data: {
          vid,
        },
      })
    ).data?.status == "SUCCEED"
  );
};
