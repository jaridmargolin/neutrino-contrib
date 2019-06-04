/* global title, description */
import { hot } from 'react-hot-loader'
import React from 'react'
import leftPad from 'left-pad'
import libLeftPad from 'neutrino-contrib-lib'
import SimpleSVG from './Simple.react.svg'
import './App.css'
import './App.less'

const App = () => (
  <div className='App'>
    <h1>{title}</h1>
    <p>{description}</p>
    <span>{leftPad === libLeftPad ? 'RootMost' : 'Fail'}</span>
    <SimpleSVG />
  </div>
)

export default hot(module)(App)
