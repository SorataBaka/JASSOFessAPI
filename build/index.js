"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const versionrouter_1 = __importDefault(require("./routes/versionrouter"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const properOrigin = process.env.TRUE_ORIGIN || "http://localhost:3000";
const mongooseConnectionUrl = process.env.MONGO_URL || undefined;
const isDevelopment = process.env.NODE_ENV === "development";
const PORT = process.env.PORT || 3000;
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 1,
    message: {
        status: 429,
        message: "Too many requests",
    },
    standardHeaders: true,
    statusCode: 429,
    keyGenerator: (req) => {
        return req.ip;
    },
});
if (mongooseConnectionUrl === undefined)
    throw new Error("SETUP ERROR: MONGO_URL is not set in the environment variables");
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (origin === properOrigin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
}));
if (!isDevelopment) {
    app.use("/api", rateLimiter);
    console.log("Starting in production mode");
}
else {
    console.log("Starting in development mode");
}
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/api", versionrouter_1.default);
app.all("/", (req, res) => {
    return res.json({
        status: 200,
        isValid: true,
        data: {
            message: "Jasso Confession API",
            version: "1.0.0",
        },
    });
});
app.listen(PORT, async () => {
    const newConnection = await mongoose_1.default.connect(mongooseConnectionUrl);
    if (newConnection.connections.length !== 0)
        console.log("Connected to MongoDB");
    console.log(`Server started on port ${PORT}`);
});
