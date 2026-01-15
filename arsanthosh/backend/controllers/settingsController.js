const Settings = require("../models/Settings");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getSocialLinks = catchAsync(async (req, res, next) => {
  let settings = await Settings.findOne({ key: "social_links" });

  // Default values if not set
  if (!settings) {
    settings = {
      value: {
        instagramUrl:
          "https://www.instagram.com/p/DTh_4E-Elk-/?igsh=MXVobWJ1aGI0Mnoweg==",
        youtubeUrl: "https://youtube.com/@thisisarsanthosh?si=qSSHwsILVOHyADU4",
      },
    };
  }

  res.status(200).json({
    status: "success",
    data: settings.value,
  });
});

exports.updateSocialLinks = catchAsync(async (req, res, next) => {
  const { instagramUrl, youtubeUrl } = req.body;

  const settings = await Settings.findOneAndUpdate(
    { key: "social_links" },
    {
      value: { instagramUrl, youtubeUrl },
      updatedBy: req.user?._id,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({
    status: "success",
    data: settings.value,
  });
});
