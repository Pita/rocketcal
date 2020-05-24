import { parseLaunches } from "../parser";
import * as fs from "fs";
// import { loadHTML } from "../loadHtml";

describe("parser", () => {
  test("parses correctly static html", () => {
    const html = fs.readFileSync(
      `${__dirname}/__mocks__/previews.html`,
      "utf8"
    );
    const launches = parseLaunches(html);
    expect(launches).toMatchSnapshot();
  });

  // test("parses correctly live html", async () => {
  //   const html = await loadHTML();

  //   const launches = parseLaunches(html);
  //   expect(launches.length).toBeGreaterThan(0);
  // });
});
