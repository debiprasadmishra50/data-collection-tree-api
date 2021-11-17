const mongoose = require("mongoose");

const TotalMetric = require("./TotalMetricsModel");

// const deviceSchema = mongoose.Schema({
//     device: {
//         type: String,
//         enum: {
//             values: ["mobile", "tablet", "web"],
//             message:
//                 "Device must be mobile or tablet or web, {VALUE} is not supported",
//         },
//     },
//     webreq: Number,
//     timespent: Number,
// });

const countrySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "A country must have a country code"],
        unique: true,
        maxlength: [3, "Countr code mustnot exceed 3 characters"],
    },
    webreq: Number,
    timespent: Number,
    byDevice: {
        type: Array,
        select: false,
    },
});

countrySchema.statics.updateCountryAndTotalStats = async function ({
    webreq,
    timespent,
}) {
    await TotalMetric.findByIdAndUpdate("6194ac61a064c2438ac06cd1", {
        $inc: { webreq, timespent },
    });
};

// countrySchema.post("save", function () {
//     this.constructor.updateCountryAndTotalStats(this);
// });

// countrySchema.pre("updateOne", function (next) {
//     console.log("[+] from find middleware");
//     // this.constructor.updateCountryAndTotalStats(this);
// });

const Country = mongoose.model("Country", countrySchema);

module.exports = Country;
