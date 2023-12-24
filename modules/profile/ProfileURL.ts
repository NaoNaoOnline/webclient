export const ProfileURL = (key: string): string => {
  if (key === "Twitch") {
    return "https://twitch.tv";
  }
  if (key === "Twitter") {
    return "https://twitter.com";
  }
  if (key === "Warpcast") {
    return "https://warpcast.com";
  }

  return "";
};
