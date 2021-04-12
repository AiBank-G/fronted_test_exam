import "./index.scss";
import IndexRoot from "./IndexRoot";

const rootDiv = document.createElement("div");
rootDiv.id = "root";
document.body.appendChild(rootDiv);

ReactDOM.render(<IndexRoot />, rootDiv);
