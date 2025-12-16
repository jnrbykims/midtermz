<template>
  <div class="signup-container">
    <div class="signup-form">
      <h2>Sign Up</h2>
      <form @submit.prevent="handleSignup">
        <div class="form-group">
          <input 
            type="text" 
            v-model="name" 
            placeholder="Full Name"
            :class="{ 'error': errors.name }"
          />
          <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
        </div>
        <div class="form-group">
          <input 
            type="email" 
            v-model="email" 
            placeholder="Email"
            :class="{ 'error': errors.email }"
          />
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>
        <div class="form-group">
          <input 
            type="password" 
            v-model="password" 
            placeholder="Password"
            :class="{ 'error': errors.password }"
          />
          <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
        </div>
        <div class="form-group">
          <input 
            type="password" 
            v-model="confirmPassword" 
            placeholder="Confirm Password"
            :class="{ 'error': errors.confirmPassword }"
          />
          <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
        </div>
        <button type="submit">Sign Up</button>
        <p class="login-link">
          Already have an account? <router-link to="/login">Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Signup',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errors: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      };

      if (!this.name) {
        this.errors.name = 'Name is required';
        isValid = false;
      }

      if (!this.email) {
        this.errors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        this.errors.email = 'Invalid email format';
        isValid = false;
      }

      if (!this.password) {
        this.errors.password = 'Password is required';
        isValid = false;
      } else if (this.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters';
        isValid = false;
      }

      if (!this.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }

      return isValid;
    },
    handleSignup() {
      if (this.validateForm()) {

    // Get all existing users or create a new object if none exist
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');

    // Check if email is already registered
    if (allUsers[this.email]) {
      this.errors.email = 'Email already exists';
      return;
    }

    // Save new user data
    allUsers[this.email] = {
      name: this.name,
      email: this.email,
      password: this.password,
      inventoryItems: [],
      activities: []
    };

    // Store updated user list
    localStorage.setItem('allUsers', JSON.stringify(allUsers));

    // Redirect to login
    this.$router.push('/login');
  }
}
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #202225;
  width: 100%;
}

.signup-form {
  background: #36393F;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #fff;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #202225;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background-color: #2F3136;
  color: #FFFFFF;
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #5865F2;
}

input.error {
  border-color: #ED4245;
}

.error-message {
  color: #ED4245;
  font-size: 0.875rem;
  margin-top: -0.25rem;
  display: block;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #5865F2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #4752C4;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  color: #fff;
}

.login-link a {
  color: #5865F2;
  text-decoration: none;
  margin-left: 5px;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
  color: #4752C4;
}
</style>