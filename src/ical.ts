import { Launch } from "./parser";
import * as ical from "ical-generator";
import * as moment from "moment";

export function generateIcal(launches: Launch[]): string {
  const cal = ical({ name: "Everyday Astronaut's Prelaunch Previews" });

  launches.forEach(launch => {
    let description = "";
    for (const attributeName of Object.keys(launch.attributes)) {
      description += `${attributeName}: ${launch.attributes[attributeName]}\n`;
    }
    if (launch.href) {
      description += `Link: ${launch.href}`;
    }

    cal.createEvent({
      timezone: "UTC",
      start: moment(launch.date),
      end: moment(launch.date).add(1, "hour"),
      summary: launch.label,
      description,
      location: launch.attributes.Location,
      url: launch.href ? launch.href : undefined,
      alarms: [
        {
          type: "display",
          triggerBefore: 60 * 30,
        },
        {
          type: "display",
          triggerBefore: 60 * 5,
        },
      ],
    });
  });

  return cal.toString();
}
