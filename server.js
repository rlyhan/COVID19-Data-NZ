const express = require('express')
const cors = require('cors')
require('dotenv').config()

const healthgovt = require('./routes/healthgovt')

const app = express()

app.use(cors())

app.use('/api/healthgovt', healthgovt)

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '/', 'build', 'index.html'))
  })
}

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`))
