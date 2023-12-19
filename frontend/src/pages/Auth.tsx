import * as z from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { api } from '../lib/axios'
import { useNavigate } from 'react-router-dom'
import { User } from '../Router'

const loginFormSchema = z.object({
    userName: z.string().optional(),
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string().optional()
})

type LoginFormInputs = z.infer<typeof loginFormSchema>

interface Props {
    setInfo: (user: User) => void
}

export default function Auth({ setInfo }: Props) {

    const [showLogin, setShowLogin] = useState<boolean>(true)
    const [error, setError] = useState<string>('')
    const navigate = useNavigate()
 
    const { 
        register, 
        handleSubmit, 
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginFormSchema)
    })

    const toggleLoginRegister = () => {
        setShowLogin((state) => !state)
        setError('')
    }

    async function handleSubmitLogin(data: LoginFormInputs) {
        if(!data) return
        setError('')

        if(showLogin) {
            // Log in
            let res
            try {
                res = await api.post('/signin', {
                    email: data.email,
                    password: data.password
                }, { withCredentials: true })
                setInfo(res.data)
                navigate("/daily-diet")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error(error)
                setError(error.response.data.error)
            }
        } else {
            // Register and log in
            let res
            try {
                res = await api.post('/signup', {
                    userName: data.userName,
                    email: data.email,
                    password: data.password,
                    confirmPassword: data.confirmPassword
                }, { withCredentials: true })
                localStorage.setItem('@daily-diet:user-token-1.0.0', JSON.stringify(res.data.token))
                navigate("/daily-diet")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error(error)
                setError(error.response.data.error)
            }
        }
    }

    return (
        <div className="content flex gap-5 my-auto h-[85vh]">
            <div className="container max-w-lg m-auto">
                {showLogin ? (
                    <div>
                        <h3>Login</h3>
                        <form onSubmit={handleSubmit(handleSubmitLogin)} className="flex flex-col gap-1 text-left">

                            <span>Email:</span>
                            <input type="email" placeholder="Email"
                                {...register('email')}
                            />

                            <span>Password:</span>
                            <input type="password" placeholder="Password"
                                {...register('password')}
                            />

                            <p className="text-center text-sm mb-3">
                                Not registered yet?&nbsp;
                                <span 
                                    className="underline font-bold cursor-pointer hover:text-green-dark transition-colors" 
                                    onClick={toggleLoginRegister}
                                >
                                    Register now
                                </span>
                            </p>

                            {error && (
                                <div className="bg-red-light w-full p-3 mb-3">
                                    <p className="text-red-dark text-center">{error}</p>
                                </div>
                            )}

                            <button className="btnPrimary flex justify-center" onClick={handleSubmit(handleSubmitLogin)}>
                                Log in
                            </button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h3>Register</h3>
                        <form onSubmit={handleSubmit(handleSubmitLogin)} className="flex flex-col gap-1 text-left">

                            <span>User name:</span>
                            <input type="text" placeholder="Your name"
                                {...register('userName')}
                            />

                            <span>Email:</span>
                            <input type="email" placeholder="Email"
                                {...register('email')}
                            />

                            <span>Password:</span>
                            <input type="password" placeholder="Password"
                                {...register('password')}
                            />

                            <span>Confirm Password:</span>
                            <input type="password" placeholder="Confirm password"
                                {...register('confirmPassword')}
                            />

                            <p className="text-center text-sm mb-3">
                                Already have an account?&nbsp;
                                <span 
                                    className="underline font-bold cursor-pointer hover:text-green-dark transition-colors" 
                                    onClick={toggleLoginRegister}
                                >
                                    Login
                                </span>
                            </p>

                            {error && (
                                <div className="bg-red-light w-full p-3 mb-3">
                                    <p className="text-red-dark text-center">{error}</p>
                                </div>
                            )}
                            <button className="btnPrimary flex justify-center" onClick={handleSubmit(handleSubmitLogin)}>
                                Register
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}