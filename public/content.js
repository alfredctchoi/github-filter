const fileDivClassName = 'file'
const hideClass = 'ghf-hide'

const hideFileDiff = e => {
  let parent = e
  while (parent && !parent.classList.contains(fileDivClassName)) {
    parent = parent.parentElement
  }

  if (parent) {
    parent.classList.add(hideClass)
  }
}

const filterFiles = ({ filters }) => {
  const filterType = filters[0].filterType
  const filter = filters[0].filter
  const elements = document.querySelectorAll('.file-info > a')

  if (!filter) {
    return
  }

  Array.from(elements).forEach(e => {
    const filename = e.text
    if (filterType === 'contains' && !filename.includes(filter)) {
      hideFileDiff(e)
    }

    if (filterType === 'doesNotContain' && filename.includes(filter)) {
      hideFileDiff(e)
    }
  })
}

const clearFilters = () => {
  const elements = document.querySelectorAll(`.${hideClass}`)
  Array.from(elements).forEach(e => e.classList.remove(hideClass))
}

// Listen for messages
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action === 'filter') {
    clearFilters()
    filterFiles(msg.data)
  }
  sendResponse()
})
