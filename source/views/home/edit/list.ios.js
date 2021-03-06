// @flow

import * as React from 'react'
import {StyleSheet} from 'react-native'
import {type ReduxState} from '../../../redux'
import {saveHomescreenOrder} from '../../../redux/parts/homescreen'
import {connect} from 'react-redux'
import * as c from '@frogpond/colors'
import fromPairs from 'lodash/fromPairs'
import {Viewport} from '@frogpond/viewport'

import SortableList from '@hawkrives/react-native-sortable-list'
import debounce from 'lodash/debounce'

import type {ViewType} from '../../views'
import {allViews} from '../../views'
import {EditHomeRow} from './row'
import {toggleViewDisabled} from '../../../redux/parts/homescreen'

const objViews = fromPairs(allViews.map(v => [v.view, v]))

const styles = StyleSheet.create({
	contentContainer: {
		backgroundColor: c.iosLightBackground,
		paddingTop: 10,
		paddingBottom: 20,
		flexDirection: 'column',
		alignItems: 'stretch',
	},
})

type ReduxStateProps = {
	order: string[],
	inactiveViews: string[],
}

type ReduxDispatchProps = {
	onSaveOrder: (string[]) => any,
	onToggleViewDisabled: string => any,
}

type Props = ReduxStateProps & ReduxDispatchProps

class EditHomeView extends React.PureComponent<Props> {
	static navigationOptions = {
		title: 'Edit Home',
	}

	renderRow = (args: {data: ViewType, active: boolean, width: number}) => {
		const {data, active, width} = args
		const enabled = !this.props.inactiveViews.includes(data.view)
		return (
			<EditHomeRow
				active={active}
				data={data}
				isEnabled={enabled}
				onToggle={this.props.onToggleViewDisabled}
				width={width}
			/>
		)
	}

	_saveOrder = (order: string[]) => this.props.onSaveOrder(order)

	onChangeOrder = debounce(this._saveOrder, 100)

	render() {
		return (
			<Viewport
				render={({width}) => (
					<SortableList
						contentContainerStyle={[styles.contentContainer, {width}]}
						data={objViews}
						onChangeOrder={this.onChangeOrder}
						order={this.props.order}
						renderRow={props => this.renderRow({...props, width})}
					/>
				)}
			/>
		)
	}
}

function mapState(state: ReduxState): ReduxStateProps {
	return {
		order: state.homescreen ? state.homescreen.order : [],
		inactiveViews: state.homescreen ? state.homescreen.inactiveViews : [],
	}
}

function mapDispatch(dispatch): ReduxDispatchProps {
	return {
		onSaveOrder: newOrder => dispatch(saveHomescreenOrder(newOrder)),
		onToggleViewDisabled: view => dispatch(toggleViewDisabled(view)),
	}
}

export const ConnectedEditHomeView = connect(
	mapState,
	mapDispatch,
)(EditHomeView)
