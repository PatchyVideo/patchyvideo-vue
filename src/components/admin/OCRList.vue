<template>
  <div>
    <el-dialog title="编辑状态" :visible.sync="diav">
      <div>
        状态：
        <el-select v-model="st" size="small">
          <el-option v-for="item in sts" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <span slot="footer">
        <el-button @click="edit">提交</el-button>
        <el-button @click="diav = false">关闭</el-button>
      </span>
    </el-dialog>

    <div>
      排序：
      <el-select v-model="order" size="small">
        <el-option v-for="item in orders" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </div>

    <el-table :data="items" border>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="worker_id" label="识别器ID"></el-table-column>
      <el-table-column prop="vid" label="视频ID"></el-table-column>
      <el-table-column prop="version" label="识别器版本"></el-table-column>
      <el-table-column prop="meta" label="申请者信息"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="item">
          <el-button type="text" size="small" @click="edit2(item.row)">编辑状态</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total,prev,pager,next,sizes"
      :page-count="total / pageSize"
      :page-sizes="[20, 30, 50, 100]"
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
import { list, edit } from "@/components/video/subtitle/ocr.js";

export default {
  data() {
    return {
      items: [],
      total: 0,

      orders: ["latest", "oldest"],
      order: "latest",
      page: 1,
      pageSize: 50,

      diav: false,
      sts: ["NoRecord", "Queuing", "Reserved", "PendingDownload", "Downloading", "PendingProcess", "Processing", "RecordExists", "RecordOutOfDate", "Error"],
      st: "",
      edvid: "",
    };
  },
  watch: {
    order() {
      this.fetch();
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    handleCurrentChange(n) {
      this.page = n;
      this.fetch();
    },
    handleSizeChange(n) {
      this.pageSize = n;
      this.page = 1;
    },
    async fetch() {
      const data = await list(this.order, this.page, this.pageSize);
      this.items = data.items;
      this.total = data.total;
    },
    edit2(item) {
      this.edvid = item.vid;
      this.st = item.status;
      this.diav = true;
    },
    async edit() {
      if (await edit(this.edvid, this.st)) {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.diav = false;
        this.fetch();
      } else {
        this.$message({
          message: "修改失败",
          type: "error",
        });
      }
    },
  },
};
</script>
