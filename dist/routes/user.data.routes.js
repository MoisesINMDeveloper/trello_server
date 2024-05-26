"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const autenticate_token_1 = __importDefault(require("../middleware/autenticate.token"));
const user_data_controller_1 = require("../controllers/user.data.controller");
const router = express_1.default.Router();
router.get("/getdatauser", autenticate_token_1.default, user_data_controller_1.getUserData);
exports.default = router;
