import axios from 'axios';
import FormData from 'form-data';

async function testUpload() {
  try {
    console.log('Registering test user...');
    let token;
    const testEmail = `t${Date.now()}@my.sliit.lk`;
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Tester API',
      email: testEmail,
      password: 'password123',
      studentId: `IT${Date.now()}`
    });
    token = res.data.data.token;
    
    console.log('Got token:', token ? 'YES' : 'NO');

    console.log('\n--- Testing PDF Upload ---');
    const formPdf = new FormData();
    formPdf.append('title', 'Test PDF Title');
    formPdf.append('subject', 'Test Subject');
    formPdf.append('moduleCode', 'SE101');
    formPdf.append('year', '1');
    formPdf.append('semester', '1');
    formPdf.append('fileType', 'pdf');
    // use a buffer for the file
    formPdf.append('file', Buffer.from('%PDF-1.4\n%Fake PDF'), { filename: 'test.pdf', contentType: 'application/pdf' });

    const resPdf = await axios.post('http://localhost:5000/api/resources', formPdf, {
      headers: {
        ...formPdf.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('PDF Upload Response:', resPdf.data);
    process.exit(0);
  } catch (err) {
    console.error('\nERROR OCCURRED:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
}

testUpload();
