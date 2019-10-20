/**
 * Walk the webpage, censoring terms
 */
import browser from "webextension-polyfill"
import findAndReplaceDOMText from "findandreplacedomtext"

/**
 * Censor any terms appearing in the document that may be bullshit
 */
const censorDocument = async () => {
  const { terms } = await browser.storage.sync.get("terms")
  if (!terms) return []

  applyCensorship(terms)
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

censorDocument()
