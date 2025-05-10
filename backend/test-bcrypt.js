const bcrypt = require('bcryptjs');

async function test() {
  try {
    const hash = await bcrypt.hash('test', 10);
    console.log('✅ Hash successful:', hash);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();