<template>
    <div class="dashboard">
        <div class="stats-container">
            <div class="stat-card">
                <h3>Total Products</h3>
                <p class="stat-number">{{ getTotalProducts }}</p>
            </div>
            <div class="stat-card">
                <h3>Total Categories</h3>
                <p class="stat-number">4</p>
            </div>
            <div class="stat-card">
                <h3>Low Stock Items</h3>
                <p class="stat-number">{{ getLowStockCount }}</p>
            </div>
        </div>

        <div class="recent-activity">
            <h3>Recent Activity</h3>
            <div class="activity-list">
                <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
                    <span class="activity-time">{{ activity.time }}</span>
                    <span class="activity-text">{{ activity.text }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Dashboard',
    methods: {
        formatTimeAgo(timestamp) {
            const now = new Date();
            const past = new Date(timestamp);
            const diffInSeconds = Math.floor((now - past) / 1000);
            
            if (diffInSeconds < 60) return 'Just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
            return `${Math.floor(diffInSeconds / 86400)} days ago`;
        },
        updateActivities() {
            // Read activities from localStorage (per logged user)
            const userData = JSON.parse(localStorage.getItem('userData') || 'null');
            const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');

            if (!userData || !userData.userId || !allUsers[userData.userId]) {
                this.recentActivities = [];
                return;
            }

            const activities = allUsers[userData.userId].activities || [];
            this.recentActivities = activities.map(activity => ({
                ...activity,
                time: this.formatTimeAgo(activity.time)
            }));
        }
    },
    computed: {
        getTotalProducts() {
            const userData = JSON.parse(localStorage.getItem('userData') || 'null');
            const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');

            if (!userData || !userData.userId || !allUsers[userData.userId]) return 0;
            return (allUsers[userData.userId].inventoryItems || []).length;
        },
        getLowStockCount() {
            const userData = JSON.parse(localStorage.getItem('userData') || 'null');
            const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');

            if (!userData || !userData.userId || !allUsers[userData.userId]) return 0;
            const items = allUsers[userData.userId].inventoryItems || [];
            return items.filter(item => Number(item.quantity) < 10).length;
        }
    },
    created() {
        this.updateActivities();
        // Update activities every minute
        this.timer = setInterval(this.updateActivities, 60000);
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    data() {
        return {
            recentActivities: []
        }
    }
}
</script>

<style scoped>
.dashboard {
    padding: 20px;
    background-color: #202225;
    min-height: 100vh;
}

.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: #36393F;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.stat-card h3 {
    color: #B9BBBE;
    margin-bottom: 10px;
    font-size: 1rem;
    font-weight: 500;
}

.stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #5865F2;
    text-shadow: 0 0 8px rgba(88,101,242,0.2);
}

.recent-activity {
    background: #36393F;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.recent-activity h3 {
    color: #FFFFFF;
    margin-bottom: 15px;
    font-size: 1.1rem;
    font-weight: 600;
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.activity-item {
    padding: 12px;
    border-bottom: 1px solid #2F3136;
    display: flex;
    align-items: center;
    transition: background-color 0.2s ease;
}

.activity-item:hover {
    background-color: #2F3136;
    border-radius: 4px;
}

.activity-time {
    color: #B9BBBE;
    font-size: 0.9rem;
    margin-right: 15px;
    min-width: 100px;
}

.activity-text {
    color: #DCDDDE;
}
</style>
