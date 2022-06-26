import cliProgress from 'cli-progress'
import colors from 'colors'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import getData, { productData } from './helpers/getData'
import getLinks from './helpers/getLinks'

const progressBar = new cliProgress.SingleBar(
  {
    format: colors.cyan(
      'Scrapping Products |{bar}| {percentage}% || {value}/{total} Product '
    ),
  },
  cliProgress.Presets.shades_classic
)

puppeteer.use(StealthPlugin())

export default async (url: string, limit?: number): Promise<productData[]> => {
  try {
    console.log(colors.blue('Running Scrapper..'))
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })

    console.log(colors.blue('Loading Page..'))
    await page.goto(url, {
      waitUntil: 'networkidle2',
    })

    console.log(colors.blue('Getting Links..'))

    if (limit) {
      console.log(colors.yellow(`chosen limit: ${limit}`))
    }

    const links = await getLinks(page, limit)
    console.log(colors.blue(`Scrapping ${links.length} product`))

    const data: productData[] = []

    console.log(colors.blue('Scrapping Links..'))
    progressBar.start(links.length, 0)

    for (let link of links) {
      await page.goto(link, {
        waitUntil: 'networkidle2',
      })

      const productData = await getData(page)

      data.push(productData)
      progressBar.increment()
    }

    progressBar.stop()
    await browser.close()

    return data
  } catch (err) {
    console.error(err)
    progressBar.stop()
    return []
  }
}
