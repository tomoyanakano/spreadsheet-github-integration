import setProperties from "./setProperties";
import { Issue } from "./types/issue";
import {
  ACCESS_TOKEN,
  ASSIGNEE_COL,
  BODY_COL,
  CHECK_COL,
  LABEL_COL,
  LABEL_ROW,
  LAST_COLUMN,
  LAST_ROW,
  SHEET,
  STATE_COL,
  TITLE_COL,
  URL,
  URL_COL,
} from "./utils";

// get value from SpreadSheet
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

// set value to SpreadSheet
const setValue = (rowNum: number, json: any) => {
  const data = [];
  data[STATE_COL - 1] = json.state;
  data[TITLE_COL - 1] = json.title;
  data[BODY_COL - 1] = json.body;
  data[URL_COL - 1] = json.html_url;
  data[ASSIGNEE_COL - 1] = json.assignees
    .map((assignee: any) => assignee.login)
    .join(",");
  data[LABEL_COL - 1] = json.labels.map((label: any) => label.name).join(",");
  data[CHECK_COL - 1] = false;
  SHEET.getRange(rowNum, CHECK_COL, 1, LAST_COLUMN).setValues([data]);
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

// create issues
const createIssues = () => {
  try {
    const request = createRequest();
    // fetch all SHEET data
    const data = SHEET.getRange(LABEL_ROW + 1, 1, LAST_ROW - 1, 7).getValues();
    const titles = SHEET.getRange(LABEL_ROW + 1, TITLE_COL, LAST_ROW + 1)
      .getValues()
      .map((row: string[]) => row[0]);
    const issues: Issue[] = data
      .map(getValue)
      .filter((issue: Issue | undefined): issue is Issue => !!issue);
    const requests = issues.map((issue) => request(JSON.stringify(issue)));
    const responses = UrlFetchApp.fetchAll(requests);
    responses.map((response) => {
      const json = JSON.parse(response.getContentText());
      const rowNum = titles.indexOf(json.title) + LABEL_ROW + 1;
      setValue(rowNum, json);
    });
    console.log("issues added!");
  } catch (error: any) {
    console.log(error);
  }
};

const fetchIssues = (): string => {
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "get",
    headers: {
      accept: "application/vnd.github.v3+json",
      Authorization: `token ${ACCESS_TOKEN}`,
    },
  };
  const response = UrlFetchApp.fetch(URL, options);
  return response.getContentText();
};

// sync issues
const syncIssues = () => {
  try {
    const data = SHEET.getRange(
      LABEL_ROW + 1,
      1,
      LAST_ROW + 1,
      LAST_COLUMN
    ).getValues();
    // issue url array
    const URLs = data.map((row) => row[URL_COL - 1]);
    // title array (for detect last row)
    const titles = data
      .map((row) => row[TITLE_COL - 1])
      .filter((title) => title != "");
    // fetch issues
    const json = JSON.parse(fetchIssues());
    // row number count(for adding issues)
    let count = 0;
    json.map((issue: any) => {
      if (URLs.includes(issue.html_url)) {
        const rowNum = URLs.indexOf(issue.html_url) + LABEL_ROW + 1;
        setValue(rowNum, issue);
      } else {
        count++;
        const rowNum = titles.length + LABEL_ROW + count;
        setValue(rowNum, issue);
      }
    });
  } catch (error: any) {
    console.log(error);
  }
};
