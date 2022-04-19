const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')

const app = express()
const ApiKey = '61be443fb4425f7d587262ec1b9396f3-us14'
const audienceId = '63f7635e63'


app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', (req,resp) => {

    resp.sendFile(__dirname+'/signup.html')
})

app.post('/', (req,resp) => {

    firstName = req.body.fname
    secondName = req.body.sname
    email = req.body.email
    console.log(firstName+' '+secondName+' '+email)

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: secondName
                }
            }
        ], 
    }

    var jsonData = JSON.stringify(data)

    const url = 'https://us14.api.mailchimp.com/3.0/lists/'+audienceId

    const options = {
        method:"POST",
        auth: "ivonunes:"+ApiKey
    }

    const request = https.request(url, options, (res) => {
        
        if (res.statusCode === 200){
            resp.sendFile(__dirname+'/success.html')
        }else{
            resp.sendFile(__dirname+'/failure.html')
        }
            res.on("data", (d) => {
                console.log(JSON.parse(d))
            })
            })
            
            request.write(jsonData)
            request.end()
            
    

})

app.post('/failure', (req,resp) =>{
    resp.redirect('/')    
})



app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });