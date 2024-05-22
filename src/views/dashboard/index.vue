<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <p>{{ currentDateTime }}</p>
      <p v-if="isLoggedIn">欢迎回来,{{ name }}!</p>
      <p v-else class="user-name">
        您好，{{ name }}！欢迎访问商业银行信贷管理系统。
      </p>
      <p>{{ websiteIntro }}</p>
      <p
        class="user-name"
        style="
          text-align: right;
          font-size: 22px;
        "
      >
        {{ locationGreeting }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
      websiteIntro:
        "这是一个涵盖客户管理、信贷业务管理、贷款利息管理、报表管理、和风险管理的一体化集成的现代商业银行信贷管理系统，为您提供更便捷的信贷管理体验。",
      locationGreeting: "",
    };
  },
  computed: {
    ...mapGetters(["name", "isLoggedIn"]),
    currentDateTime() {
      return moment().format("YYYY-MM-DD HH:mm:ss");
    },
  },
  mounted() {
    this.fetchUserLocation();
  },
  methods: {
    async fetchUserLocation() {
      const cityMapping = {
        Anhui: "安徽",
        Beijing: "北京",
        Chongqing: "重庆",
        Fujian: "福建",
        Gansu: "甘肃",
        Guangdong: "广东",
        Guangxi: "广西",
        Guizhou: "贵州",
        Hainan: "海南",
        Hebei: "河北",
        Henan: "河南",
        Heilongjiang: "黑龙江",
        Hubei: "湖北",
        Hunan: "湖南",
        Jiangsu: "江苏",
        Jiangxi: "江西",
        Jilin: "吉林",
        Liaoning: "辽宁",
        InnerMongolia: "内蒙古",
        Ningxia: "宁夏",
        Qinghai: "青海",
        Shandong: "山东",
        Shanxi1: "山西",
        Shanxi2: "陕西",
        Shanghai: "上海",
        Sichuan: "四川",
        Tianjin: "天津",
        Xinjiang: "新疆",
        Xizang: "西藏",
        Yunnan: "云南",
        Zhejiang: "浙江",
      };
      try {
        const response = await axios.get("https://ipapi.co/json/");
        const city = cityMapping[response.data.city] || response.data.city;
        const hour = moment().hour();
        if (hour >= 6 && hour < 12) {
          this.locationGreeting = `${city} | 早上好！`;
        } else if (hour >= 12 && hour < 18) {
          this.locationGreeting = `${city} | 下午好！`;
        } else {
          this.locationGreeting = `${city} | 晚上好！`;
        }
      } catch (error) {
        console.error("Failed to fetch user location:", error);
        this.locationGreeting = "欢迎访问商业银行信贷管理系统!";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-text p.user-name {
  position: relative;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 100%;
    height: 3px;
    background-color: #0077b6;
  }
}
</style>
