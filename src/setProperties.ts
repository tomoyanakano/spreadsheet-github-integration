const setProperties = (
  accessToken: string,
  username: string,
  repository: string
) => {
  PropertiesService.getScriptProperties().setProperty(
    "accessToken",
    accessToken
  );
  PropertiesService.getScriptProperties().setProperty("username", username);
  PropertiesService.getScriptProperties().setProperty("repository", repository);
};

export default setProperties;
