const Country = require("../models/CountryModel");

const catchAsync = require("./../utils/catchAsync");

exports.addOne = catchAsync(async (req, res, next) => {
    const { dim, metrics } = req.body;
    const country = dim[1].val;
    const data = {
        device: dim[0].val,
        webreq: metrics[0].val,
        timespent: metrics[1].val,
    };

    const byDevice = [
        {
            device: "mobile",
            webreq: 0,
            timespent: 0,
        },
        {
            device: "tablet",
            webreq: 0,
            timespent: 0,
        },
        {
            device: "web",
            webreq: 0,
            timespent: 0,
        },
    ];

    const result = await Country.findOne({ name: country });

    if (!result) {
        const newData = new Country({
            name: country,
            webreq: 0,
            timespent: 0,
            byDevice,
        });
        await newData.save();
    }

    const doc = await Country.updateOne(
        { name: country, "byDevice.device": data.device },
        {
            $inc: {
                webreq: data.webreq,
                timespent: data.timespent,
                "byDevice.$.webreq": data.webreq,
                "byDevice.$.timespent": data.timespent,
            },
        },
        { new: true }
    );

    await Country.updateCountryAndTotalStats({
        webreq: data.webreq,
        timespent: data.timespent,
    });

    res.status(200).json({
        status: "success",
        message: "Data Updated",
    });
});

exports.getOne = catchAsync(async (req, res, next) => {
    const country = req.body.dim[0].val;

    const data = await Country.findOne({ name: country }).select("-__v");

    res.status(200).json({
        status: "success",
        data: {
            dim: [
                {
                    key: "country",
                    val: data.name,
                },
            ],
            metrics: [
                {
                    key: "webreq",
                    val: data.webreq,
                },
                {
                    key: "timespent",
                    val: data.timespent,
                },
            ],
        },
    });
});
