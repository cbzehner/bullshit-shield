/**
 * Walk the webpage, censoring terms
 */

// const censor = () => {
//   chrome.runtime.sendMessage({ message: "censoredTerms" }, response => {
//     if (response.terms) {
//       censorBullshit(response.terms)
//     }
//   })
// }

const censorBullshit = bullshitTerms => {
  const root = document.body
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ALL,
    null,
    false
  )

  const terms = new Set(["Chrome", "extension"])
  const redactionClass = "blurred" // Options: blurred invisible-ink redacted

  // https://stackoverflow.com/questions/15553280/replace-a-textnode-with-html-text-in-javascript
  // https://devdocs.io/dom/childnode/replacewith
  while (walker.nextNode()) {
    const current = walker.currentNode
    const isCandidateNode =
      current.childElementCount === 0 || current.tagName === "P"

    if (isCandidateNode && current.textContent) {
      terms.forEach(term => {
        if (current.textContent.includes(term)) {
          debugger
          // TODO: Avoid splitting the terms if they're part of a hyperlink
          const contents = current.innerHTML.split(term)
          current.innerHTML = contents.join(
            `<span class="${redactionClass}">${term}</span>`
          )
        }
      })
      walker.nextNode() // Step over the current node
      walker.nextNode() // Step over the newly inserted span
    }
  }
}

censorBullshit()
// censor()
