const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const port = 6000;

require('./model/index');
require('./model/users');
require('./model/product');
require('./model/category');
require('./model/admin');
const app = express();
app.use(bodyParser.json());

const router = require('./router/adminrouter.js');
const router2 = require('./router/userrouter');
const router3 = require('./router/publicrouter');

app.use('/api/admin', router);
app.use('/api/user', router2);
app.use('/api/public',router3);

// var Coroptoion = {
//     origin : 'http://localhost:6000' 
// }

//app.use(cors(Coroptoion))

app.use(express.urlencoded({ extended : false}))



app.get('/',(req,res)=>{
    res.status(200).json({mesage : "hello world"})
})


app.listen(port,(req,res)=>{
    console.log(`server is running at port ${port}`)
})