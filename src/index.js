const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');

const { getHistory, addToList, deleteFromList, togleDone } = require('./handlers')


const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/history', getHistory);
app.post('/addToList', addToList);
app.put('/togleDone', togleDone);
app.delete('/deleteFromList', deleteFromList);







const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME || 'root';
const PasswordDB = process.env.DB_PASSWORD || 'qwerty12345';
const NameDB = process.env.DB_NAME || 'shoping'
const HostDb = process.env.DB_HOST || 'mongodb://localhost:27017/'
async function start() {
    try {
        
        await mongoose.connect(HostDb, {
            user: UserDB,
            pass: PasswordDB,
            dbName: NameDB,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

start();