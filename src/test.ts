import puppeteer from 'puppeteer'
import getData from './scrapper/helpers/getData'

const URL =
  'https://skp.com.sa/ar/%D8%B9%D9%84%D8%A8-%D9%88%D8%B1%D9%82%D9%8A%D8%A9-%D8%AF%D8%A7%D8%A6%D8%B1%D9%8A%D8%A9-%D9%84%D9%88%D9%86-%D8%A7%D8%A8%D9%8A%D8%B6-14-%D8%A7%D9%88%D9%86%D8%B5-1000%D8%AD%D8%A8%D8%A9/p1289551642'

const start = async () => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })

    await page.goto(URL, {
      waitUntil: 'networkidle2',
    })

    const data = await getData(page)

    console.log(data)

    await browser.close()
  } catch (err) {
    console.error(err)
    return []
  }
}

start()
