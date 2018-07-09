import React, { Component } from 'react'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onClearClick = this.onClearClick.bind(this)
  }

  onClearClick(e) {
    e.preventDefault()
    window.chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      window.chrome.tabs.sendMessage(tabs[0].id, {
        action: 'clear'
      })
    })
  }

  onSubmit(e) {
    e.preventDefault()
    const { elements } = e.target
    const { filterType, filter } = elements
    window.chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      window.chrome.tabs.sendMessage(tabs[0].id, {
        action: 'filter',
        data: {
          filters: [
            {
              type: filterType.value,
              filter: filter.value
            }
          ]
        }
      })
    })
  }

  render() {
    return (
      <div className="app">
        <h4 className="app__title">GitHub File Filter</h4>
        <hr />
        <form className="app__form" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="filterType">Filter Type</label>
            <select className="form-control" id="filterType" name="filterType">
              <option value="doesNotContain">does not contain</option>
              <option value="contains">contains</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="filter">Filter Text</label>
            <input
              className="form-control"
              id="filter"
              type="text"
              name="filter"
              placeholder="spec.js"
            />
          </div>
          <div className="form-group text-center">
            <input
              className="btn btn-primary btn-block"
              type="submit"
              value="Filter"
            />
          </div>
          <div className="text-center">
            <a href="javascript:void(0)" onClick={this.onClearClick}>
              Clear
            </a>
          </div>
        </form>
      </div>
    )
  }
}

export default App
