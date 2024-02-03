import Login from './Login.js';
import Signup from './Signup.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <ToastContainer
         position="top-center"
          autoClose={500}
          limit={3}
         hideProgressBar={false}
         newestOnTop={false}
         closeOnClick
         rtl={false}
         pauseOnFocusLoss
         draggable
         pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
       
      </Routes>

    </Router>
  );
}

export default App;
