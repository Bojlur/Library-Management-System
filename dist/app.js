"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookController_1 = __importDefault(require("./app/controllers/bookController"));
const borrowController_1 = __importDefault(require("./app/controllers/borrowController"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/books", bookController_1.default);
app.use("/borrow", borrowController_1.default);
// app.use("/notFound", notFoundRoutes);
// app.use("/error", errorHandlerRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Library LMS');
});
exports.default = app;
