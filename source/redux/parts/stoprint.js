// @flow

import {type ReduxState} from '../index'
import {loadCredentials} from '../../lib/login'
import type {PrintJob, Printer} from '../../lib/stoprint'
import {
	fetchAllPrinters,
	fetchColorPrinters,
	fetchJobs,
	fetchRecentPrinters,
	logIn,
	type StoPrintLoginResultEnum,
} from '../../lib/stoprint'

type Dispatch<A: Action> = (action: A | Promise<A> | ThunkAction<A>) => any
type GetState = () => ReduxState
type ThunkAction<A: Action> = (dispatch: Dispatch<A>, getState: GetState) => any
type Action =
	| UpdateAllPrintersAction
	| UpdatePrintJobsAction
	| SetLoginStatusAction

const SET_LOGIN_STATUS: 'stoprint/SET_LOGIN_STATUS' =
	'stoprint/SET_LOGIN_STATUS'

const UPDATE_ALL_PRINTERS_FAILURE: 'stoprint/UPDATE_ALL_PRINTERS/FAILURE' =
	'stoprint/UPDATE_ALL_PRINTERS/FAILURE'

const UPDATE_ALL_PRINTERS_SUCCESS: 'stoprint/UPDATE_ALL_PRINTERS/SUCCESS' =
	'stoprint/UPDATE_ALL_PRINTERS/SUCCESS'

const UPDATE_PRINT_JOBS_FAILURE: 'stoprint/UPDATE_PRINT_JOBS/FAILURE' =
	'stoprint/UPDATE_PRINT_JOBS/FAILURE'

const UPDATE_PRINT_JOBS_SUCCESS: 'stoprint/UPDATE_PRINT_JOBS/SUCCESS' =
	'stoprint/UPDATE_PRINT_JOBS/SUCCESS'

type SetLoginStatusAction = {
	type: typeof SET_LOGIN_STATUS,
	payload: StoPrintLoginResultEnum,
}

type UpdateAllPrintersFailureAction = {
	type: typeof UPDATE_ALL_PRINTERS_FAILURE,
	payload: string,
}

type UpdateAllPrintersSuccessAction = {
	type: typeof UPDATE_ALL_PRINTERS_SUCCESS,
	payload: {
		allPrinters: Array<Printer>,
		popularPrinters: Array<Printer>,
		recentPrinters: Array<Printer>,
		colorPrinters: Array<Printer>,
	},
}

type UpdateAllPrintersAction =
	| UpdateAllPrintersSuccessAction
	| UpdateAllPrintersFailureAction

type UpdatePrintJobsFailureAction = {
	type: typeof UPDATE_PRINT_JOBS_FAILURE,
	payload: string,
}

type UpdatePrintJobsSuccessAction = {
	type: typeof UPDATE_PRINT_JOBS_SUCCESS,
	payload: Array<PrintJob>,
}

type UpdatePrintJobsAction =
	| UpdatePrintJobsSuccessAction
	| UpdatePrintJobsFailureAction

export function updatePrinters(): ThunkAction<Action> {
	return async dispatch => {
		let {username, password} = await loadCredentials()

		dispatch({type: SET_LOGIN_STATUS, payload: 'checking'})
		let loginState = await logIn(username, password)
		dispatch({type: SET_LOGIN_STATUS, payload: loginState})

		if (loginState !== 'success') {
			return dispatch({
				type: UPDATE_ALL_PRINTERS_FAILURE,
				payload: loginState,
			})
		}

		if (!username) {
			return
		}

		const [
			allPrintersResponse,
			recentAndPopularPrintersResponse,
			colorPrintersResponse,
		] = await Promise.all([
			fetchAllPrinters(username),
			fetchRecentPrinters(username),
			fetchColorPrinters(),
		])

		if (allPrintersResponse.error) {
			return dispatch({
				type: UPDATE_ALL_PRINTERS_FAILURE,
				payload: allPrintersResponse.value,
			})
		}

		if (recentAndPopularPrintersResponse.error) {
			return dispatch({
				type: UPDATE_ALL_PRINTERS_FAILURE,
				payload: recentAndPopularPrintersResponse.value,
			})
		}

		if (colorPrintersResponse.error) {
			return dispatch({
				type: UPDATE_ALL_PRINTERS_FAILURE,
				payload: colorPrintersResponse.value,
			})
		}

		let {recentPrinters} = recentAndPopularPrintersResponse.value
		let {popularPrinters} = recentAndPopularPrintersResponse.value
		let allPrinters = allPrintersResponse.value

		let colorPrinters = allPrinters.filter(printer =>
			colorPrintersResponse.value.data.colorPrinters.includes(
				printer.printerName,
			),
		)

		dispatch({
			type: UPDATE_ALL_PRINTERS_SUCCESS,
			payload: {
				allPrinters,
				recentPrinters,
				popularPrinters,
				colorPrinters,
			},
		})
	}
}

export function updatePrintJobs(): ThunkAction<Action> {
	return async dispatch => {
		let {username, password} = await loadCredentials()

		dispatch({type: SET_LOGIN_STATUS, payload: 'checking'})
		let loginState = await logIn(username, password)
		dispatch({type: SET_LOGIN_STATUS, payload: loginState})

		if (loginState === 'server-error') {
			return dispatch({
				type: UPDATE_PRINT_JOBS_FAILURE,
				payload: 'The print server seems to be having some issues.',
			})
		} else if (loginState === 'bad-credentials') {
			return dispatch({
				type: UPDATE_PRINT_JOBS_FAILURE,
				payload: 'Your username or password appear to be invalid.',
			})
		} else if (loginState === 'no-credentials') {
			return dispatch({
				type: UPDATE_PRINT_JOBS_FAILURE,
				payload: 'Please log in in the app settings.',
			})
		}

		if (!username) {
			return
		}

		let jobsResponse = await fetchJobs(username)

		if (jobsResponse.error) {
			return dispatch({
				type: UPDATE_PRINT_JOBS_FAILURE,
				payload: jobsResponse.value,
			})
		}

		dispatch({
			type: UPDATE_PRINT_JOBS_SUCCESS,
			payload: jobsResponse.value.jobs,
		})
	}
}

export type State = {|
	jobs: Array<PrintJob>,
	printers: Array<Printer>,
	recentPrinters: Array<Printer>, // printer names
	popularPrinters: Array<Printer>, // printer names
	colorPrinters: Array<Printer>,
	jobsError: ?string,
	printersError: ?string,
	loginStatus: StoPrintLoginResultEnum,
|}

const initialState: State = {
	jobsError: null,
	printersError: null,
	jobs: [],
	printers: [],
	recentPrinters: [],
	popularPrinters: [],
	colorPrinters: [],
	loginStatus: 'unknown',
}

export function stoprint(state: State = initialState, action: Action) {
	switch (action.type) {
		case SET_LOGIN_STATUS:
			return {...state, loginStatus: action.payload}

		case UPDATE_PRINT_JOBS_FAILURE:
			return {...state, jobsError: action.payload}

		case UPDATE_PRINT_JOBS_SUCCESS:
			return {
				...state,
				jobs: action.payload,
				jobsError: null,
			}

		case UPDATE_ALL_PRINTERS_FAILURE:
			return {...state, printersError: action.payload}

		case UPDATE_ALL_PRINTERS_SUCCESS:
			return {
				...state,
				printers: action.payload.allPrinters,
				recentPrinters: action.payload.recentPrinters,
				popularPrinters: action.payload.popularPrinters,
				colorPrinters: action.payload.colorPrinters,
				printersError: null,
			}

		default:
			return state
	}
}
