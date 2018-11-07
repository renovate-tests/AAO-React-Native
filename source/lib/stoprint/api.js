// @flow

import {PAPERCUT_MOBILE_RELEASE_API, PAPERCUT_API, PAPERCUT} from './urls'
import querystring from 'query-string'
import {encode} from 'base-64'
import {API} from '@frogpond/api'
import type {
	PrintJobsResponseOrErrorType,
	AllPrintersResponseOrErrorType,
	ColorPrintersResponseOrErrorType,
	RecentPopularPrintersResponseOrErrorType,
	ReleaseResponseOrErrorType,
	CancelResponseOrErrorType,
	HeldJobsResponseOrErrorType,
	LoginResponseOrErrorType,
} from './types'

const PAPERCUT_API_HEADERS = {
	'Content-Type': 'application/x-www-form-urlencoded',
	Origin: PAPERCUT,
}

type PapercutResponse =
	| {error: false, value: any}
	| {error: true, value: string}

const papercutPost = async (url: string, body?: {[string]: mixed}) => {
	try {
		body = querystring.stringify(body, {arrayFormat: 'bracket'})
		let response = await fetchJson(url, {
			method: 'POST',
			headers: new Headers(PAPERCUT_API_HEADERS),
			body: body,
		})
		return {error: false, value: response}
	} catch (error) {
		return {error: true, value: error}
	}
}

const papercutGet = async (url: string) => {
	try {
		let response = await fetchJson(url, {
			method: 'POST',
			headers: new Headers(PAPERCUT_API_HEADERS),
		})
		return {error: false, value: response}
	} catch (error) {
		return {error: true, value: error}
	}
}

const orError = (message: string) => (resp: PapercutResponse) =>
	resp.error ? {error: true, value: message} : resp

export async function logIn(
	username: string,
	password: string,
): Promise<'success' | string> {
	const now = new Date().getTime()
	const url = `${PAPERCUT_API}/webclient/users/${username}/log-in?nocache=${now}`
	const body = querystring.stringify({password: encode(password)})
	const result: LoginResponseOrErrorType = await papercutPost(url, body)

	if (result.error) {
		return 'The print server seems to be having some issues.'
	}

	if (!result.value.success) {
		return 'Your username or password appear to be invalid.'
	}

	return 'success'
}

export function fetchJobs(
	username: string,
): Promise<PrintJobsResponseOrErrorType> {
	let url = `${PAPERCUT_API}/webclient/users/${username}/jobs/status`
	return papercutGet(url).then(
		orError('Unable to fetch a list of print jobs from stoPrint.'),
	)
}

export function fetchAllPrinters(
	username: string,
): Promise<AllPrintersResponseOrErrorType> {
	let url = `${PAPERCUT_MOBILE_RELEASE_API}/all-printers?username=${username}`
	return papercutGet(url).then(
		orError('Unable to fetch the list of all printers from stoPrint.'),
	)
}

export function fetchRecentPrinters(
	username: string,
): Promise<RecentPopularPrintersResponseOrErrorType> {
	let url = `${PAPERCUT_MOBILE_RELEASE_API}/recent-popular-printers?username=${username}`
	return papercutGet(url).then(
		orError('Unable to fetch a list of recent printers from stoPrint.'),
	)
}

export function fetchColorPrinters(): Promise<
	ColorPrintersResponseOrErrorType,
> {
	let url = API('/printing/color-printers')
	return papercutGet(url).then(
		orError('Unable to fetch the list of color printers from stoPrint.'),
	)
}

export function heldJobsAvailableAtPrinterForUser(
	printerName: string,
	username: string,
): Promise<HeldJobsResponseOrErrorType> {
	let url = `${PAPERCUT_MOBILE_RELEASE_API}/held-jobs/?username=${username}&printerName=printers%5C${printerName}`
	return papercutGet(url).then(
		orError('Unable to fetch the list of held jobs from stoPrint.'),
	)
}

export function cancelPrintJobForUser(
	jobId: string,
	username: string,
): Promise<CancelResponseOrErrorType> {
	let url = `${PAPERCUT_MOBILE_RELEASE_API}/held-jobs/cancel?username=${username}`
	return papercutPost(url, {jobIds: [jobId]}).then(
		orError('Unable to cancel the print job in stoPrint.'),
	)
}

export function releasePrintJobToPrinterForUser(args: {
	jobId: any,
	printerName: string,
	username: string,
}): Promise<ReleaseResponseOrErrorType> {
	let {jobId, printerName, username} = args
	let url = `${PAPERCUT_MOBILE_RELEASE_API}/held-jobs/release?username=${username}`

	return papercutPost(url, {
		printerName: `printers\\${printerName}`,
		jobIds: [jobId],
	}).then(result => {
		if (result.error === false && result.value.numJobsReleased === 0) {
			return orError('Unable to releast the print job in stoPrint.')(result)
		}
		return result
	})
}
