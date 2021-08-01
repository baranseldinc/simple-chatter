const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 5000;

let nick = 'nonick';

let index = 0;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/general', (req, res) => {
    nick = req.query.n;
    res.sendFile(__dirname + '/public/rooms/general.html');
});

app.get('/ankara', (req, res) => {
    nick = req.query.n;
    res.sendFile(__dirname + '/public/rooms/ankara.html');
});

app.get('/hakkari', (req, res) => {
    nick = req.query.n;
    res.sendFile(__dirname + '/public/rooms/hakkari.html');
});

const tech = io.of('/tech');

tech.on('connection', (socket => {
    const nickName = nick;
    socket.on('join', data => {
        socket.join(data.room);
        tech.in(data.room).emit('message', { nick: 'SERVER', message: `${nickName} joined ${data.room} room!` });
    })

    socket.on('message', data => {
        console.log('message: ' + data.msg);
        tech.in(data.room).emit('message', { nick: nickName, message: data.msg });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        tech.emit('message', 'user disconnected');
        tech.emit('message', {
            nick: 'SERVER',
            message: nickName + ' disconnected!'
        });

    })
}))