// @flow

import React from 'react'
import {Cell} from 'react-native-tableview-simple'
import {StyleSheet, Text, View} from 'react-native'
import * as c from '../../components/colors'

type Props = {
	title: string,
	leftDetail: string,
	rightDetail: string,
}

export class MultiLineDetailCell extends React.PureComponent<Props> {
	render() {
		const {title, rightDetail, leftDetail} = this.props
		const cellContent = (
			<View style={detailStyles.cellContentView}>
				<View style={detailStyles.leftContainer}>
					<Text allowFontScaling={true} style={detailStyles.cellTitle}>
						{title}
					</Text>
					<Text allowFontScaling={true} style={detailStyles.cellLeftDetail}>
						{leftDetail}
					</Text>
				</View>
				<Text allowFontScaling={true} style={detailStyles.cellRightDetail}>
					{rightDetail}
				</Text>
			</View>
		)
		return <Cell cellContentView={cellContent} />
	}
}

const detailStyles = StyleSheet.create({
	cellContentView: {
		alignItems: 'center',
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
		// independent from other cellViews
		paddingVertical: 10,
	},
	cellTitle: {
		fontSize: 16,
		letterSpacing: -0.32,
		color: c.black,
	},
	cellLeftDetail: {
		fontSize: 16,
		letterSpacing: -0.32,
		color: c.iosDisabledText,
	},
	cellRightDetail: {
		fontSize: 16,
		letterSpacing: -0.32,
		alignSelf: 'center',
		color: c.iosDisabledText,
	},
	leftContainer: {
		flex: 1,
	},
})

type LeftDetailProps = {
	detail: string,
	title: string,
}

export class MultiLineLeftDetailCell extends React.PureComponent<
	LeftDetailProps,
> {
	render() {
		const {detail, title} = this.props
		const cellContent = (
			<View style={detailStyles.cellContentView}>
				<Text allowFontScaling={true} style={leftDetailStyles.cellLeftDetail}>
					{detail}
				</Text>
				<Text
					allowFontScaling={true}
					style={leftDetailStyles.cellLeftDetailTitle}
				>
					{title}
				</Text>
			</View>
		)
		return <Cell cellContentView={cellContent} />
	}
}

const leftDetailStyles = StyleSheet.create({
	cellLeftDetailTitle: {
		fontSize: 12,
		flex: 1,
		color: c.black,
	},
	cellLeftDetail: {
		fontSize: 12,
		alignSelf: 'center',
		textAlign: 'right',
		marginRight: 5,
		width: 75,
		color: c.infoBlue,
	},
})
