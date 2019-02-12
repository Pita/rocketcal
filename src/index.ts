import * as cheerio from 'cheerio';
import * as request from 'request-promise-native'; 
import { String, Record, Void, Union, Static } from 'runtypes';

const launchAttributes = Record({
  Mission: Union(String, Void),
  Location: String,
  LSP: String,
  Rocket: String,
  'Window start': String,
  'Window end': String,
})

function isValidDate(d: any): d is Date{
  return !isNaN(d) && d instanceof Date;
}

interface Launch {
  label: string,
  attributes: Static<typeof launchAttributes>,
  date: Date,
}

async function fetchLaunches() {
  const body = await request("https://everydayastronaut.com/prelaunch-previews/");
  const $ = cheerio.load(body);

  // find upcoming table
  const $upcoming = $(".sidebar_content > table")[0];
 
  // get table rows, cut away header
  const $upcomingRows = $($upcoming).find("> tbody > tr").slice(1);

  const launches: Array<Launch> = [];

  $upcomingRows.each((i, row) => {
    const $row = $(row);
    const $tooltipRows = $row.find('.prelaunch_previews_tooltiptext table > tbody > tr');

    const attributes: {[key: string]: string} = {};
    $tooltipRows.each((i, tooltipRow) => {
      const cells = $(tooltipRow).find('td');
      if (cells.length !== 2) {
        throw new Error(`Unexpected length of cells: ${cells.length}`)
      }
      const name = $(cells[0]).text();
      const value = $(cells[1]).text();
      attributes[name] = value;
    });
    const attributesTyped = launchAttributes.check(attributes);

    const label = $row.find(".prelaunch_previews_tooltiptext").contents().first().text();
    const date = new Date(attributes['Window start']);
    if (!isValidDate) {
      throw new Error(`Invalid date '${attributes['Window start']}'`);
    }

    launches.push({
      label,
      date,
      attributes: attributesTyped,
    })
  });

  return launches;
}

fetchLaunches().then(results => console.log(results)).catch((e) => console.error(e));