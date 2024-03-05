import 'bootstrap/dist/css/bootstrap.min.css';
import './ContentBox.css'
import ChannelChat from '../ChannelChat/ChannelChat';

export default function ContentBox({ chat }){

    return(
        <div className="content-box-bg text-white flex-grow-1">
        {chat && chat.type === 'channel' ? <ChannelChat channelId={chat.id} /> : null}
      </div>
    )
}