import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { renameChannel, deleteChannel, addMemberToChannel } from '../../services/channel.service';
import './ChannelHeader.css'
import { RxPerson } from "react-icons/rx";

export default function ChannelHeader({ onChannelSelect, toggleSidebar }) {
  const { channelId } = useParams()
  const [channel, setChannel] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newMember, setNewMember] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
 

  useEffect(() => {
    const channelRef = ref(db, 'channels/' + channelId);
    const unsubscribe = onValue(channelRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setChannel({ id: snapshot.key, ...data });
      }
    });

    return () => unsubscribe();
  }, [channelId]);
  

  const handleRenameChannel = async () => {
    try {
      await renameChannel(channelId, newTitle);
      setNewTitle('');
      setIsRenaming(false);
    } catch (error) {
      console.error('Failed to rename channel:', error);
    }
  };

  const handleDeleteChannel = async () => {
    try {
      await deleteChannel(channelId);
    } catch (error) {
      console.error('Failed to delete channel:', error);
    }
  };

  const handleAddMemberToChannel = async () => {
    try {
      await addMemberToChannel(channelId, newMember);
      setNewMember('');
    } catch (error) {
      console.error('Failed to add member to channel:', error);
    }
  };

  const handleSidebarClick = () => {
    console.log('Sidebar icon clicked');
    toggleSidebar();
  };

  return (
    <div className='channel-headers'>
    <h4 className='chan-header-h1' onClick={() => setIsRenaming(true)}>
      {isRenaming ? (
        <>
          <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New channel title" />
          <button onClick={handleRenameChannel}>Submit New Title</button>
        </>
      ) : (
        channel?.title
      )}
    </h4>
      <button onClick={() => setIsRenaming(true)}>Rename Channel</button>
      <button onClick={handleDeleteChannel}>Delete Channel</button>
      <input type="text" value={newMember} onChange={e => setNewMember(e.target.value)} placeholder="New member's username" />
      <button onClick={handleAddMemberToChannel}>Add Member to Channel</button>
      <RxPerson className='sidebar-svg' onClick={handleSidebarClick}/>
    </div>
  );
}