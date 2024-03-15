import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Video({ user }) {

    const ref = useRef();

    useEffect(() => {
        user.videoTrack.play(ref.current)
    }, [])

    return (
        <div>
            TEST
            Uid: {user.uid}
            <div ref={ref} style={{ width: '400px', height: '400px' }}></div>
        </div>
    )
}

Video.propTypes = {
    user: PropTypes.any,
}