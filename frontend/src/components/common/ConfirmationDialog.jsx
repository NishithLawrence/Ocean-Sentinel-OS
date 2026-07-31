import Button from './Button.jsx'
export default function ConfirmationDialog({ message = 'Are you sure?', onConfirm }) { return <div><p className="mb-4">{message}</p><Button variant="danger" onClick={onConfirm}>Confirm</Button></div> }
