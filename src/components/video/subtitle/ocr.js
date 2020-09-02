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

export const list = async (order, page, page_size) => {
  return (
    await axios({
      method: "post",
      url: "/be/subtitles/admin/list_pending_ocr_requests.do",
      data: {
        order,
        page,
        page_size,
      },
    })
  ).data?.data;
};

export const edit = async (vid, status) => {
  return (
    (
      await axios({
        method: "post",
        url: "/be/subtitles/admin/set_request_status.do",
        data: {
          vid,
          status,
        },
      })
    ).data?.status == "SUCCEED"
  );
};
