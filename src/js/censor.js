/**
 * Walk the webpage, censoring terms
 */
import browser from "webextension-polyfill"
import findAndReplaceDOMText from "findandreplacedomtext"
import { countTerms } from "./utils"

/**
 * Censor any terms appearing in the document that may be bullshit
 */
export const censorDocument = async () => {
  const { terms } = await browser.storage.sync.get("terms")
  if (!terms) return []

  applyCensorship(terms)

  await browser.storage.sync.set({ active: true })

  return sendUpdateBadge({ active: true })
}

/**
 * Obscure the page content matching the list of censored terms
 */
const applyCensorship = async terms => {
  const termsRegex = new RegExp(`\\b(${terms.join("|")})\\b`, "gi")
  const { redaction } = await browser.storage.sync.get("redaction")

  findAndReplaceDOMText(document.body, {
    find: termsRegex,
    wrap: "span",
    wrapClass: redaction, // CSS classname to apply selected censorship styling
    preset: "prose",
  })
}

/**
 * Remove any CSS classes used to censor the document
 */
export const uncensorDocument = async () => {
  const { redaction } = await browser.storage.sync.get("redaction")
  const terms = document.querySelectorAll(`span.${redaction}`)

  terms.forEach(term => term.classList.remove(redaction))

  await browser.storage.sync.set({ active: false })

  return sendUpdateBadge({ active: false })
}

/**
 * Send a message to the background page to update the badge
 */
const sendUpdateBadge = async ({ active }) => {
  const count = await countTerms()
  return browser.runtime.sendMessage({
    message: "updateBadge",
    active,
    count,
  })
}
