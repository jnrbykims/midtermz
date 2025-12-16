<template>
    <div class="profile-container">
        <div class="profile-card">
            <div class="profile-header">
                <div class="avatar-section">
                    <div class="avatar" @click="triggerFileInput">
                        <img :src="userProfile.avatar || 'https://via.placeholder.com/150'" alt="Profile Picture">
                        <div class="avatar-overlay">
                            <span>Change</span>
                        </div>
                    </div>

                    <input 
                        type="file" 
                        ref="fileInput" 
                        @change="handleFileUpload" 
                        accept="image/jpeg,image/png,image/gif" 
                        style="display: none"
                    >

                    <div v-if="showError" class="error-message">{{ errorMessage }}</div>
                </div>
            </div>

            <div class="profile-content">
                <form @submit.prevent="saveChanges">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" v-model="userProfile.name" :disabled="!isEditing" required>
                    </div>

                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" v-model="userProfile.email" :disabled="!isEditing" required>
                    </div>

                    <div class="form-group">
                        <label>Role</label>
                        <input type="text" v-model="userProfile.role" :disabled="!isEditing">
                    </div>

                    <div class="form-group">
                        <label>Join Date</label>
                        <input type="text" :value="userProfile.joinDate" disabled>
                    </div>

                    <div class="button-group">
                        <button v-if="!isEditing" type="button" @click="startEditing" class="edit-btn">Edit Profile</button>
                        <template v-else>
                            <button type="submit" class="save-btn">Save</button>
                            <button type="button" @click="cancelEditing" class="cancel-btn">Cancel</button>
                        </template>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Profile',
    data() {
        return {
            isEditing: false,
            userProfile: {
                name: '',
                email: '',
                role: 'Inventory Manager',
                joinDate: 'November 7, 2025',
                avatar: null
            },
            originalProfile: null,
            errorMessage: '',
            showError: false
        }
    },
    created() {
        const stored = JSON.parse(localStorage.getItem('userData') || '{}');
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
        
        if (stored && stored.email) {
            // Get user data from allUsers using email as key
            const userDataFromAll = allUsers[stored.email];
            
            if (userDataFromAll) {
                this.userProfile.name = userDataFromAll.name || stored.name || 'Test User';
                this.userProfile.email = stored.email;
                this.userProfile.role = userDataFromAll.role || 'Inventory Manager';
                this.userProfile.avatar = userDataFromAll.avatar || null;
            } else {
                // Fallback to userData if not in allUsers
                this.userProfile.name = stored.name || 'Test User';
                this.userProfile.email = stored.email || 'user@example.com';
                this.userProfile.role = stored.role || 'Inventory Manager';
                this.userProfile.avatar = stored.avatar || null;
            }
        }
    },
    methods: {
        startEditing() {
            this.originalProfile = { ...this.userProfile };
            this.isEditing = true;
        },
        cancelEditing() {
            this.userProfile = { ...this.originalProfile };
            this.isEditing = false;
            this.showError = false;
        },
        saveChanges() {
            // Update userData in localStorage
            const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
            const updatedUserData = {
                ...currentUserData,
                name: this.userProfile.name,
                email: this.userProfile.email,
                avatar: this.userProfile.avatar,
                role: this.userProfile.role
            };
            localStorage.setItem('userData', JSON.stringify(updatedUserData));

            // Update allUsers in localStorage
            const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
            
            // Update the user data at the email key
            if (allUsers[this.userProfile.email]) {
                allUsers[this.userProfile.email] = {
                    ...allUsers[this.userProfile.email],
                    name: this.userProfile.name,
                    role: this.userProfile.role,
                    avatar: this.userProfile.avatar
                };
                localStorage.setItem('allUsers', JSON.stringify(allUsers));
            }

            this.isEditing = false;
            this.showError = false;
        },
        triggerFileInput() {
            if (this.isEditing) this.$refs.fileInput.click();
        },
        validateFile(file) {
            const allowed = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowed.includes(file.type)) return 'Only JPG, PNG & GIF allowed';
            if (file.size > 2 * 1024 * 1024) return 'Max size is 2MB';
            return null;
        },
        handleFileUpload(e) {
            const file = e.target.files[0];
            if (!file) return;

            const error = this.validateFile(file);
            if (error) {
                this.errorMessage = error;
                this.showError = true;
                e.target.value = '';
                return;
            }

            this.showError = false;
            const reader = new FileReader();
            reader.onload = (r) => {
                this.userProfile.avatar = r.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}
</script>

<style scoped>
.profile-container {
    padding: 20px;
    display: flex;
    justify-content: center;
    background-color: #2b2d31;
    height: 100%;
}

.profile-card {
    background: #313338;
    border-radius: 12px;
    padding: 24px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.profile-header {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.avatar-section {
    position: relative;
    width: 110px;
    height: 110px;
}

.avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    border: 3px solid #5865F2;
}

.avatar img { width: 100%; height: 100%; object-fit: cover; }

.avatar-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f2f3f5;
    opacity: 0;
    transition: 0.25s;
    font-size: 14px;
}
.avatar:hover .avatar-overlay { opacity: 1; }

.profile-content { color: #e3e5e8; }

.form-group {
    margin-bottom: 14px;
}

.form-group label {
    font-size: 13px;
    margin-bottom: 6px;
    display: block;
    color: #b5bac1;
}

.form-group input {
    width: 100%;
    padding: 10px;
    background: #1e1f22;
    border: 1px solid #3a3c41;
    border-radius: 6px;
    color: #f2f3f5;
}
.form-group input:disabled {
    opacity: 0.6;
}

.button-group {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

.edit-btn, .save-btn, .cancel-btn {
    padding: 10px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
}

.edit-btn, .save-btn { background: #5865F2; color: white; }
.cancel-btn { background: #4f545c; color: white; }

.edit-btn:hover, .save-btn:hover { background: #4752C4; }
.cancel-btn:hover { background: #3c3f44; }

.error-message {
    margin-top: 8px;
    color: #ff6b6b;
    font-size: 13px;
    text-align: center;
}
</style>