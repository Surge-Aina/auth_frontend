// const fs = require('fs');
// const dotenv = require('dotenv');
// const envPath = '.env';

// if (!fs.existsSync(envPath)) {
//   console.error('.env file not found!');
//   process.exit(1);
// }

// const envConfig = dotenv.parse(fs.readFileSync(envPath));
// let output = '';

// if (envConfig.GOOGLE_CLIENT_ID) {
//   output += `REACT_APP_GOOGLE_CLIENT_ID=${envConfig.GOOGLE_CLIENT_ID}\n`;
// }
// if (envConfig.BACKEND_API_URL) {
//   output += `REACT_APP_BACKEND_URL=${envConfig.BACKEND_API_URL}\n`;
// }

// // Remove any existing REACT_APP_ lines from .env
// let envFile = fs.readFileSync(envPath, 'utf8');
// envFile = envFile.replace(/^REACT_APP_GOOGLE_CLIENT_ID=.*$/gm, '');
// envFile = envFile.replace(/^REACT_APP_BACKEND_URL=.*$/gm, '');

// // Append the new REACT_APP_ variables
// fs.writeFileSync(envPath, envFile.trim() + '\n' + output);
// console.log('Synced .env variables for React.'); 