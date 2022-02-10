# Github Spreadsheet Integration
This project makes it possible to integrate github issues with google spreadsheet.

Demo sheet is [here](https://docs.google.com/spreadsheets/d/1lSQ_NTh4glafmBLqjYhmASdUDtkid6vmB0z9V0ThuNI/edit?usp=sharing)

# Getting Started
These instructions will get you a copy of the project up and running on your spreadsheet.
<br>

## Prerequisites
What things you need to install the software and how to install them
<br>

```
//installing clasp and login your google account
clasp version
clasp login
```

## Installing and Deployment
A step by step series of examples that tell you how to get a running on your spreadsheet


### Installing
installing npm packages
```
npm install
```

### Deployment
setting your Google App Script Id to .clasp.json
```
{"scriptId":"<YOUR SCRIPT ID>"}
```


setting your Github info to Script Properties<br>

import setProperties from setProperties.ts to index.ts, and execute with your github info in main function like below.
```
// setProperties.ts
const main = () => {
  setProperties(
    "YOUR GITHUB ACCESS TOKEN",
    "YOUR GITHUB ACCOUNT NAME",
    "YOUR GITHUB REPOSITORY NAME"
  )
}

```
※ Setting Properties is required once, so you can delete these codes if you set value.

<br>
Finally, you can deploy to your spreadsheet and then you have to execute main function in order to set properties.

```
npm run deploy
```

### how to use without script properties
if you would like to use this without script properties, you need to change these codes.<br>

from 
```
// main.ts
const ACCESS_TOKEN = PROPERTIES.getProperty("accessToken");
const USER_NAME = PROPERTIES.getProperty("username");
const REPOSITORY = PROPERTIES.getProperty("repository");
```
to
```
const ACCESS_TOKEN = "YOUR GITHUB ACCESS TOKEN"
const USER_NAME = "YOUR GITHUB ACCOUNT NAME"
const REPOSITORY = "YOUR GITHUB REPOSITORY NAME";
```


## Customize
you can customize this code and spreadsheet
if you would