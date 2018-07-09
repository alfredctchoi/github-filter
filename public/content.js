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
  const type = filters[0].type
  const filter = filters[0].filter
  const elements = document.querySelectorAll('.file-info > a')
  Array.from(elements).forEach(e => {
    const filename = e.text
    if (type === 'contains' && !filename.includes(filter)) {
      hideFileDiff(e)
    }

    if (type === 'doesNotContain' && filename.includes(filter)) {
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
  switch (msg.action) {
    case 'filter':
      clearFilters()
      filterFiles(msg.data)
      break;
    case 'clear':
      clearFilters()
      break;
  }
  sendResponse()
})

function init() {
  const css = `
    .${hideClass} { display: none }
  `
  const styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  styleElement.appendChild(document.createTextNode(css))
  document.head.appendChild(styleElement)
}

init()
