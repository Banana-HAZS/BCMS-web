<template>
    <div class="about-us">
      <h1>关于我们</h1>
      <div class="section">
        <h2>制作人</h2>
        <p>本网站由以下人员开发和维护:</p>
        <ul>
          <li v-for="member in members" :key="member.name">
            {{ member.name }} - {{ member.role }}
          </li>
        </ul>
      </div>
      <div class="section">
        <h2>联系我们</h2>
        <p>如果您有任何疑问或反馈,请随时与我们联系:</p>
        <p>电话: {{ contactInfo.phone }}</p>
        <p>邮箱: <a :href="`mailto:${contactInfo.email}`">{{ contactInfo.email }}</a></p>
      </div>
      <div class="section">
        <h2>版本信息</h2>
        <p>当前网站版本: {{ version }}</p>
      </div>
      <div class="section">
        <p>如果您有任何反馈意见,欢迎发送电子邮件至 <a :href="`mailto:${contactInfo.email}`">{{ contactInfo.email }}</a>。我们会尽快处理并回复您。</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AboutUs',
    data() {
      return {
        members: [
          { name: '翟建宇 ', role: '前端开发' },
          { name: '翟建宇  ', role: '后端开发' },
          { name: '翟建宇   ', role: 'UI 设计' }
        ],
        contactInfo: {
          phone: '130-2786-9217',
          email: '2962125830@qq.com'
        },
        version: '1.0.0'
      }
    }
  }
  </script>
  
  <style scoped>
  .about-us {
    padding: 2rem;
    background-color: #f5f5f5;
  }
  
  .section {
    margin-bottom: 2rem;
  }
  
  h1, h2 {
    margin-bottom: 1rem;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  a {
    color: #007bff;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>