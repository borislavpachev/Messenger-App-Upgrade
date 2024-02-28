import 'bootstrap/dist/css/bootstrap.min.css';
import './ChannelBar.css'
export default function ChannelBar(){

    return (
        <div className="col-2 h-100 channel-bar-bg text-white">
            <div className="d-stack gap-3">
                <div>Channel 1</div>
                <div>Chanel 2</div>
            </div>
        </div>
    )
}