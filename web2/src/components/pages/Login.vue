<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
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
        <button type="submit">Login</button>
        <div v-if="loginError" class="login-error">
          {{ loginError }}
        </div>
        <p class="signup-link">
          Don't have an account? <router-link to="/signup">Sign up</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
    data() {
    return {
      email: '',
      password: '',
      loginError: '',
      errors: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors = {
        email: '',
        password: ''
      };

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
      }

      return isValid;
    },
    handleLogin() {
      // Clear any previous error messages
      this.loginError = '';
      
      if (this.validateForm()) {
        // Get all users or initialize if none exist
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
        
        // Check if it's the default user
        if (this.email === 'jam@gmail.com' && this.password === '123') {
          const userData = {
            email: this.email,
            name: 'Jam',
            isLoggedIn: true,
            userId: 'default-jam'
          };
          
          // Initialize user data if it doesn't exist
          if (!allUsers['default-jam']) {
            allUsers['default-jam'] = {
              email: 'jam@gmail.com',
              name: 'Jam',
              inventoryItems: [],
              activities: []
            };
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
          }
          
          localStorage.setItem('userData', JSON.stringify(userData));
          this.$router.push('/dashboard');
        } 
        // Check for registered users
        else if (allUsers[this.email]) {
          if (allUsers[this.email].password === this.password) {
            const userData = {
              email: this.email,
              name: allUsers[this.email].name,
              isLoggedIn: true,
              userId: this.email
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            this.$router.push('/dashboard');
          } else {
            this.loginError = 'Invalid password';
          }
        } else {
          this.loginError = 'Invalid credentials';
        }
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #202225;
  width: 100%;
}

.login-form {
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

.login-error {
  color: #e74c3c;
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
  font-size: 0.9rem;
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

.signup-link {
  text-align: center;
  margin-top: 1rem;
  color: #fff;
}

.signup-link a {
  color: #5865F2;
  text-decoration: none;
  margin-left: 5px;
  font-weight: 500;
}

.signup-link a:hover {
  text-decoration: underline;
  color: #4752C4;
}
</style>