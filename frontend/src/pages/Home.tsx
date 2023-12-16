import { useEffect, useState } from "react";
import { User } from "../Router";
import Header from "../components/Header";
import Meals from "../components/Meals";
import NewMeal from "../components/NewMeal";
import Stats from "../components/Stats";
import { api } from "../lib/axios";

interface Props {
    user: User
}

export interface SummaryData {
    totalMeals: number
    countOnDiet: number
    countOffDiet: number
    bestSequence: number
    onDietPercentage: number
}

export interface MealData {
    map(arg0: (meal: MealData) => import("react/jsx-runtime").JSX.Element): unknown;
    mealId: number
    owner: string
    name: string
    description: string
    time: number
    isOnDiet: number
}

export interface UserMealsData {
    [formattedDate: string]: MealData[]
}

export default function Home({ user }: Props) {

    const [summary, setSummary] = useState<SummaryData>({
        totalMeals: 0,
        countOnDiet: 0,
        countOffDiet: 0,
        bestSequence: 0,
        onDietPercentage: 0,
    })
    const [meals, setMeals] = useState<UserMealsData>({})
    const [error, setError] = useState<string>('')

    useEffect(() => {
        getData()
        getSummary()
    }, [])

    async function getData() {
        try {
            const resMeals = await api.get('/meal/user')
            setMeals(resMeals.data)
        } catch (error) {
            console.error(error)
            setError('Error in requesting the meals')
        }
    }

    async function getSummary() {
        try {
            const resSummary = await api.get('/meal/summary')
            setSummary(resSummary.data)
        } catch (error) {
            console.error(error)
            setError('Error in requesting summary')
        }
    }

    return (
        <div className="content flex gap-5 pt-11">
            {/* Left side */}
            <div className="w-full sm:w-8/12">
                <Header user={user} error={error} />
                <Stats summary={summary} />
                <Meals data={meals} />
            </div>

            {/* Right side */}
            <div className="w-full sm:w-4/12">
                <NewMeal />
            </div>
        </div>
    )
}