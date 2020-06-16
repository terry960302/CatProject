const admin = require("firebase-admin");
const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const UUID = require("uuid-v4");

const app = express();
app.use(express.static("view"));
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

//Firebase Init
let serviceAccount = require("C:/Users/terry/Desktop/Node.js_projects/CatProject/conf/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://catgenerator-5d309.appspot.com",
});

let db = admin.firestore();
let storageBucket = admin.storage().bucket();

//Select Cat Page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/view/index.html");
});

//Upload Image to Firebase Storage
app.post("/upload", function (req, res) {
  if (req.body["imagePath"] === undefined) {
    return;
  }

  imagePath = req.body["imagePath"];

  //[Uri -> 이미지]
  const localImagePath = decodeImageBase64Uri(imagePath);
  console.log(`다운받은 이미지 경로 : ${localImagePath}`);

  let uuid = UUID();

  //[Storage 저장]
  storageBucket
    .upload(localImagePath, {
      destination: uuid,
      uploadType: "media",
      metadata: {
        contentType: "image/png",
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
    })
    .then(async (data) => {
      let storageFile = data[0];

      let storageUrl = await Promise.resolve(
        "https://firebasestorage.googleapis.com/v0/b/" +
          storageBucket.name +
          "/o/" +
          encodeURIComponent(storageFile.name) +
          "?alt=media&token=" +
          uuid
      );
      console.log("[업로드 성공] 스토리지 이미지 경로 : ", storageUrl);

      // [Database 저장]
      var docRandId = db.collection("Cat").doc().id;

      let docRef = db.collection("Cat").doc(docRandId);

      docRef
        .set({
          image_path: storageUrl,
        })
        .then((_) => console.log("디비 업로드 성공"))
        .catch((err) => console.log("디비 업로드 실패 : ", err));
    })
    .catch((err) => {
      console.log(`업로드 실패 : ${err}`);
    });
});

//Read

let port = 3000;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

function decodeImageBase64Uri(imageBase64) {
  function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};

    if (matches.length !== 3) {
      return new Error("Invalid input string");
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], "base64");

    return response;
  }

  // Regular expression for image type:
  // This regular image extracts the "jpeg" from "image/jpeg"
  var imageTypeRegularExpression = /\/(.*?)$/;

  // Generate random string
  var seed = crypto.randomBytes(20);
  var uniqueSHA1String = crypto.createHash("sha1").update(seed).digest("hex");

  var base64Data = imageBase64;

  var imageBuffer = decodeBase64Image(base64Data);

  var locatioPath = "./cat_img/";
  // var locatioPath = "C:/Users/terry/Desktop/Node.js_projects/CatProject/";

  var uniqueRandomImageName = "image-" + uniqueSHA1String;
  // This variable is actually an array which has 5 values,
  // The [1] value is the real image extension
  var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);

  var userUploadedImagePath =
    locatioPath + uniqueRandomImageName + "." + imageTypeDetected[1];

  // Save decoded binary image to disk
  try {
    require("fs").writeFile(
      userUploadedImagePath,
      imageBuffer.data,
      function () {
        console.log(
          "DEBUG - feed:message: Saved to disk image attached by user:",
          userUploadedImagePath
        );
      }
    );
    return userUploadedImagePath;
  } catch (error) {
    console.log("ERROR:", error);
  }
}
