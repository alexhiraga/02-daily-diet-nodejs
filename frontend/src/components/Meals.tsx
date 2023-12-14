export default function Meals() {
    return (
        <div className="container">
            <h3 className="mb-5 text-left">Meals</h3>

            {/* map */}
            <h4 className="text-left mb-2">
                12.08.22
            </h4>
            <div className="mealContainer">
                <div className="border-r border-gray-5 text-gray-1 font-bold text-sm pr-4 my-auto">
                    20:00
                </div>
                <div className="text-gray-2 text-left w-full my-auto">
                    X-tudo
                </div>
                <div className="w-4 h-4 rounded-full bg-red-mid pl-4 my-auto"></div>
            </div>
            <div className="mealContainer">
                <div className="border-r border-gray-5 text-gray-1 font-bold text-sm pr-4 my-auto">
                    20:00
                </div>
                <div className="text-gray-2 text-left w-full my-auto">
                    X-tudo
                </div>
                <div className="w-4 h-4 rounded-full bg-red-mid pl-4 my-auto"></div>
            </div>
            <div className="mealContainer">
                <div className="border-r border-gray-5 text-gray-1 font-bold text-sm pr-4 my-auto">
                    20:00
                </div>
                <div className="text-gray-2 text-left w-full my-auto">
                    X-tudo
                </div>
                <div className="w-4 h-4 rounded-full bg-red-mid pl-4 my-auto"></div>
            </div>
        </div>
    )
}