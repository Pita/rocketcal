import * as cheerio from "cheerio";
const chrono = require("chrono-node");

export interface Launch {
  label: string;
  date: Date;
  href?: string;
}

export function parseLaunches(body: string): Launch[] {
  const $ = cheerio.load(body);

  // find upcoming table
  const $upcoming = $(".sidebar_content > table")[0];

  // get table rows, cut away header
  const $upcomingRows = $($upcoming).find("> tbody > tr").slice(1);

  const launches: Array<Launch> = [];

  $upcomingRows.each((_, row) => {
    try {
      const $row = $(row);

      const rowText = $row.children("td").last().text();
      const date = chrono.parseDate(rowText);

      const link = $row.find("td > a");
      const label = link.text();
      const href = link.attr("href");

      launches.push({
        label,
        date,
        href,
      });
    } catch (e) {
      console.error(e);
    }
  });

  return launches;
}
