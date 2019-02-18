import * as request from "request-promise-native";

export async function loadHTML(): Promise<string> {
  return await request({
    url: "https://everydayastronaut.com/prelaunch-previews/",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Safari/537.36",
    },
  });
}
