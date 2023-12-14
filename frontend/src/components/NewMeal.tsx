import { Plus } from 'phosphor-react'
import { useState } from 'react'
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'

const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    date: z.string(),
    time: z.string(),
    isOnDiet: z.string()
})

type formInputs = z.infer<typeof formSchema>

export default function NewMeal() {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const setOpenContainer = () => {
        setIsOpen((state) => !state)
    }

    const { 
        control,
        register, 
        handleSubmit, 
    } = useForm<formInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isOnDiet: 'true'
        }
    })

    function handleSubmitMeal(data: formInputs) {
        console.log(data)
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
                        />

                        <span>Description:</span>
                        <input type="text" placeholder="Meal"
                            {...register('description')}
                        />

                        <span>Date:</span>
                        <input type="text" placeholder="Meal"
                            {...register('date')}
                        />

                        <span>Time:</span>
                        <input type="text" placeholder="Meal"
                            {...register('time')}
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

                        <button className="btnPrimary mt-4 flex justify-center" onClick={handleSubmit(handleSubmitMeal)}>
                            Register meal
                        </button>

                    </form>

                </div>
            )}
        </div>
    )
}