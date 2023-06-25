const express = require ('express')
const app = express()
const mongoose =require('mongoose')
const port = process.env.PORT || 5000

const ShortUrl =require('./models/shortUrl')

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
mongoose.connect('mongodb://localhost/urlShortener',{
    useNewUrlParser: true, useUnifiedTopology: true
})

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
    res.render('index',{shortUrls:shortUrls})
})

app.get('/search', async (req,res)=>{
    const shortUrls = await ShortUrl.find()
    res.render('search',{shortUrls:shortUrls,search:''})
})

app.get('/viewall',async (req,res)=>{
    const shortUrls = await ShortUrl.find()
    res.render('viewall',{shortUrls:shortUrls})
})

app.get('/:shortUrl', async (req,res)=>{
 const shortUrl= await ShortUrl.findOne({ short: req.params.shortUrl})
 if(shortUrl===null)
 return res.sendStatus(404)
 shortUrl.save()

 res.redirect(shortUrl.full)

})

app.post('/shortUrls',async (req,res)=>{
  await  ShortUrl.create({
        full:req.body.fullUrl,
        note:req.body.note
    })
    res.redirect('/')
})

app.post('/search',async (req,res)=>{
     search=req.body.search    
     const shortUrls = await ShortUrl.find()
     console.log(search);
    //  console.log(shortUrls); 
     var searchedurl=[]
     shortUrls.forEach(u=>{
        if(u.full.includes(search) || u.short.includes(search) || u.note.includes(search))
        searchedurl.push(u);
        
    })
    //  console.log(searchedurl);
     res.render('search',{shortUrls:searchedurl,search:search})

})

app.listen(port, () => console.log(`App listening on port ${port}!`))