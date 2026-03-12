// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
// 导入各个页面组件
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Works from '../views/Works.vue'
import Gallery from '../views/Gallery.vue'
import Quiz from '../views/Quiz.vue'
import FanWall from '../views/FanWall.vue'
// 1. 正确导入 artBook 组件（注意路径和命名）
import ArtBook from '../views/artBook.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/works',
    name: 'Works',
    component: Works
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: Quiz
  },
  {
    path: '/fanwall',
    name: 'FanWall',
    component: FanWall
  },
  {
    path: '/artBook',
    name: 'ArtBook', // 2. 命名统一为大驼峰（可选，但建议规范）
    component: ArtBook // 3. 使用导入的组件对象，而非字符串路径
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 路由滚动行为优化
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router