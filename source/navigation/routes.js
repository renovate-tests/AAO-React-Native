// @flow

import {Navigation} from 'react-native-navigation'

import {HomeView} from '../views/home'

// import {HomeView, EditHomeView} from '../views/home'
// import {BuildingHoursDetailView} from '../views/building-hours/detail'
// import {
// 	BuildingHoursProblemReportView,
// 	BuildingHoursScheduleEditorView,
// 	BuildingHoursView,
// } from '../views/building-hours'
// import CalendarView from '../views/calendar'
// import {EventDetail as EventDetailView} from '@frogpond/event-list'
// import {ContactsDetailView, ContactsView} from '../views/contacts'
// import {
// 	DictionaryDetailView,
// 	DictionaryEditorView,
// 	DictionaryView,
// } from '../views/dictionary'
// import {FaqView} from '../views/faqs'
// import HelpView from '../views/help'
// import {
// 	CourseDetailView,
// 	CourseSearchResultsView,
// 	JobDetailView,
// } from '../views/sis'
// import {
// 	CarletonBurtonMenuScreen,
// 	CarletonLDCMenuScreen,
// 	CarletonSaylesMenuScreen,
// 	CarletonWeitzMenuScreen,
// 	MenusView,
// } from '../views/menus'
// import {MenuItemDetailView} from '@frogpond/food-menu/food-item-detail'
// import NewsView from '../views/news'
// import {
// 	SettingsView,
// 	IconSettingsView,
// 	CreditsView,
// 	DebugView,
// 	LegalView,
// 	PrivacyView,
// 	PushNotificationsSettingsView,
// } from '../views/settings'
// import SISView from '../views/sis'
// import StreamingView, {
// 	KRLXScheduleView,
// 	KSTOScheduleView,
// } from '../views/streaming'
// import {StudentOrgsDetailView, StudentOrgsView} from '../views/student-orgs'
// import TransportationView, {
// 	BusMap as BusMapView,
// 	OtherModesDetailView,
// } from '../views/transportation'
// import {
// 	PrinterListView,
// 	PrintJobReleaseView,
// 	PrintJobsView,
// } from '../views/stoprint'

import {Provider} from 'react-redux'
import {makeStore, initRedux} from '../redux'

const store = makeStore()
initRedux(store)

Navigation.registerComponentWithRedux(
	'app.home.view',
	HomeView,
	Provider,
	store,
)

// const routes = {
// 	'app.calendar.view': CalendarView,
// 	'app.contacts.detail': ContactsDetailView,
// 	'app.contacts.view': ContactsView,
// 	'app.courses.detail': CourseDetailView,
// 	'app.courses.searchresults': CourseSearchResultsView,
// 	'app.credits': CreditsView,
// 	'app.debug.redux': DebugView,
// 	'app.dictionary.detail': DictionaryDetailView,
// 	'app.dictionary.editor': DictionaryEditorView,
// 	'app.dictionary.list': DictionaryView,
// 	'app.event.detail': EventDetailView,
// 	'app.help.faqs': FaqView,
// 	'app.help.tools': HelpView,
// 	'app.home.edit': EditHomeView,
// 	'app.hours.detail': BuildingHoursDetailView,
// 	'app.hours.editor': BuildingHoursScheduleEditorView,
// 	'app.hours.list': BuildingHoursView,
// 	'app.hours.report': BuildingHoursProblemReportView,
// 	'app.legal': LegalView,
// 	'app.media.view': StreamingView,
// 	'app.menus.detail': MenuItemDetailView,
// 	'app.menus.view': MenusView,
// 	'app.news.view': NewsView,
// 	'app.orgs.detail': StudentOrgsDetailView,
// 	'app.orgs.view': StudentOrgsView,
// 	'app.print.job.release': PrintJobReleaseView,
// 	'app.print.jobs': PrintJobsView,
// 	'app.print.printers': PrinterListView,
// 	'app.privacy': PrivacyView,
// 	'app.radio.schedule': KSTOScheduleView,
// 	'app.settings.icons': IconSettingsView,
// 	'app.settings.notifications': PushNotificationsSettingsView,
// 	'app.settings.view': SettingsView,
// 	'app.sis.view': SISView,
// 	'app.stuwork.detail': JobDetailView,
// 	'app.transit.map': BusMapView,
// 	'app.transit.modes': OtherModesDetailView,
// 	'app.transit.view': TransportationView,
// }
//
// Object.entries(routes).forEach(([key, value]) => {
// 	Navigation.registerComponent(key, value)
// })
