import { SummaryData } from "../pages/Home"

interface Props {
    summary: SummaryData
}
export default function Stats( {summary} : Props) {
    
    return (
        <div className="flex gap-4 my-5">
            <div 
                className="container w-4/12" 
                style={ 
                    summary.onDietPercentage >= 70 ? {
                        background: 'var(--green-light)',
                        color: 'var(--green-dark)'
                    } : {
                        background: 'var(--red-light)',
                        color: 'var(--red-dark)'
                    }
                }
            >
                <span className="font-bold text-3xl">
                    {summary && summary.onDietPercentage}%
                </span>
                <p className="text-xs ">of meals within the diet</p>
                <p className="text-xs font-bold">{summary?.totalMeals} {summary?.totalMeals > 1 ? 'meals' : 'meal'}</p>
            </div>
            <div className="container w-3/12 ">
                <span className="font-bold text-3xl">
                    {summary?.bestSequence}
                </span>
                <p className="text-xs text-gray-3">best sequence</p>
            </div>
            <div className="container w-5/12 flex justify-center gap-4">
                <div className="text-green-dark">
                    <span className="font-bold text-3xl">
                        {summary?.countOnDiet}
                    </span>
                    <p className="text-xs">meals within the diet</p>
                </div>
                <div className="w-px h-full bg-gray-5"></div>
                <div className="text-red-dark">
                    <span className="font-bold text-3xl">
                        {summary?.countOffDiet}
                    </span>
                    <p className="text-xs">meals without the diet</p>
                </div>
            </div>
        </div>
    )
}