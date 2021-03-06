# Changelog


## v3.10.0 - 2015-08-21


### Changed

- update to Forms v3.6.0 for additions and fixes

    - see https://github.com/blinkmobile/forms/releases/tag/v3.6.0


## v3.9.1 - 2015-08-21


### Fixed

- BIC-197: form "list" interactions now function correctly in Safari, Firefox,
  and Internet Explorer

    - HelpDesk: 8822-YPJZ-6091


## v3.9.0 - 2015-08-14


### Changed

- update to Forms v3.5.0 for additions and fixes

    - see https://github.com/blinkmobile/forms/releases/tag/v3.5.0


## v3.8.3 - 2015-08-10


### Changed

- updated to [Backbone.js](http://backbonejs.org/#changelog) 1.2.1 (from 1.1.2)

- updated to [Underscore.js](http://underscorejs.org/#changelog) 1.8.3

    - from [Lo-Dash](https://github.com/lodash/lodash/wiki/Changelog) 2.4.1


### Fixed

- BIC-194: using full-screen native widgets in the app should no longer cause
  the BIC to reload

- update to Forms v3.4.4 for fixes

    - see https://github.com/blinkmobile/forms/releases/tag/v3.4.4


## v3.8.2 - 2015-08-04


### Fixed

- update to Forms v3.4.3 for fixes

    - see https://github.com/blinkmobile/forms/releases/tag/v3.4.3


## v3.8.1 - 2015-08-04


### Fixed

- BIC-190: jQM transitions that depend on CSS Animation events now have a
  watchdog timer, so missing events no longer break everything

- BIC-165: answerSpaces lacking home interactions and login security no longer
  fail to start (introduced in v3.8.0)


## v3.8.0 - 2015-07-30


### Added

- BIC-168: display validation messages from the server next to client-side
  validation messages

- BIC-174: APIs, events and documentation for managing custom and server-side
  validation messages for use with Forms

    - see [docs/pending-queue.md](docs/pending-queue.md)


### Changed

- update to Forms v3.4.2 for additions, changes and fixes

    - see https://github.com/blinkmobile/forms/releases/tag/v3.4.2

### Fixed

- BIC-165: unauthenticated users navigating to a protected answerSpace are now
  prompted to login (as per answerSpace settings)

- BIC-189: forms validation error summary is consistently enhanced by
  jQueryMobile

    - the summary is also now displayed when changing the page or when pressing
      the submit button

    - we no longer display the summary upon form load, nor after pressing the
      save button


## v3.7.1 - 2015-07-28


### Changed

- update to Forms v3.4.1 for additions, changes and fixes

    - see https://github.com/blinkmobile/forms/releases/tag/v3.4.1


## v3.7.0 - 2015-07-17


### Changed

- update to Forms v3.4.0 for additions, changes and fixes

    - see https://github.com/blinkmobile/forms/releases/tag/v3.4.0
