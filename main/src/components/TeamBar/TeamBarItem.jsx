import './TeamBarItem.css'

export default function TeamBarItem({ children, onClick }) {

    return (
        <div className='element-container' onClick={onClick}>
            {children}
        </div>
    )
}