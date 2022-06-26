import type { Page } from 'puppeteer'
import {
  MODEL_NUMBER_SELECTOR,
  PRODUCT_IMAGE_SELECTOR,
  PRODUCT_TEXT_LIST,
} from '../constants'

type productField = string | null

export interface productData {
  title: productField
  description: productField
  color: productField
  size: productField
  length: productField
  in_carton: productField
  in_bundle: productField
  in_intensity: productField
  in_box: productField
  creator: productField
  pretax_price: productField
  sale_price: productField
  price: productField
  availability: productField
  condition: productField
  id: productField
  category: productField
  model_number: productField
  images: productField
}

export default async (page: Page) => {
  const scrappedData: productData = await page.evaluate(
    (imageSelector, modelNumberSelector, productListSelector) => {
      // Getting meta content
      const getMetadata = (property: string) => {
        const metaEl = document.querySelector(
          `head > meta[property="${property}"]`
        ) as HTMLMetaElement

        if (!metaEl) {
          return null
        }

        return metaEl.content
      }

      // Meta fields
      const title = getMetadata('og:title')
      const description = getMetadata('og:description')
      const pretax_price = getMetadata('product:pretax_price:amount')
      const sale_price = getMetadata('product:sale_price:amount')
      const price = getMetadata('product:price:amount')
      const availability = getMetadata('product:availability')
      const condition = getMetadata('product:condition')
      const id = getMetadata('product:retailer_item_id')
      const category = getMetadata('product:category')

      // Model number
      const modelEl = document.querySelector(
        modelNumberSelector
      ) as HTMLDivElement
      const model_number = modelEl.innerText

      // Product data
      const productList = [
        ...document.querySelectorAll(productListSelector + ' > p'),
      ] as HTMLParagraphElement[]

      let color: productField = null
      let size: productField = null
      let length: productField = null
      let in_carton: productField = null
      let in_bundle: productField = null
      let in_intensity: productField = null
      let in_box: productField = null
      let creator: productField = null

      if (productList.length && productList.length > 1) {
        for (let pEl of [...productList]) {
          let data = null

          const textList = pEl.innerText.split(':')
          if (pEl.innerText.includes(':')) textList.shift()

          data = textList.join(':').trim()

          const elContains = (text: string) => pEl.innerText.includes(text)
          const startsWith = (text: string) =>
            pEl.innerText.trim().startsWith(text)

          if (elContains('اللون') && startsWith('اللون')) {
            color = data
          }

          if (
            elContains('مقاس') &&
            (startsWith('مقاس') ||
              startsWith('المقاس') ||
              startsWith('المقاسات') ||
              startsWith('لمقاس'))
          ) {
            size = data
          }

          if (elContains('الطول') && startsWith('الطول')) {
            length = data
          }

          if (elContains('العدد في الكرتون')) {
            in_carton = data
          }

          if (elContains('العدد في الربطة')) {
            in_bundle = data
          }

          if (elContains('العدد في الشدة')) {
            in_intensity = data
          }

          if (elContains('العدد في العلبة')) {
            in_box = data
          }

          if (elContains('المصنع') && startsWith('المصنع')) {
            creator = data
          }
        }
      }

      // Product url
      const url = getMetadata('og:url')

      // Getting all images from product
      const imagesHref = [...document.querySelectorAll(imageSelector)].map(
        (el) => {
          const image = el.querySelector('a > img') as HTMLImageElement
          return image.src
        }
      )

      const images = imagesHref.join(' | ')

      return {
        title,
        description,
        color,
        size,
        length,
        in_carton,
        in_bundle,
        in_intensity,
        in_box,
        creator,
        pretax_price,
        sale_price,
        price,
        availability,
        condition,
        id,
        category,
        model_number,
        url,
        images,
      }
    },
    PRODUCT_IMAGE_SELECTOR,
    MODEL_NUMBER_SELECTOR,
    PRODUCT_TEXT_LIST
  )

  // data = { ...scrappedData }

  return scrappedData
}
