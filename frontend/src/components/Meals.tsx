import { useRef, useState } from "react"
import { Alert, MealData, UserMealsData } from "../pages/Home"
import moment from 'moment'
import MealModal, { ModalProps } from "./MealModal"
import { PencilSimpleLine, Trash, Warning } from "phosphor-react"
import { api } from "../lib/axios"
import Modal from 'react-modal';

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

interface Props {
    meals: UserMealsData
    displayAlert: ({ type, message }: Alert) => void
    getData: () => void
    removeMeal: (meal: MealData) => void
}

export default function Meals({ meals, displayAlert, getData, removeMeal }: Props) {
    const childRef = useRef<ModalProps | null>(null)
    const [showMeal, setShowMeal] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});

    const handleMaximizeContainer = (mealId: string) => {
        setShowMeal(mealId === showMeal ? null : mealId)
    }

    const handleOpenDeleteModal = (mealId: string) => {
        setIsOpen((prevOpen) => ({
            ...prevOpen,
            [mealId]: !prevOpen[mealId], // Toggle the state for the specific meal
        }));
    }

    return (
        <div className="container">
            <h3 className="mb-5 text-left">Meals</h3>
            <MealModal
                ref={childRef}
                displayAlert={displayAlert}
                getData={getData}
                openModal={function (): void {
                    throw new Error("Function not implemented.")
                }}
            />

            {/* map */}
            {meals && Object.entries(meals).map(([date, mealList]) => (
                <>
                    <h4 className="text-left mb-2" key={date}>
                        {date}
                    </h4>
                    {mealList.map((meal: MealData) => {
                        const openMeal = () => {
                            if (childRef.current) {
                                childRef.current.openModal(meal)
                            } else {
                                console.error('Child component not available yet.')
                            }
                        }

                        const handleDeleteMeal = async () => {
                            try {
                                await api.put(`/meal/delete/${meal.mealId}`)
                                removeMeal(meal)
                                displayAlert({
                                    type: "success",
                                    message: `Meal ${meal.name} deleted successfully!`
                                })
                            } catch (error) {
                                console.error(error)
                                displayAlert({
                                    type: "error",
                                    message: 'An error occurred, please try again later.'
                                })
                            }
                        }

                        return (
                            <div className="mealContainer">

                                <div className="mealInfos" key={meal.mealId} onClick={() => handleMaximizeContainer(meal.mealId)}>

                                    <div
                                        className="border-r border-gray-5 text-gray-1 font-bold text-sm pr-4 my-auto"
                                        title={moment(meal.time).format("LLLL")}
                                    >
                                        {moment(meal.time).format("HH:mm")}
                                    </div>
                                    <div className="text-gray-2 text-left w-full my-auto pl-4">
                                        {meal.name}
                                    </div>
                                    {meal.isOnDiet && showMeal === meal.mealId ? (
                                        <div className="flex w-32 gap-2 py-2 px-3 bg-gray-50 rounded-full">
                                            <div
                                                className="w-3 h-3 rounded-full bg-green-mid my-auto"
                                                title="On diet"
                                            ></div>
                                            <p className="text-sm">On diet</p>
                                        </div>
                                    ) : (
                                        <></>
                                    )}

                                    {!meal.isOnDiet && showMeal === meal.mealId && (
                                        <div className="flex w-32 gap-2 py-2 px-3 bg-gray-50 rounded-full">
                                            <div
                                                className="w-3 h-3 rounded-full bg-red-mid my-auto"
                                                title="Off diet"
                                            ></div>
                                            <p className="text-sm">Off diet</p>
                                        </div>
                                    )}

                                    {meal.isOnDiet && showMeal !== meal.mealId ? (
                                        <div className="w-4 h-4 rounded-full bg-green-mid pl-4 my-auto" title="On diet"></div>
                                    ) : (
                                        <></>
                                    )}

                                    {!meal.isOnDiet && showMeal !== meal.mealId && (
                                        <div className="w-4 h-4 rounded-full bg-red-mid pl-4 my-auto" title="Off diet"></div>
                                    )}

                                </div>

                                {showMeal === meal.mealId && (
                                    <div className="mt-4 flex justify-between">
                                        <div className="flex flex-col justify-between text-left">
                                            <p>
                                                {meal.description}
                                            </p>
                                            <p className="text-sm text-gray-4">
                                                {moment(meal.time).format('LLL')}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <button className="btnPrimary" onClick={() => openMeal()}>
                                                <PencilSimpleLine size={20} />
                                                Edit meal
                                            </button>
                                            <button className="btnSecondary" onClick={() => handleOpenDeleteModal(meal.mealId)}>
                                                <Trash size={20} />
                                                Delete meal
                                            </button>
                                        </div>

                                    </div>
                                )}

                                <Modal
                                    style={customStyles}
                                    isOpen={isOpen[meal.mealId] || false}
                                    onRequestClose={() => handleOpenDeleteModal(meal.mealId)}
                                >
                                    <Warning size={70} className="m-auto" />
                                    <h4 className="text-center mt-2">Are you sure you want to delete "{meal.name}"?</h4>
                                    <div className="flex gap-2 mt-3">
                                        <button className="btnPrimary w-1/2 mt-4 flex justify-center" onClick={handleDeleteMeal}>
                                            Yes, delete meal
                                        </button>

                                        <button className="btnSecondary w-1/2 mt-4 flex justify-center" onClick={() => handleOpenDeleteModal(meal.mealId)}>
                                            Cancel
                                        </button>
                                    </div>
                                </Modal>
                            </div>
                        )
                    })}
                </>
            ))}

        </div>
    )
}