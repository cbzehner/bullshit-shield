/**
 * Count the censored terms on a page
 */
import browser from "webextension-polyfill"

/**
 * Watch for messages calling countTerms.js
 */
const count = async message => {
  if (message !== "countTerms") return

  const { redaction } = await browser.storage.sync.get("redaction")
  const count = document.querySelectorAll(`span.${redaction}`).length

  return { count }
}

browser.runtime.onMessage.addListener(count)
