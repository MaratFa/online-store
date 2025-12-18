async function testLogin(): Promise<void> {
  try {
    console.log('Testing admin login...');
    const adminResponse = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });

    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      console.log('Admin login successful:', adminData);
    } else {
      const adminError = await adminResponse.text();
      console.error('Admin login failed:', adminError);
    }

    console.log('
Testing regular user login...');
    const userResponse = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'user123'
      })
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('User login successful:', userData);
    } else {
      const userError = await userResponse.text();
      console.error('User login failed:', userError);
    }
  } catch (error: any) {
    console.error('Login failed:', error.message);
  }
}

testLogin();
