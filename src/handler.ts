import { parseLaunches } from "./parser";
import { generateIcal } from "./ical";
import { loadHTML } from "./loadHtml";
import * as AWS from "aws-sdk";

const s3 = new AWS.S3();

export async function upload(options: {
  filename: string;
  body: string;
  contentType: string;
  publicRead?: boolean;
}): Promise<void> {
  const { body, filename, contentType, publicRead } = options;
  await s3
    .upload({
      Bucket: process.env.BUCKET,
      Key: filename,
      Body: new Buffer(body, "utf8"),
      ACL: publicRead ? "public-read" : undefined,
      ContentType: contentType,
    })
    .promise();
}

// export async function hello(event, context, callback) {
export const fetch = async () => {
  console.time("fetch-html");
  const html = await loadHTML();
  console.timeEnd("fetch-html");

  console.time("parse-html");
  const launches = parseLaunches(html);
  console.timeEnd("parse-html");

  console.time("generate-ical");
  const ical = generateIcal(launches);
  console.timeEnd("generate-ical");

  console.time("upload-s3");
  await Promise.all([
    upload({
      filename: "launches.json",
      body: JSON.stringify(launches),
      contentType: "application/json",
    }),
    upload({
      filename: "launches.ics",
      body: ical,
      contentType: "text/calendar",
      publicRead: true,
    }),
  ]);
  console.timeEnd("upload-s3");

  return launches;
};
