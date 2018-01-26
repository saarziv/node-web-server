const express = require('express');
const hbs = require('hbs');
const app = express();
const fs  = require('fs');

//setting port to the PORT evironment variable (of heroku when deploying) , in case  it doe`snt exists(when its local) the port will be 3000
const port = process.env.PORT || 3000;

//makes the call to the partials views available from the hbs files.
hbs.registerPartials(__dirname + "/views/partials/");
//makes a function available to all hbs files. with the name time.

hbs.registerHelper('time',() => {return new Date().getFullYear()});
hbs.registerHelper('screamIt',(text) => {
    return text.toUpperCase();
});
//changes express configuration property - view engine to use hbs.

app.set('view engine', 'hbs');

//using the middleware functionality.
//this function will be accessed b4 any other function will be (like app.get etc..)
//if i will not call the next at the end of the function, the app.get and all other endpoints would`nt be accessible.
//notice that the order of the use statements is crucial.
app.use((req,res,next) => {

    const log = `${new Date().toString()} : req method :${req.method}, url : ${req.url} \n`;
    console.log(log);
    fs.appendFile('server.log',log);
    next();
});

app.use((req,res,next) => {
        res.render('maintenance.hbs',{
            infoMessage: 'the server is currently under an upgrade, it will be accessible soon.'
        })
    }
);
//makes all the files inside the public folder accessible to all users.
//usually we will put html,css files there.
// __dirname is part of the wrapper function that wraps node apps , it specifies the project location in file system.
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.render('home.hbs',{
        title: "Home",
        infoMessage: "Welcome to home page!",
    })
});
app.get('/info', (req,res) => {
    res.render('info.hbs',{
        infoMessage: "some crucial information.",
    })
});

app.get('/bad',(req,res) => {
    res.send({
        errorMessage: "Bad request."
    });
});

app.listen(port,() => {console.log(`listening on port ${port}...`)});
