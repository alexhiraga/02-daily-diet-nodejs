import { SignIn, SignOut } from 'phosphor-react'
import { User } from '../Router'
import logo from '../assets/daily-diet-logo.png'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/axios'

interface Props {
    user: User
    setInfo: (user?: User) => void
}
export default function Navbar({ user, setInfo }: Props) {
    const navigate = useNavigate()

    const handleLogout = async () => {
        // add logout req
        try {
            await api.post('/logout')
            setInfo()
            navigate("/02-daily-diet-nodejs/login")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="bg-white py-4 box-shadow">
            <div className="flex justify-between max-w-5xl mx-auto">
                <img src={logo} alt="logo" />
                {user ? (
                    <div className="flex gap-3 align-middle">
                        <p className="my-auto">{user.userName}</p>
                        {user.email && (
                            <div title="Log out" className="my-auto" onClick={handleLogout}>
                                <SignOut 
                                    size={20} 
                                    weight="bold"
                                    className="text-neutral-800 hover:text-red-dark transition-colors cursor-pointer" 
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex gap-3 align-middle" onClick={() => navigate("/02-daily-diet-nodejs/login")}>
                        <p className="my-auto">Sign In</p>
                        <SignIn 
                            size={20} 
                            weight="bold"
                            className="text-neutral-800 hover:text-green-dark transition-colors cursor-pointer"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
