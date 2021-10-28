const express = require('express')
const path = require('path')
const google = require('googleapis').google
const oauth2 = google.auth.OAuth2
const fetch = require('node-fetch')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const CONF = require('./conf')


const web = express();
const port = process.env.PORT || CONF.port

web.set('view engine', 'ejs')
web.set('trust proxy', '<insert your ip address>');
web.use(express.json())
web.use(cookieParser())

web.use(express.json()); 

web.use('/js', express.static(path.join(__dirname, 'JS')));

web.use('/css', express.static(path.join(__dirname, 'CSS')));

web.get("/", function(req, res) {
    res.render('index')
})

web.get('/login', function(req, res) {
  const client = new oauth2(CONF.oauth2Credentials.client_id, CONF.oauth2Credentials.client_secret, CONF.oauth2Credentials.redirect_uris[0])
  const login = client.generateAuthUrl({
    access_type: 'offline',
    scope: CONF.oauth2Credentials.scopes
  })
  return res.render('login', {loginLink: login})
})

web.get('/profile', function(req, res) {
  if(!req.cookies.jwt){
    return res.redirect('/login')
  }

  const client = new oauth2(CONF.oauth2Credentials.client_id, CONF.oauth2Credentials.client_secret, CONF.oauth2Credentials.redirect_uris[0])
  client.credentials = jwt.verify(req.cookies.jwt, CONF.JWTsecret)
  const service = google.youtube('v3')


  service.liveBroadcasts.list({
    auth: client,
    part: 'snippet',
    broadcastStatus: 'active',
    broadcastType: 'all',
  }).then(response => {
    if(response.data.items.length > 0){
      res.cookie('id', String(response.data.items[0].id))
      var thumb = response.data.items[0].snippet.thumbnails.maxres.url
      var title = response.data.items[0].snippet.title
      return res.render('dashboard', {thumb: thumb, title: title})
    } else{
      return res.render('dashboard')
    }
  })
})


web.get('/callback', (req, res) => {
  const client = new oauth2(CONF.oauth2Credentials.client_id, CONF.oauth2Credentials.client_secret, CONF.oauth2Credentials.redirect_uris[0])
  
  if (req.query.error){
    return res.redirect('/login')
  } else{
    client.getToken(req.query.code, function(err, token) {
      if(err){
        return res.redirect('/login')
      }
      res.cookie('jwt', jwt.sign(token, CONF.JWTsecret))
      return res.redirect('/profile')
    })
  }
})

web.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  res.clearCookie('view')
  res.redirect('/login')
})

web.listen(port, function() {
  console.log('Running');
})
