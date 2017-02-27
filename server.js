let express = require ('express')
let app = express()
let bodyparser = require('body-parser')
let session = require('express-session')
let mysql = require('mysql')

//Moteur de template
app.set('view engine', 'ejs')

//Middleware
app.use('/assets', express.static('public'))
app.use(bodyparser.urlencoded({ extended:false}))
app.use(bodyparser.json())
app.use(session({
    secret:'azerty',
    resave: false,
    saveUninitialized:true,
    cookie: { secure:false}

}))

app.use(require('./middlewares/flash'))
//Route
app.get('/', (request, response) => {
    console.log(request.session)
let Message = require('./models/Message')
    Message.all(function(messages){
        response.render('page/index', {message: messages})
    })
     
 })



app.post('/', (request, response) => {

     
    if(request.body.message === undefined || request.body.message === ' '){
        request.flash('error', "Vous n'avez pas posté de message")
        response.redirect('/')
    }
    else
    {
        let Message = require('./models/Message')
        Message.create(request.body.message, function(){
        request.flash('success', "Message envoyé.")
        response.redirect('/')
        })

    }
    
    
})


app.get('/message/:id', (request,response) => {

       let Message = require('./models/message')
        Message.find(request.params.id, function(message){
            response.render('messages/show', {message: message})
        })
    })

app.listen(8080)