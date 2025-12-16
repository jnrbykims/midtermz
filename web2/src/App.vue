<template>
  <div class="app-container">
    <template v-if="!isAuthRoute">
      <HeaderBar />
      <div class="main">
        <Sidebar />
        <div class="content">
          <router-view />
        </div>
      </div>
      <FooterBar />
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import HeaderBar from './components/Header.vue'
import FooterBar from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    HeaderBar,
    FooterBar
  },
  computed: {
    isAuthRoute() {
      return ['login', 'signup'].includes(this.$route.name)
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  min-height: 100vh;
  width: 100%;
  font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  overflow: hidden;
  background-color: #36393F;
  color: #DCDDDE;
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.main {
  flex: 1;
  display: flex;
  background-color: #f4f5f7;
  margin: 0;
  padding: 0;
  width: 100%;
}

.content {
  flex: 1;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}
</style>