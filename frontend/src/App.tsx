import Modal from 'react-modal';
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";

Modal.setAppElement('#root')

export default function App() {
    
    return (
        <div>
            <BrowserRouter>
                <Router />
            </BrowserRouter>

        </div>
    )
}

