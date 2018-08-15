// @flow

import * as React from 'react'
import {YellowBox, View, Text} from 'react-native'
import {Navigation} from 'react-native-navigation'
// import App from './app'

// I'm not importing the exported variable because I just want to initialize
// the file here.
import './bugsnag'

YellowBox.ignoreWarnings([
	// TODO: remove me after upgrading to RN 0.56
	'Warning: isMounted(...) is deprecated',
	// TODO: remove me after upgrading to RN 0.56
	'Module RCTImageLoader',
])

class LifecycleScreenExample extends React.Component<any, any> {
	constructor(props) {
		super(props)
		Navigation.events().bindComponent(this)
	}

	state = {
		text: 'nothing yet',
	}

	componentWillUnmount() {
		alert('componentWillUnmount')
	}

	componentDidAppear() {
		this.setState(() => ({text: 'componentDidAppear'}))
	}

	componentDidDisappear() {
		alert('componentDidDisappear')
	}

	navigationButtonPressed({buttonId}) {
		// a navigation-based button (for example in the topBar) was clicked. See section on buttons.
		alert(buttonId)
	}

	render() {
		return (
			<View>
				<Text>Lifecycle Screen</Text>
				<Text>{this.state.text}</Text>
			</View>
		)
	}
}

// AppRegistry.registerComponent('AllAboutOlaf', () => App)
Navigation.registerComponent(
	'navigation.playground.WelcomeScreen',
	() => LifecycleScreenExample,
)

Navigation.events().registerAppLaunchedListener(() => {
	Navigation.setRoot({
		root: {
			component: {
				name: 'navigation.playground.WelcomeScreen',
			},
		},
	})
})
