
export default function Stats() {
    return (
        <div className="flex gap-4 my-5">
            <div className="container w-4/12">
                <span className="font-bold text-3xl">
                    90,86%
                </span>
                <p className="text-xs text-gray-3">of meals within the diet</p>
                <p className="text-xs text-gray-1 font-bold">109 meals</p>
            </div>
            <div className="container w-3/12 ">
                <span className="font-bold text-3xl">
                    22
                </span>
                <p className="text-xs text-gray-3">best sequence</p>
            </div>
            <div className="container w-5/12 flex justify-center gap-4">
                <div className="text-green-dark">
                    <span className="font-bold text-3xl">
                        99
                    </span>
                    <p className="text-xs">of meals within the diet</p>
                </div>
                <div className="w-px h-full bg-gray-5"></div>
                <div className="text-red-dark">
                    <span className="font-bold text-3xl">
                        10
                    </span>
                    <p className="text-xs">of meals without the diet</p>
                </div>
            </div>
        </div>
    )
}