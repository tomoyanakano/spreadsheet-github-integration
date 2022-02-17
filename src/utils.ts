// environment variables
export const PROPERTIES = PropertiesService.getScriptProperties();
export const ACCESS_TOKEN = PROPERTIES.getProperty("accessToken");
export const USER_NAME = PROPERTIES.getProperty("username");
export const REPOSITORY = PROPERTIES.getProperty("repository");
export const URL = `https://api.github.com/repos/${USER_NAME}/${REPOSITORY}/issues`;

// spreadSHEET
export const SHEET = SpreadsheetApp.getActive().getActiveSheet();
export const LAST_ROW = SHEET.getLastRow();
export const LAST_COLUMN = SHEET.getLastColumn();
export const LABEL_ROW = 5;
export const CHECK_COL = 1;
export const STATE_COL = 2;
export const TITLE_COL = 3;
export const LABEL_COL = 4;
export const BODY_COL = 5;
export const ASSIGNEE_COL = 6;
export const URL_COL = 7;
