import express, { Request, Response } from 'express'
import scrape from './scrapper'
import { format } from '@fast-csv/format'
import fs from 'fs'
import colors from 'colors'

const app = express()

app.use(express.static('public'))
app.use(express.json())

app.post('/scrape', async (req: Request, res: Response) => {
  const { url, limit } = req.body

  if (!url) {
    return res.status(201).json({
      status: 'failed',
    })
  }

  res.status(201).json({
    status: 'success',
  })

  const data = await scrape(url, limit)
  console.log(colors.blue('Creating data.csv file..'))
  const csvStream = format({ headers: true, writeBOM: true })
  const csvFile = fs.createWriteStream('data.csv')

  csvStream.pipe(csvFile).on('end', () => process.exit())

  data.forEach((product) => {
    csvStream.write(product)
  })

  csvStream.end()

  console.log(colors.green('Done! Data saved in data.csv file.'))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(colors.magenta(`UI: http://localhost:${PORT}`))
)
