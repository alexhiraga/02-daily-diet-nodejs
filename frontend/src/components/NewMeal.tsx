import { Plus } from 'phosphor-react'
import { useState } from 'react'
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'
import moment from 'moment';
import { api } from '../lib/axios';
import { Alert, MealData } from '../pages/Home';

const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    date: z.string(),
    time: z.string(),
    isOnDiet: z.string()
})

type formInputs = z.infer<typeof formSchema>

interface Props {
    addNewMeal: (meal: MealData) => void
    displayAlert: ({type, message}: Alert) => void
}

export default function NewMeal({ addNewMeal, displayAlert }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    const setOpenContainer = () => {
        setIsOpen((state) => !state)
    }

    const { 
        control,
        register, 
        handleSubmit,
        reset
    } = useForm<formInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isOnDiet: 'true'
        }
    })

    async function handleSubmitMeal(data: formInputs) {
        setMessage('')
        if(!data.date || !data.description || !data.name || !data.time) setMessage('Please fill all required fields.')

        // transform the date into a timestamp
        const dateTimeString = data.date + data.time
        const dateTimeMoment = moment(dateTimeString, 'YYYY-MM-DD HH:mm')
        const timestamp = dateTimeMoment.valueOf()

        const isOnDiet = data.isOnDiet === 'true' ? true : false

        const processedData = {
            name: data.name,
            description: data.description,
            time: timestamp,
            isOnDiet
        }

        let mealId
        try {
            mealId = await api.post('/meal/create', processedData)

            // add meal to list
            const date = moment(data.date, 'YYYY-MM-DD').format('MM/DD/YYYY')
            const newMeal = {
                mealId: mealId.data.mealId,
                name: data.name,
                description: data.description,
                isOnDiet: isOnDiet ? 1 : 0,
                time: timestamp,
                date
            }
            addNewMeal(newMeal)

            displayAlert({
                type: 'success',
                message: `Meal ${data.name} added successfully!`
            })
            
            // clear inputs
            reset()

        } catch (error) {
            console.error(error)
            setMessage('An error occurred. Please try again later.')
        }

    }

    return (
        <div className="mt-6">
            <div className="flex justify-end mb-6">
                <button className="btnPrimary" onClick={setOpenContainer}>
                    <Plus className="my-auto" color="#FFFFFF" size={18} />
                    New meal
                </button>
            </div>

            {isOpen && (
                <div className="container">
                    <form onSubmit={handleSubmit(handleSubmitMeal)} className="flex flex-col gap-1 text-left">

                        <span>Meal:</span>
                        <input type="text" placeholder="Meal"
                            {...register('name')}
                            required
                        />

                        <span>Description:</span>
                        <textarea placeholder="Description"
                            {...register('description')}
                            required
                        />

                        <span>Date:</span>
                        <input type="date"
                            {...register('date')}
                            required
                        />

                        <span>Time:</span>
                        <input type="time" placeholder="10:30"
                            {...register('time')}
                            required
                        />

                        <span>Is the meal on diet?</span>
                        <Controller 
                            control={control}
                            name="isOnDiet"
                            render={({ field }) => {
                                return (
                                    <RadioGroup.Root className="grid grid-cols-2 gap-3" onValueChange={field.onChange} value={field.value}>
                                        <RadioGroup.Item 
                                            value="true"
                                            className="yes"
                                        >
                                            <div className="w-4 h-4 rounded-full bg-green-mid pl-4 my-auto"></div>
                                            <span className="button-M">Yes</span>
                                        </RadioGroup.Item>

                                        <RadioGroup.Item 
                                            value="false"
                                            className="no"
                                        >
                                            <div className="w-4 h-4 rounded-full bg-red-mid pl-4 my-auto"></div>
                                            <span className="button-M">No</span>
                                        </RadioGroup.Item>

                                    </RadioGroup.Root>
                                )
                            }}  
                        />

                        {message && (
                            <div className="text-center py-2 mt-1 bg-red-light text-red-dark text-sm rounded">
                                {message}
                            </div>
                        )}

                        <button className="btnPrimary mt-4 flex justify-center" onClick={handleSubmit(handleSubmitMeal)}>
                            Register meal
                        </button>

                    </form>

                </div>
            )}
        </div>
    )
}