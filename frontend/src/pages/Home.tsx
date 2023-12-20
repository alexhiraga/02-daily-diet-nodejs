import { useEffect, useState } from "react";
import { User } from "../Router";
import Header from "../components/Header";
import Meals from "../components/Meals";
import NewMeal from "../components/NewMeal";
import Stats from "../components/Stats";
import { api } from "../lib/axios";
import AlertBadge from "../components/AlertBadge";

interface Props {
    user: User
}

export interface mealUpdate {
    name: string;
    description: string;
    time: number;
    isOnDiet: boolean;
}

export interface SummaryData {
    totalMeals: number
    countOnDiet: number
    countOffDiet: number
    bestSequence: number
    onDietPercentage: number
}

// raw data
export interface rawMealList {
    mealId: string
    name: string
    description: string
    time: number
    isOnDiet: number
}

export interface MealData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map?: any;
    mealId: string
    owner?: string
    name: string
    description: string
    time: number
    isOnDiet: number | boolean
    date?: string
}

export interface Alert {
    type: 'success' | 'error' | ''
    message: string
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
    const [mealsList, setMealsList] = useState<rawMealList[]>([])
    const [mealsLength, setMealsLength] = useState<number>(0)
    const [alert, setAlert] = useState<Alert>({
        type: '',
        message: ''
    })
    const [offset, setOffset] = useState<number>(0)
    const [hasMoreData, setHasMoreData] = useState<boolean>(true)

    useEffect(() => {
        getData()
        getSummary()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function displayAlert({ type, message }: Alert) {
        setAlert({ type, message })

        setTimeout(() => {
            setAlert({ type: '', message: '' })
        }, 5000)
    }

    async function getData() {
        // get more data
        try {
            setOffset(state => state + 5)
            const resMeals = await api.get(`/meal/user?offset=${offset}&limit=5`)
            organizeMealsByDate(resMeals.data.meals)
            if (resMeals.data.meals.length === 0) setHasMoreData(false)
            else setHasMoreData(true)
        } catch (error) {
            console.error(error)
            displayAlert({
                type: 'error',
                message: 'Error in requesting the meals'
            })
        }
    }

    function refreshMeal(mealId: string | undefined, data: mealUpdate) {
        const updatedMeals: UserMealsData = Object.fromEntries(
            Object.entries(meals).map(([key, _meals]) => [
                key,
                _meals.map((_meal) =>
                    _meal.mealId === mealId
                        ? {
                            ..._meal,
                            description: data.description,
                            name: data.name,
                            isOnDiet: data.isOnDiet,
                            time: data.time,
                        }
                        : _meal
                ),
            ])
        );
        setMeals(updatedMeals)
    }

    // Function to format timestamp to "MM/DD/YYYY"
    function formatDate(timestamp: number) {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Month is zero-based
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    function organizeMealsByDate(newMeals: rawMealList[]) {
        const mealsListUpdated = mealsList ? [...mealsList, ...newMeals] : [...newMeals]
        setMealsList(mealsListUpdated)

        const organizedMeals: UserMealsData = mealsListUpdated.reduce((result: UserMealsData, item) => {
            const formattedDate: string = formatDate(item.time)

            if (!result[formattedDate]) {
                result[formattedDate] = [];
            }

            result[formattedDate].push(item);

            return result;
        }, {});
        setMealsLength(mealsListUpdated.length)
        setMeals(organizedMeals)
    }

    async function getSummary() {
        try {
            const resSummary = await api.get('/meal/summary')
            setSummary(resSummary.data)
        } catch (error) {
            console.error(error)
            displayAlert({
                message: 'Error in requesting summary',
                type: 'error',
            })
        }
    }

    function addNewMeal(meal: MealData) {
        const date = meal.date as string
        const newMeal = {
            mealId: meal.mealId,
            name: meal.name,
            description: meal.description,
            time: meal.time,
            isOnDiet: meal.isOnDiet
        }

        // eslint-disable-next-line no-prototype-builtins
        if (meals.hasOwnProperty(date)) {
            const updatedMeals = {
                ...meals,
                [date]: [...meals[date], newMeal]
            }
            setMeals(updatedMeals)
        } else {
            setMeals({
                [date]: [newMeal],
                ...meals,
            })
        }
    }

    function removeMeal(meal: MealData) {
        const updatedMeals = Object.fromEntries(
            Object.entries(meals).map(([key, _meals]) => [
                key,
                _meals.filter((_meal) => _meal.mealId !== meal.mealId)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ]).filter(([_key, _meals]) => _meals.length > 0) // remove the key if the meals from date is empty
        )
        setMeals(updatedMeals)
    }

    return (
        <div className="content flex gap-5 pt-11">
            {/* Left side */}
            <div className="w-full sm:w-8/12">
                <Header user={user} />
                {mealsList && (
                    <Stats summary={summary} />
                )}
                <Meals
                    meals={meals}
                    displayAlert={displayAlert}
                    getData={getData}
                    getSummary={getSummary}
                    removeMeal={removeMeal}
                    mealsLength={mealsLength}
                    hasMoreData={hasMoreData}
                    refreshMeal={refreshMeal}
                />

                <AlertBadge alert={alert} />
            </div>

            {/* Right side */}
            <div className="w-full sm:w-4/12">
                <NewMeal addNewMeal={addNewMeal} displayAlert={displayAlert} />
            </div>
        </div>
    )
}