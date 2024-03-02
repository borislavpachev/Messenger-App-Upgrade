import './MainBar.css'

export default function MainBar({ children }){

    return (
        <div className="col-2 h-100 main-bar-bg text-white">
            {children}
      </div>
    )
}