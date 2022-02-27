import { getIssues, postIssues } from "./api/githubAPI";
import setProperties from "./setProperties";
import { Issue } from "./types/issue";
import {
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

// create issues
const addIssues = () => {
  try {
    // fetch all SHEET data
    const data = SHEET.getRange(LABEL_ROW + 1, 1, LAST_ROW - 1, 7).getValues();
    const titles = SHEET.getRange(LABEL_ROW + 1, TITLE_COL, LAST_ROW + 1)
      .getValues()
      .map((row: string[]) => row[0]);
    const issues: Issue[] = data
      .map(getValue)
      .filter((issue: Issue | undefined): issue is Issue => !!issue);
    const responses = postIssues(issues);
    responses.map((response) => {
      const json = JSON.parse(response);
      const rowNum = titles.indexOf(json.title) + LABEL_ROW + 1;
      setValue(rowNum, json);
    });
    console.log("issues added!");
  } catch (error: any) {
    console.log(error);
  }
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
    const json = JSON.parse(getIssues());
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
