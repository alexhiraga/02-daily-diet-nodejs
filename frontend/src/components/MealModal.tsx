import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Modal from 'react-modal';
import { Alert, MealData, mealUpdate } from '../pages/Home';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'
import { api } from '../lib/axios';
import * as RadioGroup from "@radix-ui/react-radio-group";

export interface ModalProps {
    openModal: (meal: MealData) => void;
    displayAlert: ({type, message}: Alert) => void
    refreshMeal: (mealId: string | undefined, data: mealUpdate) => void
    getSummary: () => void
}

export interface ModalRef {
    openModal: (meal: MealData) => void;
}

const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    date: z.string(),
    time: z.string(),
    isOnDiet: z.string()
})

type formInputs = z.infer<typeof formSchema>

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '480px',
        padding: '3rem',
        border: '1px solid var(--gray-5)',
        borderRadius: '15px'
    },
  };

const MealModal = forwardRef<ModalRef, ModalProps>((props, ref) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [meal, setMeal] = useState<MealData | undefined>()

    function handleOpenModal(meal: MealData) {
        setMeal(meal)
        setIsOpen(true)
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    useImperativeHandle(ref, () => ({
        openModal: handleOpenModal,
    }))

    const { 
        control,
        register, 
        handleSubmit,
        reset
    } = useForm<formInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: meal && meal.name,
            description: meal && meal.description,
            date: meal && moment(meal.time).format('YYYY-MM-DD'),
            time: meal && moment(meal.time).format('HH:mm'),
            isOnDiet: (meal && meal.isOnDiet) ? 'true' : 'false',
        }
    })

    useEffect(() => {
        if (meal) {
            // Set default values for the form
            reset({
                name: meal.name,
                description: meal.description,
                date: moment(meal.time).format('YYYY-MM-DD'),
                time: moment(meal.time).format('HH:mm'),
                isOnDiet: meal.isOnDiet ? 'true' : 'false',
            });
        }
    }, [meal, reset]);


    async function handleSubmitMeal(data: formInputs) {
        setMessage('')
        if(!meal?.mealId || !data.date || !data.description || !data.name || !data.time) setMessage('Please fill all required fields.')

        // transform the date into a timestamp
        const dateTimeString = data.date + data.time
        const dateTimeMoment = moment(dateTimeString, 'YYYY-MM-DD HH:mm')
        const timestamp = dateTimeMoment.valueOf()

        const isOnDiet = data.isOnDiet === 'true' ? true : false
        
        try {
            const processedData = {
                name: data.name,
                description: data.description,
                time: timestamp,
                isOnDiet
            }
            await api.put(`/meal/update/${meal && meal.mealId}`, processedData)
            // close modal and update list
            handleCloseModal()
            props.refreshMeal(meal && meal.mealId, processedData)
            props.getSummary()

            props.displayAlert({
                type: 'success',
                message: `Meal ${data.name} updated successfully!`
            })
        } catch (error) {
            console.error(error)
            setMessage('An error occurred. Please try again later.')
        }

    }
    
    return (
        <Modal 
            style={customStyles}
            isOpen={isOpen}
            onRequestClose={handleCloseModal}
        >
            <div className="flex flex-col justify-between">
                <div>
                    <h3 className="mb-3">Edit meal</h3>
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
                            Update meal
                        </button>

                        <button className="btnSecondary mt-4 flex justify-center" onClick={() => handleCloseModal()}>
                            Cancel
                        </button>

                    </form>
                </div>

            </div>
        </Modal>
    )
})

export default MealModal;