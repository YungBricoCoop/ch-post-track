import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tracking from "./pages/Tracking";
import "./css/App.css";
function App() {
  return (
    <Tracking />
/*     <div className="App">
      <div className="container">
      <Router>
            <Routes>
              <Route path="/" exact element={<Tracking />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/register" exact element={<Register />}></Route>
              <Route path="/tracking" exact element={<Tracking />}></Route>
            </Routes>
      </Router>
      </div>
    </div> */
  );
}

export default App;
