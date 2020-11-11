var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const { stringify } = require('querystring');
require('dotenv').config()

var app = express()

var http = require('http').Server(app)
var io = require('socket.io')(http )

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var dbUrl = process.env.MONGODB_CONNECTION;

var Message = mongoose.model('Message', {
    name: String,
    message: String,
    createdAt: {
        type: Date,
		default: Date.now
    }
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);

    message.save((err) => {
        if(err)
            sendStatus(500)
        
        io.emit('message', req.body);
        res.sendStatus(200)
    })
})

io.on('connection', (socket) => {
    console.log("a user connected");
})

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    console.log("mongoDB Connection");
})
  

var server = http.listen(3070, () => {
    console.log('server is listening on port', server.address().port)
});
