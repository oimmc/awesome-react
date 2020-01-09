import React, { Component } from 'react'
import loadable from '@loadable/component'
import './assets/style/app.less'

import circle from './assets/svg/circle.svg'

const Test = loadable(() => import(/* webpackPrefetch: true */ /* webpackChunkName: "test" */'./Test'))

const a = 1

class App extends Component {
	render() {
		return (
			<div id='app'>
				<div className='aa'>react-dev-utils</div>
				{a === 1 && <Test />}
				<img src={circle} />
			</div>
		)
	}
}

export default App
