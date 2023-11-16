export const ProfileURL = (key: string): string => {
  if (key === "Twitter") {
    return "https://twitter.com";
  }
  if (key === "Warpcast") {
    return "https://warpcast.com";
  }

  return "";
};
