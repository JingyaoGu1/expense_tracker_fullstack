const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
const cors = require('cors');

dotenv.config({ path: './config/config.env' });

connectDB();

const transactions = require('./routes/transactions');
const users = require('./routes/users')

const app = express();

app.use(express.json());
app.use(cors());


// receipt logic
const upload = multer({ dest: 'uploads/' }); // Temporarily store files in the "uploads/" folder

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dnjj6iqr3', 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET 
});

// Promisify the Cloudinary upload function so we can use it with async/await
const uploadToCloudinary = promisify(cloudinary.uploader.upload);

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    // File is temporarily stored at req.file.path
    const result = await uploadToCloudinary(req.file.path);
    
    // Send back the URL of the uploaded image
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).send('Error uploading file.');
  }
});


app.post('/api/veryfi', async (req, res) => {
  const data = JSON.stringify(req.body);

  const config = {
    method: 'post',
    url: 'https://api.veryfi.com/api/v8/partner/documents',
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json', 
      'CLIENT-ID': process.env.VERYFI_CLIENT_ID,
      'AUTHORIZATION': 'apikey gjyraymond:cee6d524b1e33e82e754cef2d6cc7519' ,
    },
    data: data
  };

  try {
    const response = await axios(config);
    res.json(response.data); // Send back the response from Veryfi to the frontend
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});












if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/transactions', transactions);
app.use('/api/v1/users', users);


if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));