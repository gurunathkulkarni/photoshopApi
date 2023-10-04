const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const connect = require("./DB/index");
const galleryModel = require("./models/gallery.module");
const contactusModel = require("./models/contactus.module");
const bannerModel = require("./models/banner.module");
const videoModel = require("./models/video.module");
const happyCustomerModel = require("./models/happyCustomer.module");
app.use(
  cors({
    origin: "*",
  })
);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
connect();

app.use("/uploads", express.static("uploads"));

// Routes
app.get("/", (req, res) => {
  // Implement your logic to fetch gallery items from a database or file
  const galleryItems = [];
  res.render("index", { galleryItems });
});

// ... Implement other routes for adding, editing, and deleting gallery items
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    let d = new Date();
    let time = d.getTime();
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    if (extension === "mpeg") {
      extension = "mp3";
    }
    const fileName = `${time}.${extension}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });



app.get("/get/gallery", async (req, res) => {
  const getDataFromDb = await galleryModel.find();
  res.send({ data: getDataFromDb });
});

app.get("/get/banner", async (req, res) => {
  const data = await bannerModel.find({ isDeleted: false });
  res.send({ data });
});

app.get("/delete/banner/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await bannerModel.findById(id); 
    if (data) {
      data.isDeleted = true;
      await data.save();
      try {
        fs.unlinkSync(data.imageUrl[0].path);
        console.log("Delete File successfully.");
        await bannerModel.deleteOne({ _id: id });
      } catch (error) {
        console.log(error);
      }
      res.send({ status: true, message: "success" });
    }
  } catch (err) {
    res.send({ status: false, message: "failed", err });
  }
});

// API for adding contact us from app
app.post("/add/contactus", async (req, res) => {
  try {
    const { name, phone_number, message, email, checkbox, eventLocation, howDidYouHear } = req.body;
    const obj = {
      name: name,
      phone_number: phone_number,
      message: message,
      email: email,
      checkbox: checkbox,
      eventLocation: eventLocation,
      howDidYouHear: howDidYouHear
    };
    const insertedData = await contactusModel.create(obj);
    res.send({ message: "form submitted successfully", status: true });
  } catch (e) {
    res.send({ message: "form submitted failed", status: false });
  }
});

app.get("/get/contactus", async (req, res) => {
  try {
    const getData = await contactusModel.find();
    res.send({ data: getData });
  } catch (e) {
    res.send({ status: false, error: e });
  }
});


app.get("/delete/gallery/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const data = await galleryModel.findById(id);
    if (data) {
      try {
        if (data.thumbnailImgUrl && data.thumbnailImgUrl.path) {
          fs.unlinkSync(data.thumbnailImgUrl.path);
        }
        if (data.audioFileUrl && data.audioFileUrl.path) {
          fs.unlinkSync(data.audioFileUrl.path);
        }
        if (data.galleryImgUrls.length) {
          data.galleryImgUrls.forEach((item) => {
            fs.unlinkSync(item.path);
          })
        }
        await galleryModel.deleteOne({ _id: id });
        res.send({status: true, message: "success"});
      } catch (error) {
        console.log(error);
      }
    }
  } catch (err) {
    res.send({ status: false, data: err});
  }

});

app.post(
  "/add/gallery",
  upload.fields([
    { name: "images" },
    { name: "thumbnail_image" }
  ]),
  async (req, res) => {
    const { title, description, quotes, type } = req.body;
    const images = req.files["images"];
    const thumbanilImage = req.files["thumbnail_image"][0];
    // const audio = req.files["audio"][0];
    const modelObj = {
      title,
      description,
      quotes,
      thumbnailImgUrl: thumbanilImage,
      // audioFileUrl: audio,
      galleryImgUrls: images,
      type,
    };
    const sendDataToDb = await galleryModel.create(modelObj);
    res.send({ status: true, data: sendDataToDb });
  }
);

app.post(
  "/add/banner",
  upload.fields([{ name: "images" }]),
  async (req, res) => {
    const { title } = req.body;
    const images = req.files["images"];
    const modelObj = {
      title,
      imageUrl: images,
    };
    const sendDataToDb = await bannerModel.create(modelObj);
    res.send({ status: true, data: sendDataToDb });
  }
);

app.get("/get/video", async (req, res) => {
  try {
    const getDataFromDb = await videoModel.find();
    res.send({ data: getDataFromDb });
  } catch (err) {
    res.send({ status: false, message: err, err });
  }
});

app.get("/delete/video/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await videoModel.deleteOne({ _id: id });
    res.send({ status: true, message: "deleted" });
  } catch (err) {
    res.send({ status: false, message: err, err });
  }
});

app.post("/add/video", async (req, res) => {
  try {
    const { title, videoUrl } = req.body;
    let imageUrl = "";
    if (videoUrl) {
      const videoIdArray = videoUrl.split("v=");
      if (videoIdArray.length) {
        imageUrl = `https://img.youtube.com/vi/${videoIdArray[1]}/0.jpg`;
      }
    }

    const obj = {
      title,
      videoUrl,
      imageUrl,
    };
    const createdData = await videoModel.create(obj);
    if (createdData) {
      res.send({ status: true, message: "created successfully" });
    }
  } catch (err) {
    res.send({ status: false, message: err, err });
  }
});


app.post(
  "/add/happyCustomer",
  upload.fields([{ name: "images" }]),
  async (req, res) => {
    const { name, message } = req.body;
    const images = req.files["images"];
    const modelObj = {
      name,
      message,
      imageUrl: images,
    };
    const sendDataToDb = await happyCustomerModel.create(modelObj);
    res.send({ status: true, data: sendDataToDb });
  }
);

app.get("/get/happyCustomer", async (req, res) => {
  const data = await happyCustomerModel.find({});
  res.send({ data });
});

app.get("/delete/happyCustomer/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await happyCustomerModel.findById(id); 
    if (data) {
      try {
        fs.unlinkSync(data.imageUrl[0].path);
        console.log("Delete File successfully.");
        await happyCustomerModel.deleteOne({ _id: id });
      } catch (error) {
        console.log(error);
      }
      res.send({ status: true, message: "success" });
    }
  } catch (err) {
    res.send({ status: false, message: "failed", err });
  }
});



// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
