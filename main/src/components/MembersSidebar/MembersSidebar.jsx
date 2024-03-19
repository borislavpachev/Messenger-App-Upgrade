import './MembersSidebar.css'
import PropTypes from 'prop-types'
import TeamMemberList from '../TeamMembersList/TeamMembersList'

export default function MembersSidebar({ teamId, isOpen }) {

    return (
        <>
            <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div>
                    <TeamMemberList teamId={teamId} />
                </div>
            </div>
        </>
    )
}

MembersSidebar.propTypes = {
    isOpen: PropTypes.bool,
}