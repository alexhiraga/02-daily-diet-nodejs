import { Alert } from "../pages/Home"

interface Props {
    alert: Alert
}
export default function AlertBadge({ alert }: Props) {
    return (
        <>
            {alert.type && (
                <div 
                    className="fixed bottom-8 left-8 px-5 py-2 rounded"
                    style={ 
                        alert.type === 'success' ? {
                            background: 'var(--green-light)',
                            color: 'var(--green-dark)'
                        } : {
                            background: 'var(--red-light)',
                            color: 'var(--red-dark)'
                        }
                    }
                > 
                    {alert.message}
                </div>
            )}
        </>
    )
}