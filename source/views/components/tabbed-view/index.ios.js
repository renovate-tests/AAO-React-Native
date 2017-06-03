// @flow

import React from 'react'
import {TabBarIOS} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {tracker} from '../../../analytics'
import {styles} from './styles'
import type {TabbedViewPropsType, TabDefinitionType} from './types'
import * as c from '../../components/colors'

export default class TabbedView extends React.Component {
  state = {
    selectedTab: this.props.tabs[0].id,
  }

  componentWillMount() {
    this.onChangeTab(this.props.tabs[0].id)
  }

  props: TabbedViewPropsType

  onChangeTab = (tabId: string) => {
    tracker.trackScreenView(tabId)
    this.setState({selectedTab: tabId})
  }

  render() {
    let {tabs} = this.props
    return (
      <TabBarIOS
        tintColor={c.mandarin}
        style={[styles.container, this.props.style]}
      >
        {tabs.map(tab => (
          <TabBarItem
            key={tab.id}
            tab={tab}
            onChangeTab={this.onChangeTab}
            isSelected={this.state.selectedTab === tab.id}
          />
        ))}
      </TabBarIOS>
    )
  }
}

class TabBarItem extends React.PureComponent {
  props: {
    isSelected: boolean,
    onChangeTab: (id: string) => any,
    tab: TabDefinitionType,
  }

  onChange = () => {
    this.props.onChangeTab(this.props.tab.id)
  }

  render() {
    const {isSelected, tab} = this.props

    let icon = tab.icon
      ? {
          iconName: `ios-${tab.icon}-outline`,
          selectedIconName: `ios-${tab.icon}`,
        }
      : {}

    return (
      <Icon.TabBarItemIOS
        {...icon}
        title={tab.title}
        selected={isSelected}
        translucent={true}
        onPress={this.onChange}
      >
        {tab.component()}
      </Icon.TabBarItemIOS>
    )
  }
}