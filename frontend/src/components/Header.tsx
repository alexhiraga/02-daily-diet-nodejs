import { User } from "../Router"

interface Props {
    user: User
}

export default function Header({ user }: Props) {
    return (
        <div>
            <div className="flex justify-between">
                <div>
                    <h2>Dashboard</h2>
                    <p>Hello {user.userName}</p>
                </div>
            </div>

        </div>
    )
}