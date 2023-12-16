import { MealData, UserMealsData } from "../pages/Home"
import moment from 'moment'

interface Props {
    data: UserMealsData
}

export default function Meals({ data }: Props) {
    
    return (
        <div className="container">
            <h3 className="mb-5 text-left">Meals</h3>

            {/* map */}
            {data.meals && Object.entries(data.meals).map(([date, mealList]) => (
                <>
                    <h4 className="text-left mb-2" key={date}>
                        {date}
                    </h4>
                    {mealList.map((meal: MealData) => (
                        <div className="mealContainer" key={meal.mealId}>
                            <div 
                                className="border-r border-gray-5 text-gray-1 font-bold text-sm pr-4 my-auto"
                                title={moment(meal.time).format("LLLL")}    
                            >
                                {moment(meal.time).format("HH:mm")}
                            </div>
                            <div className="text-gray-2 text-left w-full my-auto">
                                {meal.name}
                            </div>
                            {meal.isOnDiet ? (
                                <div className="w-4 h-4 rounded-full bg-green-mid pl-4 my-auto" title="On diet" />
                            ) : (
                                <div className="w-4 h-4 rounded-full bg-red-mid pl-4 my-auto" title="Off diet" />
                            )}
                        </div>
                    ))}
                </>
            ))}
            
        </div>
    )
}