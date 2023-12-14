
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

export default function App() {
    // create a validation for the user cookie

    // get the userId from localStorage or from a request to pass through props to <Home

    return (
        <div>
            <Navbar />
            <Home />

        </div>
    )
}

