import app from "./config/app.js";
import cowsay from "cowsay";
import { PORT } from "./config/config.js";

app.listen(PORT, () => console.log(cowsay.say({ text : `Server running on PORT: ${PORT}` })));