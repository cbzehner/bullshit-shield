/**
 * Walk the webpage, censoring terms
 */
import findAndReplaceDOMText from "findandreplacedomtext"
import bullshitTerms from "./terms"

// const censor = () => {
//   chrome.runtime.sendMessage({ message: "censoredTerms" }, response => {
//     if (response.terms) {
//       censorBullshit(response.terms)
//     }
//   })
// }

const censorBullshit = () => {
  const bullshitRe = new RegExp(`\\b(${bullshitTerms.join("|")})\\b`, "gi")
  const redactionClass = "blurred" // Options: blurred invisible-ink redacted

  findAndReplaceDOMText(document.body, {
    find: bullshitRe,
    wrap: "span",
    wrapClass: redactionClass,
    preset: "prose",
  })
}

censorBullshit()
// censor()
