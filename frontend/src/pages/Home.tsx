import { useEffect } from "react";
import Header from "../components/Header";
import Meals from "../components/Meals";
import NewMeal from "../components/NewMeal";
import Stats from "../components/Stats";

import { api } from '../lib/axios'

export default function Home() {

    
    useEffect(() => {
        
        // make the req to backend
    }, [])

    return (
        <div className="content flex gap-5 pt-11">
            {/* Left side */}
            <div className="w-full sm:w-8/12">
                <Header />
                <Stats />
                <Meals />
            </div>

            {/* Right side */}
            <div className="w-full sm:w-4/12">
                <NewMeal />
            </div>
        </div>
    )
}