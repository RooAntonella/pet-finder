import "./style.css";
import { router } from "./router/router";

router();

window.addEventListener("hashchange", router);
