// @flow
import {
	loadCredentials,
	type LoginResultEnum,
	showUnknownLoginMessage,
	showInvalidLoginMessage,
	showNetworkFailureMessage,
} from '../login'
import {trackLoginFailure} from '@frogpond/analytics'
import buildFormData from '../formdata'
import {OLECARD_AUTH_URL, OLECARD_DATA_ENDPOINT} from './urls'
import type {BalancesShapeType, OleCardBalancesType} from './types'

type BalancesOrErrorType =
	| {type: LoginResultEnum}
	| {type: 'error', value: string}
	| {type: 'data', value: BalancesShapeType}

export async function getBalances({
	maxAttempts = 3,
}: {maxAttempts?: number} = {}): Promise<BalancesOrErrorType> {
	let {username, password} = await loadCredentials()
	if (!username || !password) {
		trackLoginFailure('No credentials')
		showUnknownLoginMessage()
		return {type: 'no-credentials'}
	}

	let form = buildFormData({username, password})
	try {
		// start the OleCard session
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

		// fetch the balances page
		let resp: OleCardBalancesType = await fetchJson(OLECARD_DATA_ENDPOINT)
		if (resp.error != null) {
			return {type: 'error', value: resp.error}
		}

		// extract and return the data
		return {type: 'data', value: getBalancesFromData(resp)}
	} catch (err) {
		let wasNetworkFailure = err.message === 'Network request failed'
		if (wasNetworkFailure && maxAttempts > 0) {
			return getBalances({maxAttempts: maxAttempts - 1})
		}

		trackLoginFailure('No network')
		showNetworkFailureMessage()
		return {type: 'no-network'}
	}
}

const accounts = {
	flex: 'STO Flex',
	ole: 'STO Ole Dollars',
	print: 'STO Student Printing',
}

function getBalancesFromData(resp: OleCardBalancesType): BalancesShapeType {
	let flex = resp.data.accounts.find(a => a.account === accounts.flex)
	let ole = resp.data.accounts.find(a => a.account === accounts.ole)
	let print = resp.data.accounts.find(a => a.account === accounts.print)

	let daily = resp.data.meals && resp.data.meals.leftDaily
	let weekly = resp.data.meals && resp.data.meals.leftWeekly
	let plan = resp.data.meals && resp.data.meals.plan

	return {
		flex: flex || flex === 0 ? flex.formatted : null,
		ole: ole || ole === 0 ? ole.formatted : null,
		print: print || print === 0 ? print.formatted : null,
		daily: daily == null ? null : daily,
		weekly: weekly == null ? null : weekly,
		plan: plan == null ? null : plan,
	}
}
