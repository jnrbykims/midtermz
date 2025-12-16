<template>
    <nav class="sidebar">
        <ul>
            <li><router-link to="/dashboard" exact>Dashboard</router-link></li>
            <li><router-link to="/form" exact>Items</router-link></li>
            <li><router-link to="/profile" exact>Profile</router-link></li>
            <li class="logout-item"><a href="#" @click.prevent="handleLogout">Logout</a></li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'Sidebar',
    methods: {
        handleLogout() {
            // Clear user data from localStorage
            localStorage.removeItem('userData');
            // Redirect to login page
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.sidebar {
    width: 240px;
    background-color: #2F3136;
    color: white;
    border-right: 1px solid #202225;
}

.sidebar ul {
    list-style: none;
    padding: 8px;
    margin: 0;
}

.sidebar li {
    margin: 2px 0;
}

.sidebar a {
    color: #B9BBBE;
    text-decoration: none;
    display: block;
    padding: 10px 16px;
    border-radius: 4px;
    transition: all 0.2s ease;
    cursor: pointer;
    font-size: 0.95rem;
}

.sidebar a:hover,
.router-link-exact-active {
    background-color: #5865F2;
    color: #FFFFFF;
}

.logout-item {
    margin-top: auto;
    border-top: 1px solid #202225;
    padding-top: 15px;
}

.logout-item a {
    color: #ED4245;
}

.logout-item a:hover {
    background-color: #ED4245;
    color: white;
}
</style>