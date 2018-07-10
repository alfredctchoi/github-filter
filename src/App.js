import React, { Component } from 'react'
import './App.css'

const handleOnTabRemove = tabId => {
  window.chrome.storage.local.remove(tabId.toString())
}

class App extends Component {
  constructor(props) {
    super(props)
    this.form = null
    this.onChange = this.onChange.bind(this)

    this.state = {
      filter: '',
      filterType: ''
    }
  }

  componentDidMount() {
    window.chrome.tabs.onRemoved.addListener(handleOnTabRemove)
    window.chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tabId = tabs[0].id
      window.chrome.tabs.insertCSS(tabId, {
        file: 'styles.css'
      })
      window.chrome.storage.local.get(tabId.toString(), result => {
        if (!result[tabId]) {
          return
        }

        const { filter, filterType } = result[tabId]
        this.setState({
          filter,
          filterType
        })
      })
    })
    this.form.filter.focus()
  }

  componentWillUnmount() {
    window.chrome.tabs.onRemoved.removeListener(handleOnTabRemove)
  }

  onChange(e) {
    e.preventDefault()
    const { filterType: filterTypeEl, filter: filterEl } = this.form
    const [filterType, filter] = [filterTypeEl.value, filterEl.value]
    const values = { filter, filterType }

    this.setState(values)
    window.chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tabId = tabs[0].id
      window.chrome.storage.local.set({
        [tabId]: values
      })
      window.chrome.tabs.sendMessage(tabId, {
        action: 'filter',
        data: {
          filters: [values]
        }
      })
    })
  }

  render() {
    const { filter, filterType } = this.state
    return (
      <div className="app">
        <h4 className="app__title">GitHub File Filter</h4>
        <hr />
        <form
          ref={f => {
            this.form = f
          }}
          className="app__form"
          autocomplete="off"
          role="presentation">
          <div className="form-group">
            <label htmlFor="filterType">Filter Type</label>
            <select
              value={filterType}
              className="form-control"
              id="filterType"
              name="filterType"
              onChange={this.onChange}>
              <option value="doesNotContain">does not contain</option>
              <option value="contains">contains</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="filter">Filter Text</label>
            <input
              value={filter}
              onChange={this.onChange}
              className="form-control"
              id="filter"
              type="text"
              name="filter"
              placeholder="spec.js"
            />
          </div>
        </form>
      </div>
    )
  }
}

export default App
