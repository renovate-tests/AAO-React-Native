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

	render() {
		return (
			<View>
				<Text>Lifecycle Screen</Text>
				<Text>{this.state.text}</Text>
				<Text>{this.props.text}</Text>
			</View>
		)
	}
}

// AppRegistry.registerComponent('AllAboutOlaf', () => App)
Navigation.registerComponent(
	'navigation.playground.WelcomeScreen',
	() => LifecycleScreenExample,
)
Navigation.registerComponent(
	'navigation.playground.tab1',
	() => LifecycleScreenExample,
)
Navigation.registerComponent(
	'navigation.playground.tab2',
	() => LifecycleScreenExample,
)

Navigation.events().registerAppLaunchedListener(() => {
	Navigation.setRoot({
		root: {
			stack: {
				options: {
					topBar: {
						visible: true,
					},
				},
				children: [
					{
						component: {
							name: 'navigation.playground.WelcomeScreen',
							passProps: {
								text: 'This is screen 1',
							},
						},
					},
					{
						bottomTabs: {
							children: [
								{
									component: {
										name: 'navigation.playground.tab1',
										passProps: {
											text: 'This is tab 1',
										},
										options: {
											bottomTab: {
												text: 'Tab 1',
												icon: require('../images/icons/old-main.png'),
											},
										},
									},
								},
								{
									component: {
										name: 'navigation.playground.tab2',
										passProps: {
											text: 'This is tab 2',
										},
										options: {
											bottomTab: {
												text: 'Tab 2',
												icon: require('../images/icons/windmill.png'),
											},
										},
									},
								},
							],
							options: {},
						},
					},
				],
			},
		},
	})
})
