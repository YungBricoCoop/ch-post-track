import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tracking from "./pages/Tracking";
import "./css/App.css";
function App() {
  return (
     <div className="App">
      <div className="container">
      <Router>
            <Routes>
              <Route path="/post/" exact element={<Login />} />
              <Route path="/post/login" element={<Login />} />
              <Route path="/post/register" element={<Register />}></Route>
              <Route path="/post/tracking" element={<Tracking />}></Route>
            </Routes>
      </Router>
      </div>
    </div> 
  );
}

export default App;
