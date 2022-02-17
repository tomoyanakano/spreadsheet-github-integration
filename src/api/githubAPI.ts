import { Issue } from "../types/issue";
import { ACCESS_TOKEN, URL } from "../utils";

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

export const postIssues = (issues: Issue[]): string[] => {
  const request = createRequest();
  const requests = issues.map((issue) => request(JSON.stringify(issue)));
  const responses = UrlFetchApp.fetchAll(requests);
  return responses.map((response) => response.getContentText());
};

export const getIssues = (): string => {
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
