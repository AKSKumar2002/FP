const axios = require('axios');

const testLogin = async () => {
  try {
    const response = await axios.post('https://fp-mocha.vercel.app/api/seller/login', {
      email: 'test@seller.com',
      password: 'password123'
    });
    console.log('✅ Login response:', response.data);
  } catch (error) {
    console.error('❌ Login error:', error.response?.data || error.message);
  }
};

testLogin();
