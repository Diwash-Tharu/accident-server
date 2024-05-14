"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./prisma"));
// Import the path module to handle file paths
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});
app.post("/createLocation", async (req, res) => {
    try {
        const { longititude, latitude } = req.body;
        console.log(longititude, latitude);
        const locationCreated = await prisma_1.default.location.create({
            data: {
                longitiude: longititude,
                latitude: latitude,
            },
        });
        return res.status(200).json({ success: true, location: locationCreated });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
app.get("/getLocations", async (req, res) => {
    try {
        const locations = await prisma_1.default.location.findMany({
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(locations);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
const PORT = 5500;
prisma_1.default
    .$connect()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
})
    .catch(async (e) => {
    console.log(e.message);
});
