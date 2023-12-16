import { User } from "../Router"

interface Props {
    user: User
    error: string
}

export default function Header({ user, error }: Props) {
    return (
        <div>
            <div className="flex justify-between">
                <div>
                    <h2>Dashboard</h2>
                    <p>Hello {user.userName}</p>
                </div>
                <div className="py-4 px-6 align-middle text-center bg-red-light color-red-dark rounded">
                    {/* {error} */}
                    <span className="m-auto">
                        Error
                    </span>
                </div>
            </div>

        </div>
    )
}