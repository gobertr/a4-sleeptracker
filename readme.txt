--Readme document for Daniel Salameh and Robert Gellner, *email(s)*, *UCI id(s)*--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

*/10
- */1 The ability to log overnight sleep
- */1 The ability to log sleepiness during the day
- */1 The ability to view these two categories of logged data
- */2 Either using a native device resource or backing up logged data
- */2 Following good principles of mobile design
- */2 Creating a compelling app
- */1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?



3. What online resources did you consult when completing this assignment? (list specific URLs)

- Ionic ion-datetime docs for picker values and the built in confirmation buttons https://ionicframework.com/docs/api/datetime
- Ionic ion-modal docs for opening the picker and resetting it when it closes https://ionicframework.com/docs/api/modal#using-isopen
- Angular DatePipe docs for displaying the bedtime and wake up time https://angular.dev/api/common/DatePipe
- MDN JavaScript Date reference for reading the picker value https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
- W3C modal dialog guide for understanding the Chrome keyboard focus warnings https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#keyboard-interaction
- Stanford Sleepiness Scale from the assignment for checking the seven options https://www.med.upenn.edu/cbti/assets/user-content/documents/Stanford%20Sleepiness%20Scale.pdf
- Ionic ion-radio docs for grouping the ratings and wrapping the longer description https://ionicframework.com/docs/api/radio
- MDN datetime-local input reference for date and time field https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/datetime-local
- Lecture 16 slides for choosing IndexedDB with Ionic Storage and using a separate page for sotrage
- Ionic Storage docs for opening the database and saving and reading log records https://github.com/ionic-team/ionic-storage#api
- Ionic page events docs for loading the logs whenever History opens https://ionicframework.com/docs/angular/lifecycle#ionic-page-events
- Ionic back button docs for returning home after refreshing History https://ionicframework.com/docs/api/back-button#default-back-history


4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

We worked together to complete the assignment. We did a ton of peer programming in person which is why most of the commits are done from Daniel's computer

5. Is there anything special we need to know in order to run your code?



--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?



7. Did you design your app specifically for iOS or Android, or both?



8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?



9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?



10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

Tap History in the top toolbar. The page shows overnight sleep and daytime sleepiness in separate lists with the latest entries first, so people can find recent logs quickly.


11. Which feature choose--using a native device resource, backing up logged data, or both?

Backing up logged data (Option 2).


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?



13. If you backed up logged data, where does it back up to?

Ionic Storage saves both kinds of logs locally in the browser's IndexedDB, with browser local storage as a fallback. Opening History after a refresh loads the saved entries.

14. How does your app implement or follow principles of good mobile design?