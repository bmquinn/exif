const AWS = require("aws-sdk");
const exifr = require("exifr");

AWS.config.s3 = {
  accessKeyId: "minio",
  secretAccessKey: "minio123",
  endpoint: "https://devbox.library.northwestern.edu:9001",
  s3ForcePathStyle: true,
};

const downloadImage = (bucket, key) => {
  new AWS.S3().getObject(
    {
      Bucket: bucket,
      Key: key,
    },
    function (error, data) {
      if (error != null) {
        console.log(error);
      } else {
        let exif_data = exifr
          .parse(data.Body)
          .catch((error) => console.log(error));
        return exif_data.then(function (result) {
          console.log(result);
        });
      }
    }
  );
};

downloadImage("dev-ingest", "inu-dil-15de9e70-f6cc-4bd2-ba74-3dabab92b1d8.tif");
