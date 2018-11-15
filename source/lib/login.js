// @flow

import {Alert} from 'react-native'
import {trackLogOut, trackLogIn, trackLoginFailure} from '@frogpond/analytics'
import {
	setInternetCredentials,
	getInternetCredentials,
	resetInternetCredentials,
} from 'react-native-keychain'
import buildFormData from './formdata'
import {OLECARD_AUTH_URL} from './financials/urls'

const SIS_LOGIN_KEY = 'stolaf.edu'
const empty = () => ({})

type MaybeCredentials = {username?: string, password?: string}

export type LoginResultEnum =
	| 'success'
	| 'no-network'
	| 'bad-credentials'
	| 'no-credentials'

export type LoginResult = {type: LoginResultEnum}

export function loadCredentials(): Promise<MaybeCredentials> {
	return getInternetCredentials(SIS_LOGIN_KEY).catch(empty)
}

export function saveCredentials(user: string, pass: string): Promise<void> {
	return setInternetCredentials(SIS_LOGIN_KEY, user, pass).catch(empty)
}

export function clearCredentials(): Promise<void> {
	trackLogOut()
	return resetInternetCredentials(SIS_LOGIN_KEY).catch(empty)
}

export async function validateCredentials({
	maxAttempts = 3,
}: {maxAttempts?: number} = {}): Promise<LoginResult> {
	let {username, password} = await loadCredentials()
	if (!username || !password) {
		trackLoginFailure('No credentials')
		showUnknownLoginMessage()
		return {type: 'no-credentials'}
	}

	let form = buildFormData({username, password})
	try {
		let loginResult = await fetch(OLECARD_AUTH_URL, {
			method: 'POST',
			body: form,
		})

		let page = await loginResult.text()
		if (page.includes('Password')) {
			trackLoginFailure('Bad credentials')
			showInvalidLoginMessage()
			return {type: 'bad-credentials'}
		}

		trackLogIn()
		return {type: 'success'}
	} catch (err) {
		let wasNetworkFailure = err.message === 'Network request failed'
		if (wasNetworkFailure && maxAttempts > 0) {
			return validateCredentials({maxAttempts: maxAttempts - 1})
		}

		trackLoginFailure('No network')
		showNetworkFailureMessage()
		return {type: 'no-network'}
	}
}

export const showNetworkFailureMessage = () =>
	Alert.alert(
		'Network Failure',
		'You are not connected to the internet. Please connect if you want to access this feature.',
		[{text: 'OK'}],
	)

export const showInvalidLoginMessage = () =>
	Alert.alert(
		'Invalid Login',
		'The username and password you provided do not match a valid account. Please try again.',
		[{text: 'OK'}],
	)

export const showUnknownLoginMessage = () =>
	Alert.alert(
		'Unknown Login',
		'No username and password were provided. Please try again.',
		[{text: 'OK'}],
	)
