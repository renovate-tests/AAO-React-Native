// @flow

import * as React from 'react'
import {Cell, Section, CellTextField} from '@frogpond/tableview'
import {LoginButton} from './login-button'
import {
	loadCredentials,
	saveCredentials,
	clearCredentials,
	validateCredentials,
	type LoginResultEnum,
} from '../../../../lib/login'
import noop from 'lodash/noop'

type Props = {}

type State = {
	username: string,
	password: string,
	loginState: 'initializing' | 'checking' | LoginResultEnum | null,
}

export class CredentialsLoginSection extends React.Component<Props, State> {
	_usernameInput: any
	_passwordInput: any

	state = {
		username: '',
		password: '',
		loginState: 'initializing',
	}

	componentDidMount() {
		this.loadCredentialsFromKeychain()
	}

	focusUsername = () => this._usernameInput.focus()
	focusPassword = () => this._passwordInput.focus()

	loadCredentialsFromKeychain = async () => {
		let {username = '', password = ''} = await loadCredentials()
		this.setState(() => ({username, password}))

		if (username && password) {
			this.validate()
		} else {
			this.setState(() => ({loginState: 'no-credentials'}))
		}
	}

	validate = async () => {
		this.setState(() => ({loginState: 'checking'}))
		let {type} = await validateCredentials()
		this.setState(() => ({loginState: type}))
	}

	logIn = async () => {
		await saveCredentials(this.state.username, this.state.password)
		this.validate()
	}

	logOut = () => {
		this.setState(() => ({
			username: '',
			password: '',
			loginState: 'no-credentials',
		}))
		clearCredentials()
	}

	getUsernameRef = (ref: any) => (this._usernameInput = ref)
	getPasswordRef = (ref: any) => (this._passwordInput = ref)

	onChangeUsername = (text: string = '') =>
		this.setState(() => ({username: text}))
	onChangePassword = (text: string = '') =>
		this.setState(() => ({password: text}))

	render() {
		let {username, password, loginState} = this.state

		let loggedIn = loginState === 'success'
		let loading = loginState === 'checking'

		return (
			<Section
				footer='St. Olaf login enables the "meals remaining" feature.'
				header="ST. OLAF LOGIN"
			>
				{loggedIn ? (
					<Cell title={`Logged in as ${username}.`} />
				) : (
					[
						<CellTextField
							key={0}
							_ref={this.getUsernameRef}
							disabled={loading}
							label="Username"
							onChangeText={this.onChangeUsername}
							onSubmitEditing={this.focusPassword}
							placeholder="username"
							returnKeyType="next"
							secureTextEntry={false}
							value={username}
						/>,
						<CellTextField
							key={1}
							_ref={this.getPasswordRef}
							disabled={loading}
							label="Password"
							onChangeText={this.onChangePassword}
							onSubmitEditing={loggedIn ? noop : this.logIn}
							placeholder="password"
							returnKeyType="done"
							secureTextEntry={true}
							value={password}
						/>,
					]
				)}

				<LoginButton
					disabled={loading || (!username || !password)}
					label="St. Olaf"
					loading={loading}
					loggedIn={loggedIn}
					onPress={loggedIn ? this.logOut : this.logIn}
				/>
			</Section>
		)
	}
}
