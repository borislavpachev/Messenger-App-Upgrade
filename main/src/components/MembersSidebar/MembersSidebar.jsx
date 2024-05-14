import PropTypes from 'prop-types';
import TeamMemberList from '../TeamMembersList/TeamMembersList';

export default function MembersSidebar({ teamId }) {
  return <TeamMemberList teamId={teamId} />;
}

MembersSidebar.propTypes = {
  teamId: PropTypes.string,
};
