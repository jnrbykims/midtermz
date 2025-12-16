<template>
  <header class="header">
    <div class="brand">
      <i class="fas fa-discord"></i>
      <h1>Inven<span class="tech">Tech</span></h1>
    </div>
    <h2>{{ pageTitle }}</h2>
  </header>
</template>

<script>
export default {
  name: 'HeaderBar',
  data() {
    return { 
      pageTitle: '' 
    }
  },
  created() {
    this.updatePageTitle(this.$route)
  },
  watch: {
    $route(to) {
      this.updatePageTitle(to)
    }
  },
  methods: {
    updatePageTitle(route) {
      if (route.name === 'dashboard') this.pageTitle = 'Dashboard'
      else if (route.name === 'inventory') this.pageTitle = 'Inventory'
      else if (route.name === 'profile') this.pageTitle = 'Profile'
      else this.pageTitle = 'InvenTech'
    }
  }
}
</script>

<style scoped>
.header {
  background-color: #2C2F33;
  color: #ffffff;
  padding: 12px 20px;
  border-bottom: 1px solid #202225;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 65px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: opacity .2s ease;
}

.brand:hover {
  opacity: 0.85;
}

.brand i {
  font-size: 26px;
  color: #5865F2;
}

h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.tech {
  font-weight: 800;
  background: linear-gradient(45deg, #5865F2, #7289DA);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #b9bbbe;
  text-transform: capitalize;
}
</style>
