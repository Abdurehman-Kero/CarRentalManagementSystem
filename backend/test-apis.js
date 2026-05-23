// test-apis.js
require('dotenv').config();
const http = require('http');

const PORT = 5000;
const EMAIL = 'keroabdurehman@gmail.com';
const PASSWORD = 'nexus@0974';

function request(method, path, body, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: responseBody });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) {
      req.write(data);
    }
    req.end();
  });
}

async function run() {
  console.log('🏁 Starting API verification test suite...\n');

  let token = null;

  // 1. Auth Login
  try {
    console.log('👉 Testing POST /api/auth/login...');
    const res = await request('POST', '/api/auth/login', { email: EMAIL, password: PASSWORD });
    console.log(`STATUS: ${res.status}`);
    if (res.status === 200 && res.body.success) {
      token = res.body.data.token;
      console.log('✅ Auth Login works! Token retrieved.\n');
    } else {
      console.error('❌ Auth Login failed:', res.body || res.raw);
      process.exit(1);
    }
  } catch (e) {
    console.error('❌ Auth Login request error:', e.message);
    process.exit(1);
  }

  // 2. GET /api/cars
  try {
    console.log('👉 Testing GET /api/cars...');
    const res = await request('GET', '/api/cars', null, token);
    console.log(`STATUS: ${res.status}`);
    if (res.status === 200 && res.body.success) {
      console.log(`✅ GET /api/cars works! Found ${res.body.data.length} cars.\n`);
    } else {
      console.error('❌ GET /api/cars failed:', res.body || res.raw);
    }
  } catch (e) {
    console.error('❌ GET /api/cars request error:', e.message);
  }

  // 3. Create a Car
  const testCarId = 999;
  try {
    console.log('👉 Testing POST /api/cars (create)...');
    const carData = {
      CarID: testCarId,
      LicensePlate: 'TEST-999',
      Model: 'M5 Competition',
      Brand: 'BMW',
      Year: 2023,
      Color: 'Frozen Black',
      Status: 'Available',
      DailyRate: 150.00,
      Mileage: 5000,
      CategoryID: 1,
      BranchID: 1,
      PolicyID: 1
    };
    // Delete if exists first
    await request('DELETE', `/api/cars/${testCarId}`, null, token);
    
    const res = await request('POST', '/api/cars', carData, token);
    console.log(`STATUS: ${res.status}`);
    if (res.status === 201 && res.body.success) {
      console.log('✅ POST /api/cars (create) works!\n');
    } else {
      console.error('❌ POST /api/cars (create) failed:', res.body || res.raw);
    }
  } catch (e) {
    console.error('❌ POST /api/cars (create) request error:', e.message);
  }

  // 4. GET /api/customers
  try {
    console.log('👉 Testing GET /api/customers...');
    const res = await request('GET', '/api/customers', null, token);
    console.log(`STATUS: ${res.status}`);
    if (res.status === 200 && res.body.success) {
      console.log(`✅ GET /api/customers works! Found ${res.body.data.length} customers.\n`);
    } else {
      console.error('❌ GET /api/customers failed:', res.body || res.raw);
    }
  } catch (e) {
    console.error('❌ GET /api/customers request error:', e.message);
  }

  // 5. Create a Customer
  const testCustId = 888;
  try {
    console.log('👉 Testing POST /api/customers (create)...');
    const custData = {
      CustID: testCustId,
      FullName: 'John Doe',
      Email: 'testjohndoe@example.com',
      Phone: '+1234567890',
      StreetAddress: '123 Luxury Way',
      City: 'Beverly Hills',
      State: 'CA',
      ZipCode: '90210',
      DriverLicenseNo: 'DL-TEST-999'
    };
    // Delete if exists first
    await request('DELETE', `/api/customers/${testCustId}`, null, token);

    const res = await request('POST', '/api/customers', custData, token);
    console.log(`STATUS: ${res.status}`);
    if (res.status === 201 && res.body.success) {
      console.log('✅ POST /api/customers (create) works!\n');
    } else {
      console.error('❌ POST /api/customers (create) failed:', res.body || res.raw);
    }
  } catch (e) {
    console.error('❌ POST /api/customers (create) request error:', e.message);
  }

  // 6. GET /api/bookings
  try {
    console.log('👉 Testing GET /api/bookings...');
    const res = await request('GET', '/api/bookings', null, token);
    console.log(`STATUS: ${res.status}`);
    if (res.status === 200 && res.body.success) {
      console.log(`✅ GET /api/bookings works! Found ${res.body.data.length} bookings.\n`);
    } else {
      console.error('❌ GET /api/bookings failed:', res.body || res.raw);
    }
  } catch (e) {
    console.error('❌ GET /api/bookings request error:', e.message);
  }

  // 7. Calculate Booking Cost
  try {
    console.log('👉 Testing POST /api/bookings/calculate-cost...');
    const costData = {
      CarID: testCarId,
      PickupDate: '2026-06-10T10:00:00.000Z',
      ReturnDate: '2026-06-15T10:00:00.000Z'
    };
    const res = await request('POST', '/api/bookings/calculate-cost', costData, token);
    console.log(`STATUS: ${res.status}`);
    if (res.status === 200 && res.body.success) {
      console.log('✅ POST /api/bookings/calculate-cost works! Cost:', res.body.data, '\n');
    } else {
      console.error('❌ POST /api/bookings/calculate-cost failed:', res.body || res.raw);
    }
  } catch (e) {
    console.error('❌ POST /api/bookings/calculate-cost request error:', e.message);
  }

  // 8. Create a Booking
  const testBookingId = 777;
  try {
    console.log('👉 Testing POST /api/bookings (create)...');
    const bookingData = {
      BookingID: testBookingId,
      BookingDate: new Date().toISOString(),
      PickupDate: '2026-06-10T10:00:00.000Z',
      ReturnDate: '2026-06-15T10:00:00.000Z',
      CustID: testCustId,
      CarID: testCarId
    };
    // Delete booking & rental first to ensure clean state
    await request('DELETE', `/api/bookings/${testBookingId}`, null, token);

    const res = await request('POST', '/api/bookings', bookingData, token);
    console.log(`STATUS: ${res.status}`);
    if (res.status === 201 && res.body.success) {
      console.log('✅ POST /api/bookings (create) works!\n');
    } else {
      console.error('❌ POST /api/bookings (create) failed:', res.body || res.raw);
    }
  } catch (e) {
    console.error('❌ POST /api/bookings (create) request error:', e.message);
  }

  // 9. GET /api/rentals
  try {
    console.log('👉 Testing GET /api/rentals...');
    const res = await request('GET', '/api/rentals', null, token);
    console.log(`STATUS: ${res.status}`);
    if (res.status === 200 && res.body.success) {
      console.log(`✅ GET /api/rentals works! Found ${res.body.data.length} rentals.\n`);
    } else {
      console.error('❌ GET /api/rentals failed:', res.body || res.raw);
    }
  } catch (e) {
    console.error('❌ GET /api/rentals request error:', e.message);
  }

  // 10. Clean up test records
  console.log('👉 Cleaning up test records...');
  try {
    // Delete rental if any was created? No, we didn't create a rental yet, let's keep clean.
    await request('DELETE', `/api/bookings/${testBookingId}`, null, token);
    await request('DELETE', `/api/customers/${testCustId}`, null, token);
    await request('DELETE', `/api/cars/${testCarId}`, null, token);
    console.log('✅ Clean up complete.\n');
  } catch(e) {
    console.error('⚠️ Cleanup error:', e.message);
  }

  console.log('🏁 Verification complete!');
}

run().catch(console.error);
