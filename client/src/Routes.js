import { React } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { HomePage } from './Components';


export const Routing = () => (
    <Router>
        <Routes>
            <Route path='/' element={<HomePage/>} />
        </Routes>
    </Router>
)