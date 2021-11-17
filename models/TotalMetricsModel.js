const mongoose = require("mongoose");

const totalMetricsSchema = mongoose.Schema({
    webreq: Number,
    timespent: Number,
});

const TotalMetric = mongoose.model("TotalMetric", totalMetricsSchema);

module.exports = TotalMetric;
