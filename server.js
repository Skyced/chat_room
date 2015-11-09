var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res){
    res.render('index');
})

var server = app.listen(8000, function(){
    console.log('on server 8000')
})
var messages = [];
var users = [];
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
    
    socket.on('user_signin', function (data){
        users.push(user={

            name:data.name,
            id:socket.id

        });
        io.emit('new_user', {users})
    });

    socket.on('send_message', function(data){
        messages.push(data);
        io.emit('new_message', {message:messages})
    })
    socket.emit('new_message',{ message:messages});

    socket.on('disconnect', function(){
        for (index in users){
            console.log(users[0]);
            if (users[index].id == socket.id){
                users.splice(index, 1);
                io.emit('new_user', {users})
                break;
            }
        }
    })

})