import logo from '../assets/daily-diet-logo.png'
import user from '../assets/user.png'

export default function Navbar() {
    return (
        <div className="bg-white w-screen py-4 box-shadow">
            <div className="flex justify-between max-w-5xl mx-auto">
                <img src={logo} alt="logo" />
                <img src={user} alt="user" className="w-7 object-contain" />
            </div>
        </div>
    )
}