const AWS = require("aws-sdk");
const URI = require("uri-js");
const fs = require("fs");
const tempy = require("tempy");
const exifr = require("exifr");

AWS.config.s3 = {
  endpoint: "https://devbox.library.northwestern.edu:9001",
  s3ForcePathStyle: true,
};

const parseExif = async (bucket, key) => {
  const inputFile = await makeInputFile(bucket, key);
  try {
    let output = await exifr
      .parse(inputFile, { chunked: false })
      .then((output) => console.log(output));
    return output;
  } finally {
    fs.unlink(inputFile, (err) => {
      if (err) {
        throw err;
      }
    });
  }
};

const makeInputFile = (bucket, key) => {
  return new Promise((resolve, reject) => {
    let fileName = tempy.file();
    let writable = fs
      .createWriteStream(fileName)
      .on("error", (err) => reject(err));
    let s3Stream = new AWS.S3()
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .createReadStream();

    s3Stream.on("error", (err) => reject(err));

    s3Stream
      .pipe(writable)
      .on("close", () => resolve(fileName))
      .on("error", (err) => reject(err));
  });
};

// parseExif("dev-ingest", "opo0328a.tif");
