import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App'
import generateItems from './generateItems';

const items = generateItems(15)

ReactDOM.render(<App items={items} />, document.getElementById('app'))
