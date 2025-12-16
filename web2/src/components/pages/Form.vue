<template>
    <div class="crud-container">
        <div class="crud-header">
            <h2>Manage Items</h2>
            <button @click="openAddModal" class="add-button">Add New Item</button>
        </div>

        <div class="table-container">
            <table v-if="inventoryItems.length > 0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in inventoryItems" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.category }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>₱{{ item.price.toFixed(2) }}</td>
                        <td class="action-buttons">
                            <button @click="editItem(item)" class="edit-btn">Edit</button>
                            <button @click="deleteItem(item.id)" class="delete-btn">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="no-items">
                No items in inventory. Click "Add New Item" to get started.
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3>{{ isEditing ? 'Edit Item' : 'Add New Item' }}</h3>
                </div>
                <form @submit.prevent="submitForm">
                    <div class="form-group">
                        <label>Name:</label>
                        <input v-model="currentItem.name" placeholder="Enter item name" required>
                    </div>
                    <div class="form-group">
                        <label>Category:</label>
                        <select v-model="currentItem.category" required>
                            <option value="">Select a category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Office Supplies">Office Supplies</option>
                            <option value="Storage">Storage</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Quantity:</label>
                        <input type="number" v-model.number="currentItem.quantity" placeholder="Enter quantity" required min="0">
                    </div>
                    <div class="form-group">
                        <label>Price (₱):</label>
                        <input type="number" v-model.number="currentItem.price" placeholder="Enter price" required min="0" step="0.01">
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
                        <button type="submit" class="save-btn">{{ isEditing ? 'Save Changes' : 'Add Item' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Form',
    created() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');

        if (userData && userData.userId) {
            if (!allUsers[userData.userId]) {
                allUsers[userData.userId] = {
                    email: userData.email,
                    name: userData.name,
                    inventoryItems: [
                        { id: 1, name: 'Laptop', category: 'Electronics', quantity: 5, price: 999.99 },
                        { id: 2, name: 'Office Chair', category: 'Furniture', quantity: 10, price: 199.99 },
                        { id: 3, name: 'Desk', category: 'Furniture', quantity: 8, price: 299.99 }
                    ],
                    activities: []
                };
                localStorage.setItem('allUsers', JSON.stringify(allUsers));
            }
            this.inventoryItems = (allUsers[userData.userId].inventoryItems || []).map(i => ({ ...i }));
        }
    },
    data() {
        return {
            inventoryItems: [],
            showModal: false,
            isEditing: false,
            currentItem: {
                id: null,
                name: '',
                category: '',
                quantity: 0,
                price: 0
            }
        }
    },
    methods: {
        openAddModal() {
            this.isEditing = false;
            this.currentItem = {
                id: Date.now(),
                name: '',
                category: '',
                quantity: 0,
                price: 0
            };
            this.showModal = true;
        },
        editItem(item) {
            this.isEditing = true;
            this.currentItem = { ...item };
            this.showModal = true;
        },
        deleteItem(id) {
            if (!confirm('Are you sure you want to delete this item?')) return;

            const itemToDelete = this.inventoryItems.find(item => item.id === id);
            this.inventoryItems = this.inventoryItems.filter(item => item.id !== id);

            const userData = JSON.parse(localStorage.getItem('userData'));
            const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');

            if (userData && userData.userId && allUsers[userData.userId]) {
                allUsers[userData.userId].inventoryItems = this.inventoryItems;
                allUsers[userData.userId].activities = allUsers[userData.userId].activities || [];
                allUsers[userData.userId].activities.unshift({
                    time: new Date().toISOString(),
                    text: `Deleted item: ${itemToDelete ? itemToDelete.name : '(unknown)'}`
                });
                localStorage.setItem('allUsers', JSON.stringify(allUsers));
            }
        },
        submitForm() {
            const userData = JSON.parse(localStorage.getItem('userData'));
            const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');

            if (!userData || !userData.userId || !allUsers[userData.userId]) {
                alert('No logged-in user found.');
                return;
            }

            if (this.isEditing) {
                const index = this.inventoryItems.findIndex(item => item.id === this.currentItem.id);
                if (index !== -1) {
                    this.inventoryItems[index] = { ...this.currentItem };
                }
                allUsers[userData.userId].activities = allUsers[userData.userId].activities || [];
                allUsers[userData.userId].activities.unshift({
                    time: new Date().toISOString(),
                    text: `Edited item: ${this.currentItem.name}`
                });
            } else {
                this.inventoryItems.push({ ...this.currentItem });
                allUsers[userData.userId].activities = allUsers[userData.userId].activities || [];
                allUsers[userData.userId].activities.unshift({
                    time: new Date().toISOString(),
                    text: `Added item: ${this.currentItem.name}`
                });
            }

            allUsers[userData.userId].inventoryItems = this.inventoryItems;
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
            this.closeModal();
        },
        closeModal() {
            this.showModal = false;
        }
    }
}
</script>

<style scoped>
.crud-container {
    padding: 20px;
    height: 100%;
    background-color: #2b2d31;
    color: #f2f3f5;
    font-family: 'Segoe UI', sans-serif;
}

.crud-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.crud-header h2 { color: #fff; }

.add-button {
    background-color: #5865F2;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}
.add-button:hover { background-color: #4752C4; }

.table-container {
    background: #1e1f22;
    border-radius: 8px;
    box-shadow: 0 0 8px rgba(0,0,0,0.4);
    overflow-x: auto;
    margin-bottom: 20px;
    min-height: 200px;
}

/* ✅ ALIGNMENT FIX */
table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    align-items: center;
}

th, td {
    padding: 12px 15px;
    border-bottom: 1px solid #3a3c41;
    text-align: center;
}

th { background-color: #313338; color: #e3e5e8; }
td { color: #d1d5db; }

.no-items { text-align: center; padding: 40px; color: #888; }

.edit-btn { background-color: #FEE75C; color: #333; border-radius: 4px; padding: 6px 12px; }
.delete-btn { background-color: #ED4245; color: #fff; border-radius: 4px; padding: 6px 12px; }

.modal-overlay {
    position: fixed; inset: 0;
    background-color: rgba(0,0,0,0.65);
    display: flex; justify-content: center; align-items: center;
}

.modal {
    background: #313338;
    border-radius: 10px;
    width: 90%; max-width: 500px;
    box-shadow: 0 0 15px rgba(0,0,0,0.5);
}

.modal-header { padding: 20px; border-bottom: 1px solid #3d3e43; }
.modal-header h3 { color: #f2f3f5; }

.modal form { padding: 20px; }
.form-group { margin-bottom: 18px; }
.form-group label { color: #c3c6ce; }

.form-group input, .form-group select {
    width: 100%; padding: 10px;
    border: 1px solid #3d3e43;
    border-radius: 6px;
    background: #1e1f22;
    color: #f2f3f5;
}

.save-btn {
    background-color: #5865F2; color: white;
    padding: 10px 20px; border-radius: 6px;
}
.cancel-btn {
    background-color: #4f545c; color: white;
    padding: 10px 20px; border-radius: 6px;
}
</style>