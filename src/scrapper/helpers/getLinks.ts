import type { Page } from 'puppeteer'
import {
  MORE_BTN_SELECTOR,
  PRODUCT_LINK_SELECTOR,
  PRODUCT_LIST_SELECTOR,
} from '../constants'

export default async (page: Page, limit?: number) => {
  return await page.evaluate(
    async (
      moreBtnSelector,
      productListSelector,
      productLinkSelector,
      limit
    ) => {
      const moreBtn = document.querySelector(
        moreBtnSelector
      ) as HTMLElement | null

      return await new Promise<any>((resolve) => {
        // show all products until button disappear
        const timer = setInterval(() => {
          if (moreBtn) {
            moreBtn.click()
          }

          if (!moreBtn || moreBtn.style.display === 'none') {
            // after reaching the end return all products' links
            const productList = document.querySelector(productListSelector)!

            let products = [...productList.children]

            if (limit && limit < products.length) {
              products = products.slice(0, limit)
            }

            const productsLinks = products.map((el) => {
              const product = el.querySelector(
                productLinkSelector
              ) as HTMLLinkElement

              return product.href
            })

            clearInterval(timer)
            resolve(productsLinks)
          }
        }, 100)
      })
    },
    MORE_BTN_SELECTOR,
    PRODUCT_LIST_SELECTOR,
    PRODUCT_LINK_SELECTOR,
    limit
  )
}
