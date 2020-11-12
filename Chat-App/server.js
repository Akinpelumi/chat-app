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

app.get('/messages', async (req, res) => {
    try {
        Message.find({}, (err, messages) => {
            res.send(messages)
        })
    } catch(error) {
        res.sendStatus(500)
        console.log("error found", error);
    }
})

app.get('/messages/:user', async (req, res) => {
    try {
        var user = req.params.user;
        Message.find({ name: user }, (err, messages) => {
            res.send(messages)
        })
    } catch(error) {
        res.sendStatus(500)
        console.log("error found", error);
    }
})

app.post('/messages', async (req, res) => {
    try {
        var message = new Message(req.body);
        var savedMessage = await message.save()
        console.log("message saved");

        var censored = await Message.findOne({ message: 'fuck' })

        if(censored)
            await Message.remove({ _id: censored.id })
        else
            io.emit('message', req.body);
            res.sendStatus(200)
    } catch(error) {
        res.sendStatus(500)
        console.log("error found", error);
    } finally {
        console.log("Message posted nonetheless");
    }
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
