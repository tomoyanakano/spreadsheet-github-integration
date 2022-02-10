import setProperties from "./setProperties";
// environment variables
const PROPERTIES = PropertiesService.getScriptProperties();
const ACCESS_TOKEN = PROPERTIES.getProperty("accessToken");
const USER_NAME = PROPERTIES.getProperty("username");
const REPOSITORY = PROPERTIES.getProperty("repository");
const URL = `https://api.github.com/repos/${USER_NAME}/${REPOSITORY}/issues`;

// spreadSHEET
const SHEET = SpreadsheetApp.getActive().getSheetByName("issues");
const LABEL_ROW = 5;
const CHECK_COL = 1;
const STATE_COL = 2;
const TITLE_COL = 3;
const LABEL_COL = 4;
const BODY_COL = 5;
const ASSIGNEE_COL = 6;
const URL_COL = 7;

// github issue type
type Issue = {
  title: string;
  body: string;
  labels: string[];
  assignee: string;
};

// create requst
const createRequest = () => {
  return (payload: string): GoogleAppsScript.URL_Fetch.URLFetchRequest => ({
    url: URL,
    method: "post",
    headers: {
      accept: "application/vnd.github.v3+json",
      Authorization: `token ${ACCESS_TOKEN}`,
    },
    payload: payload,
  });
};

const getValue = (row: string[]): Issue | undefined => {
  const check = row[0];
  const title = row[TITLE_COL - 1];
  const labels = row[LABEL_COL - 1].split(",");
  const body = row[BODY_COL - 1];
  const assignee = row[ASSIGNEE_COL - 1];
  if (check) {
    return {
      title: title,
      body: body,
      labels: labels,
      assignee: assignee,
    };
  }
};

const setValue = (response: GoogleAppsScript.URL_Fetch.HTTPResponse) => {
  if (SHEET == null) {
    return console.log("issues SHEET is not found!");
  }
  const content = response.getContentText();
  const json = JSON.parse(content);
  const url = json.html_url;
  const state = json.state;
  const lastRow = SHEET.getLastRow();
  const titles = SHEET.getRange(LABEL_ROW + 1, TITLE_COL, lastRow + 1)
    .getValues()
    .map((row: string[]) => row[0]);
  const row_num = titles.indexOf(json.title) + LABEL_ROW + 1;
  SHEET.getRange(row_num, STATE_COL).setValue(state);
  SHEET.getRange(row_num, URL_COL).setValue(url);
  SHEET.getRange(row_num, CHECK_COL).setValue(false);
};

const main = () => {
  if (SHEET == null) {
    return console.log("issues SHEET is not found!");
  }
  try {
    const lastRow = SHEET.getLastRow();
    const request = createRequest();
    // fetch all SHEET data
    const data = SHEET?.getRange(LABEL_ROW + 1, 1, lastRow - 1, 7).getValues();
    const issues: Issue[] = data
      .map(getValue)
      .filter((issue: Issue | undefined): issue is Issue => !!issue);
    const requests = issues.map((issue) => request(JSON.stringify(issue)));
    const responses = UrlFetchApp.fetchAll(requests);
    responses.map(setValue);
    console.log("issues added!");
  } catch (error: any) {
    console.log(error);
  }
};
