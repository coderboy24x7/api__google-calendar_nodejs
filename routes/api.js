const express = require('express'),
	router    = express.Router();

/**
 * Description: Access control rules group routes
 */
router.get(
	['/calendars/:calendarId/access-control', '/calendars/access-control'],
	[rootRequire('app/controllers/CalendarAccessControlRuleController').index]
);
router.get(
	['/calendars/:calendarId/access-control/:ruleId', '/calendars/access-control/:ruleId'],
	[rootRequire('app/controllers/CalendarAccessControlRuleController').show]
);
router.get(
	['/calendars/:calendarId/watch-access-control', '/calendars/watch-access-control'],
	[rootRequire('app/controllers/CalendarAccessControlRuleController').watch]
);
router.post(
	['/calendars/:calendarId/access-control', '/calendars/access-control'],
	[rootRequire('app/controllers/CalendarAccessControlRuleController').store]
);
router.put(
	['/calendars/:calendarId/access-control/:ruleId', '/calendars/access-control/:ruleId'],
	[rootRequire('app/controllers/CalendarAccessControlRuleController').update]
);
router.patch(
	['/calendars/:calendarId/access-control/:ruleId', '/calendars/access-control/:ruleId'],
	[rootRequire('app/controllers/CalendarAccessControlRuleController').patch]
);
router.delete(
	['/calendars/:calendarId/access-control/:ruleId', '/calendars/access-control/:ruleId'],
	[rootRequire('app/controllers/CalendarAccessControlRuleController').destroy]
);

/**
 * Description: Calendar list group routes
 */
router.get(
	['/calendars/:calendarId/calendar-lists', '/calendars/calendar-lists'],
	[rootRequire('app/controllers/CalendarListController').index]
);
router.get(
	['/calendars/:calendarId/calendar-list', '/calendars/calendar-list'],
	[rootRequire('app/controllers/CalendarListController').show]
);
router.get(
	['/calendars/:calendarId/watch-calendar-list', '/calendars/watch-calendar-list'],
	[rootRequire('app/controllers/CalendarListController').watch]
);
router.post(
	['/calendars/:id/calendar-list', '/calendars/calendar-list'],
	[rootRequire('app/controllers/CalendarListController').store]
);
router.put(
	['/calendars/:calendarId/calendar-list', '/calendars/calendar-list'],
	[rootRequire('app/controllers/CalendarListController').update]
);
router.patch(
	['/calendars/:calendarId/calendar-list', '/calendars/calendar-list'],
	[rootRequire('app/controllers/CalendarListController').patch]
);
router.delete(
	['/calendars/:calendarId/calendar-list', '/calendars/calendar-list'],
	[rootRequire('app/controllers/CalendarListController').destroy]
);

/**
 * Description: Channels group routes
 */
router.post('/calendars/channels-stop',[rootRequire('app/controllers/ChannelsController').stop]);

/**
 * Description: Colors calendar group routes
 */
router.get('/calendars/colors', [rootRequire('app/controllers/ColorCalendarController').index]);

/**
 * Description: Event group routes
 */
router.get(
	['/calendars/:calendarId/events', '/calendars/events'],
	[rootRequire('app/controllers/EventController').index]
);
router.get(
	['/calendars/:calendarId/event/:eventId', '/calendars/event/:eventId', '/calendars/event'],
	[rootRequire('app/controllers/EventController').show]
);
router.get(
	['/calendars/:calendarId/watch-events','/calendars/watch-events'],
	[rootRequire('app/controllers/EventController').watch]
);
router.get(
	['/calendars/:calendarId/event-instances', '/calendars/event-instances/:eventId', '/calendars/event-instances'],
	[rootRequire('app/controllers/EventController').instance]
);
router.post(
	['/calendars/:calendarId/event', '/calendars/event'],
	[rootRequire('app/controllers/EventController').store]
);
router.post(
	['/calendars/:calendarId/quick-event', '/calendars/quick-event'],
	[rootRequire('app/controllers/EventController').quick]
);
router.post(
	['/calendars/:calendarId/move-event/:eventId', '/calendars/move-event/:eventId'],
	[rootRequire('app/controllers/EventController').move]
);
router.put(
	['/calendars/:calendarId/event/:eventId', '/calendars/event/:eventId', '/calendars/event'],
	[rootRequire('app/controllers/EventController').update]
);
router.delete(
	['/calendars/:calendarId/event/:eventId', '/calendars/event/:eventId', '/calendars/event'],
	[rootRequire('app/controllers/EventController').destroy]
);

/**
 * Description: Setting calendar group routes
 */
router.get(
	['/calendars/:calendarId/setting-list', '/calendars/setting-list'],
	[rootRequire('app/controllers/SettingCalendarController').index]
);
router.get(
	['/calendars/:calendarId/setting/:settingId', '/calendars/setting/:settingId', '/calendars/setting'],
	[rootRequire('app/controllers/SettingCalendarController').show]
);
router.get('/calendars/watch-setting', [rootRequire('app/controllers/SettingCalendarController').watch]);

/**
 * Description: Calendar group routes
 */
router.get(
	['/calendars/:calendarId', '/calendars'],
	[rootRequire('app/controllers/CalendarController').show]
);
router.get(
	['/calendars/:calendarId/clear-calendar', '/calendars/clear-calendar'],
	[rootRequire('app/controllers/CalendarController').clear]
);
router.post(
	['/calendars/:calendarId', '/calendars'],
	[rootRequire('app/controllers/CalendarController').store]
);
router.put(
	['/calendars/:calendarId', '/calendars'],
	[rootRequire('app/controllers/CalendarController').update]
);
router.delete(
	['/calendars/:calendarId', '/calendars'],
	[rootRequire('app/controllers/CalendarController').destroy]
);

module.exports = router;