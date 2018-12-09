// @flow

import {Navigation} from 'react-native-navigation'
import {routes} from './routes'

const initialStack = [{component: {name: 'app.home.view'}}]

Navigation.events().registerAppLaunchedListener(() => {
	Navigation.setRoot({
		root: {
			stack: {children: initialStack},
		},
	})
})
