import * as cheerio from "cheerio";
import { String, Record, Void, Union, Static } from "runtypes";

const launchAttributes = Record({
  Mission: Union(String, Void),
  Location: String,
  LSP: String,
  Rocket: String,
  "Window start": String,
  "Window end": String,
});

function isValidDate(d: any): d is Date {
  return !isNaN(d) && d instanceof Date;
}

export interface Launch {
  label: string;
  attributes: Static<typeof launchAttributes>;
  date: Date;
}

export function parseLaunches(body: string): Launch[] {
  const $ = cheerio.load(body);

  // find upcoming table
  const $upcoming = $(".sidebar_content > table")[0];

  // get table rows, cut away header
  const $upcomingRows = $($upcoming)
    .find("> tbody > tr")
    .slice(1);

  const launches: Array<Launch> = [];

  $upcomingRows.each((_, row) => {
    const $row = $(row);

    const isTBD = $row
      .find(".prelaunch_previews_tooltip")
      .last()
      .contents()
      .first()
      .text()
      .includes("TBD");
    if (isTBD) {
      return;
    }

    const $tooltipRows = $row.find(
      ".prelaunch_previews_tooltiptext table > tbody > tr"
    );

    const attributesObject: { [key: string]: string } = {};
    $tooltipRows.each((_, tooltipRow) => {
      const cells = $(tooltipRow).find("td");
      if (cells.length !== 2) {
        throw new Error(`Unexpected length of cells: ${cells.length}`);
      }
      const name = $(cells[0]).text();
      const value = $(cells[1]).text();
      attributesObject[name] = value;
    });
    const attributes = launchAttributes.check(attributesObject);

    const label = $row
      .find(".prelaunch_previews_tooltip")
      .contents()
      .first()
      .text();
    const date = new Date(attributes["Window start"]);
    if (!isValidDate(date)) {
      throw new Error(`Invalid date '${attributes["Window start"]}'`);
    }

    launches.push({
      label,
      date,
      attributes,
    });
  });

  return launches;
}
