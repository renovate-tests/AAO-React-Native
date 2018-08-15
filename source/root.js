// @flow

import * as React from 'react'
import {YellowBox, ScrollView, Text, TouchableHighlight} from 'react-native'
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
	static options = {
		topBar: {
			searchBar: true, // iOS 11+ native UISearchBar inside topBar
			title: {
				text: 'Title',
			},
		},

		// rightButtons: [
		// 	{
		// 		id: 'buttonOne',
		// 		icon: require('../images/icons/old-main.png'),
		// 	},
		// ],
	}

	constructor(props) {
		super(props)
		Navigation.events().bindComponent(this)
	}

	onPressPush = async () => {
		await Navigation.push(this.props.componentId, {
			component: {
				name: 'navigation.playground.PushedScreen',
				options: {
					topBar: {
						title: {
							text: 'pushed',
						},
					},
				},
			},
		})

		// await Navigation.push(this.props.componentId, {
		// 	bottomTabs: {
		// 		children: [
		// 			{
		// 				stack: {
		// 					children: [
		// 						{
		// 							component: {
		// 								name: 'navigation.playground.PushedScreen',
		// 								passProps: {
		// 									text: 'This is tab 1',
		// 								},
		// 								options: {
		// 									bottomTab: {
		// 										text: 'Tab 1',
		// 										icon: require('../images/icons/old-main.png'),
		// 									},
		// 								},
		// 							},
		// 						},
		// 					],
		// 				},
		// 			},
		// 		],
		// 	},
		// })

		// await Navigation.push(this.props.componentId, {
		// 	bottomTabs: {
		// 		stack: {
		// 			children: [
		// 				{
		// 					component: {
		// 						name: 'navigation.playground.tab',
		// 						passProps: {
		// 							text: 'This is tab 1',
		// 						},
		// 					},
		// 					options: {
		// 						bottomTab: {
		// 							text: 'Tab 1',
		// 							icon: require('../images/icons/old-main.png'),
		// 						},
		// 					},
		// 				},
		// 				{
		// 					component: {
		// 						name: 'navigation.playground.tab',
		// 						passProps: {
		// 							text: 'This is tab 2',
		// 						},
		// 						options: {
		// 							bottomTab: {
		// 								text: 'Tab 2',
		// 								icon: require('../images/icons/windmill.png'),
		// 							},
		// 						},
		// 					},
		// 				},
		// 			],
		// 		},
		// 	},
		// })
	}

	render() {
		return (
			<ScrollView contentContainerStyle={{backgroundColor: '#faf'}}>
				<Text>Tab Screen</Text>
				<Text>{this.props.text}</Text>
				<Text>{this.props.componentId}</Text>
				<TouchableHighlight onPress={this.onPressPush}>
					<Text>Open</Text>
				</TouchableHighlight>
			</ScrollView>
		)
	}
}

class TabScreenExample extends React.Component<any, any> {
	static options = {
		topBar: {
			searchBar: true, // iOS 11+ native UISearchBar inside topBar
			title: {
				text: 'Tabbed Title',
			},
		},

		// bottomTab: {
		// 	badge: '2',
		// 	badgeColor: 'red',
		// 	iconColor: 'red',
		// 	selectedIconColor: 'blue',
		// 	textColor: 'red',
		// 	selectedTextColor: 'blue',
		// // },

		// // bottomTab: {
		// 	text: 'Tab 1',
		// 	icon: require('../images/icons/old-main.png'),
		// 	testID: 'FIRST_TAB_BAR_BUTTON',
		// },
	}

	constructor(props) {
		super(props)
		Navigation.events().bindComponent(this)
	}

	render() {
		return (
			<ScrollView>
				<Text>Lifecycle Screen</Text>
				<Text>{this.props.text}</Text>
				<Text>{this.props.componentId}</Text>
			</ScrollView>
		)
	}
}

// AppRegistry.registerComponent('AllAboutOlaf', () => App)
Navigation.registerComponent(
	'navigation.playground.WelcomeScreen',
	() => LifecycleScreenExample,
)

Navigation.registerComponent(
	'navigation.playground.tab',
	() => TabScreenExample,
)

Navigation.registerComponent(
	'navigation.playground.PushedScreen',
	() => TabScreenExample,
)

Navigation.events().registerAppLaunchedListener(() => {
	Navigation.setDefaultOptions({
		topBar: {
			visible: true,

			searchBar: false, // iOS 11+ native UISearchBar inside topBar
			searchBarHiddenWhenScrolling: true,
			searchBarPlaceholder: 'Search', // iOS 11+ SearchBar placeholder

			// iOS 11+ Large Title
			largeTitle: {
				visible: true,
			},
			backButton: {
				showTitle: true,
			},

			translucent: true,
		},
	})

	Navigation.setRoot({
		root: {
			stack: {
				children: [
					{
						component: {
							name: 'navigation.playground.WelcomeScreen',
							passProps: {
								text: 'This is screen 1',
							},
						},
					},
				],
			},
		},
	})
})
