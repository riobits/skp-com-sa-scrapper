import scrape from './scrapper'
import { format } from '@fast-csv/format'
import fs from 'fs'
import colors from 'colors'

const URL = 'https://skp.com.sa/latest-products?mtgr-ssalh-alkhrashye'

const start = async () => {
  const data = await scrape(URL)
  console.log(colors.blue('Creating data.csv file..'))
  const csvStream = format({ headers: true, writeBOM: true })
  const csvFile = fs.createWriteStream('data.csv')

  csvStream.pipe(csvFile).on('end', () => process.exit())

  data.forEach((product) => {
    csvStream.write(product)
  })

  csvStream.end()

  console.log(colors.green('Done! Data saved in data.csv file.'))
}

start()
