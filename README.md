# ht-cm-statistics
This script ist made for Google Spreadsheets, to help you and your static to analyse your HT-CM runs visualized in days. 
Currently in Alpha-Version, still contains some bugs and poor user experience -> Use with caution

## How to Install
### Get the Script into a google Spreadsheet
1. Download the latest stable ht-cm-statistics.zip here: [Releases](https://github.com/Darkister/ht-cm-statistics/releases)
2. Unzip the Zip-File
3. Open the unziped folder and navigate through it. There is the File 'main.js' inside the folder "dist"
4. Open the File 'main.js' in any editor of your choice. Simple Notepad is absolutly fine
5. Visit [Google Spreadsheets](https://docs.google.com/spreadsheets/) and if not logged in already, login to your google account
6. Create a new empty spreadsheet
7. Inside your new spreadsheet click on "Erweiterungen" ("Extensions"?) -> Apps Script, a new tab should open
8. delete what ever is inside the default file
9. Copy&Paste the Code from the previously downloaded 'main.js' File into your Script Editor
10. Save the file inside your Script Editor

### First steps and Permissions
1. Inside the Script Editor you can run Functions of the Script
2. Make sure that the function 'createFullLayout' is selected in the dropdown, press "Ausführen" ("Run"?)
3. You need to give Permissions to your script, just follow the instructions on the Screen
4. At one Point there is a Red Triangle and bit lower a small gray text "Erweitert" ("Advanced"), click on it and click on "Open Project (unsafe)" -> Aggree on the next Screen

Now have a look at your Spreadsheet, the basic layout should be created now.

Before you can start upload Logs, swap back to your script tab. On the left side mouse over the clock, you should see a menu now and one is called "Trigger":
1. Click on "Trigger" and on bottom right corner there should be a Button "Add Trigger" -> click on the Button
2. select the function 'editTrigger' in the first drop down
3. leave drop-down 2 and 3 as it is
4. on the last dropdown select "Bei Änderung" ("On Edit")
5. The right drop-down is just for notification, choose weekly or just ignore it
6. Save and verify Permission things like in the Step before.
Repeat step 1-6 for the function 'editPlayersToViewTrigger'

You should be done, Happy logging.

## How to use for developer
Clone the Repository with an IDE of your choice, personally I prefer VS-Code, but others should also work

Run
```
npm install
npm i @google/clasp -g
```
to install all needed packages.

Optionaly you can run following command to merge your JS-Files into one Script file
```
npm install uglify-js -g
```

Make familiar with clasp
[Working with Google Apps Script in Visual Studio Code using clasp](https://yagisanatode.com/2019/04/01/working-with-google-apps-script-in-visual-studio-code-using-clasp/)

## Further documentations
* [Permissions for trigger functions](https://stackoverflow.com/questions/58359417/you-do-not-have-permission-to-call-urlfetchapp-fetch)

## Contact
Mail - darkisters.world@gmail.com
Discord - darkister
Visit my own DC-Server - [Darkisters World Community Server](https://discord.gg/wMuQnYVNTv) -> mainly in german, but give your self the Role "Coding Stuff"
Guild Wars 2 - blackicedragon.3579
Twitch - [Darkister](https://www.twitch.tv/darkister)

## Special Thanks
To my HT CM Static which is no longer active, but they tested this Tool and made it as great as it is <3
* Nasbit.3240 -> thanks for all the awesome styling ideas
* Judy.8532 -> thanks for all the organisation stuff and setup the static

## Donations?
You want to support me? Well there is currently not really a supporting system. This Tool was made as a Hobby, not to earn money with.
If you just respect the work feel free to send me some ingame Stuff in Guild Wars 2 at 'blackicedragon.3579'.
If you still want to support me in real, then visit my twitch channel [Darkister](https://www.twitch.tv/darkister) leave a follow and subscription.
Or support me with your opinion: Join my [Discord Community](https://discord.gg/wMuQnYVNTv) and help me bringing this tool to a next level <3