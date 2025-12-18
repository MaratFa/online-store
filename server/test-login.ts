import axios from 'axios';

async function testLogin(): Promise<void> {
  try {
    console.log('Testing admin login...');
    const adminResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log('Admin login successful:', adminResponse.data);

    console.log('
Testing regular user login...');
    const userResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'user@example.com',
      password: 'user123'
    });
    console.log('User login successful:', userResponse.data);
  } catch (error: any) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
  }
}

testLogin();
