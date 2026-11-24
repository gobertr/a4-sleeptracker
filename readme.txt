--Readme document for Daniel Salameh and Robert Gellner, dnsalame@uci.edu and rgellner@uci.edu, 75123614 and 44763004

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?

This assignment took around 15 hours for each of us (~30 hours total), including sketches and our Figma mockup.

3. What online resources did you consult when completing this assignment? (list specific URLs)

- Angular DatePipe docs for displaying the bedtime and wake up time https://angular.dev/api/common/DatePipe
- MDN JavaScript Date reference for reading the picker value https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
- Stanford Sleepiness Scale from the assignment for checking the seven options https://www.med.upenn.edu/cbti/assets/user-content/documents/Stanford%20Sleepiness%20Scale.pdf
- MDN datetime-local input reference for date and time field https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/datetime-local
- Lecture 16 slides for choosing IndexedDB with Ionic Storage and using a separate page for storage
- Ionic Storage docs for opening the database and saving and reading log records https://github.com/ionic-team/ionic-storage#api
- Ionic page events docs for loading the logs whenever History opens https://ionicframework.com/docs/angular/lifecycle#ionic-page-events
– Claude for finding particularly annoying bugs https://claude.ai

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

We worked together to complete the assignment, using pair programming. We called several times on Discord to work on the assignment in 2-3 hour sessions. 
Both of us also implemented some features on our own time, but we made sure to communicate so that we wouldn't work on the same files at the same time and cause conflicts. 

5. Is there anything special we need to know in order to run your code?

No

--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?

The app is designed to be a very simple way for users to keep track of their sleep with a minimal amount of effort. 
Although it lacks complex data analysis features and reccommendations, it is very straightforwards and easy to use 
while still allowing users to quickly fix any errors they make, such as forgetting to stop the sleep timer.

7. Did you design your app specifically for iOS or Android, or both?

We designed Sleepi for iOS, using tabs a the bottom of the screen for navigation as is customary for iPhones/iPads. The date picker in the History tab uses Ionic's default styling for iOS.

8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?

Sleep can easily be logged from the home screen when going to bed by simpling tapping the "Go to Sleep" button before they sleep and then ending the session using the "Wake Up" button. 
We chose to use this in order to ensure an easy and simple user experience, so that the user doesn't need to manually input the time every single day, which would be extremely tiresome.
If the user makes a mistake, the cancel button allows them to change their mind. 

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?

The user can go to the Sleepiness tab (the tab on the right with the battery icon), select an option for how sleepy they are currently feeling, and press "Submit,"
which automatically records the submission time and includes it in the History tab. The daily average averages all ratings in one day, and the weekly average averages 
all ratings in a particular week, excluding days that the user didn't log anything.

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

The user can tap on the History tab (the tab on the left with the clock icon) to view their sleep activity and trends over the past week at a glance, and includes averages for the past week.
The user can also see a more detailed view of individual days for overnight sleep and individual entries for sleepiness, which they can use to edit individual entries, delete entries, and add new entries. 

11. Which feature choose--using a native device resource, backing up logged data, or both?

We chose to back up logged data (Option 2).

12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?

N/A

13. If you backed up logged data, where does it back up to?

Ionic Storage saves both kinds of finished logs in the browser's IndexedDB, with browser local storage as a fallback, and History loads them each time it opens. 
The app also uses localStorage to keep the start time of an in-progress sleep and the last wake-up summary, so closing or refreshing the app doesn't lose them.

14. How does your app implement or follow principles of good mobile design?

The app uses color coding to make important elements (the bar chart, the buttons hat log data) stand out while maintaining a consistent color scheme. 
The app uses a simple navigation bar with three tabs at the bottom of the screen, making it easy for users to nagivate using only their thumb, 
and the app uses a very simple UI so as to prevent clutter and information overload. 