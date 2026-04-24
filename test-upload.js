async function test() {
  try {
    let token;
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Tester', email: 'test1@test.com', password: 'password123' })
    });
    let data = await regRes.json();
    if (!regRes.ok) {
      const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test1@test.com', password: 'password123' })
      });
      data = await loginRes.json();
    }
    token = data.token;
    console.log('Token:', token ? 'Got Token' : 'No Token');

    const formData = new FormData();
    formData.append('title', 'Test PDF Title');
    formData.append('subject', 'Test Subject');
    formData.append('year', '1');
    formData.append('semester', '1');
    formData.append('fileType', 'pdf');

    const fileBlob = new Blob(['%PDF-1.4 fake body'], { type: 'application/pdf' });
    formData.append('file', fileBlob, 'test.pdf');

    console.log('Sending upload request to backend...');
    const uploadRes = await fetch('http://localhost:5000/api/resources', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const uploadData = await uploadRes.text();
    console.log('Status:', uploadRes.status);
    console.log('Response:', uploadData);
  } catch(err) {
    console.error('Fetch Script Error:', err);
  }
}
test();
