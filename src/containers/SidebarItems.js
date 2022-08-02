import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux';
import H5PSummaryModal from './H5PSummaryModal';
/* eslint-disable  */
const SidebarItems = (props) => {

  const {
    playlist,
    count,
    allPlaylists,
    playlistId,
    showLti,
    viewType,
    shared,
    activeActivityId,
    projectId,
    setCurrentActivePlaylist,
    setH5pCurrentActivity,
    selectedPlaylist
  } = props;

  const currentPlaylistIndex = allPlaylists.findIndex((p) => p.id === playlistId);
  const nextPlaylist = currentPlaylistIndex < allPlaylists.length - 1 ? allPlaylists[currentPlaylistIndex + 1] : null;
  const organization = useSelector((state) => state.organization);
  const [isOpen, setOpen] = React.useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getNextLink = (playlistId, activity) => {
    let nextLink = '#';
    if (activity) {
      nextLink = `/playlist/${playlistId}/activity/${activity.id}/preview`;
    } else if (nextPlaylist) {
      nextLink = `/playlist/${nextPlaylist.id}/activity/${nextPlaylist.activities[0]?.id}/preview`;
    }
    if (nextLink !== '#') {
      if (showLti) {
        if (viewType === 'activity') {
          nextLink += '/lti?view=activity';
        } else {
          nextLink += '/lti';
        }
      } else {
        nextLink = `/org/${organization.currentOrganization?.domain}/project/${projectId}${nextLink}`;

        if (shared) {
          nextLink += '/shared';
        }
        if (viewType === 'activity') {
          nextLink += '?view=activity';
        }
      }
    } else {
      if (viewType === 'activity') {
        nextLink += '?view=activity';
      }
    }
    return nextLink;
  };
  return (
    <Card>
      <ContextAwareToggle
        eventKey={count + 1}
        classNames={`${isOpen ? 'active' : ''}`}
      // onClick={() => setCurrentActivePlaylist(2)}
      >
        <span
          onClick={() => {
            setOpen(!isOpen);
            setCurrentActivePlaylist(count + 1)
          }}
        >
          {playlist.title}
        </span>
      </ContextAwareToggle>
      <Accordion.Collapse eventKey={count + 1}>
        <Card.Body>
          {playlist.activities.map((activity, activityCount) => (
            <>
              <div className={`sidebar-links ${activeActivityId === activity.id ? 'active' : ''}`}>
                <Link
                  onClick={() => {
                    if (setH5pCurrentActivity) {
                      setH5pCurrentActivity(activity);
                    }
                  }}
                  to={setH5pCurrentActivity ? void 0 : getNextLink(playlist.id, activity)}
                >
                  {activity.title}
                </Link>
              </div>
              <div className="summary-modal-link-wrapper sidebar-links">
                {(activityCount == playlist.activities.length - 1 && selectedPlaylist.is_column_summary) && (
                  <H5PSummaryModal
                    handleShow={handleShow}
                    handleClose={handleClose}
                    show={show}
                    selectedPlaylistId={playlistId}
                  />
                )}
              </div>
            </>
          ))}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

function ContextAwareToggle({ children, eventKey, callback }) {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <div
      className={`accordion-header-wrapper d-flex justify-content-between align-items-center ${isCurrentEventKey ? 'active' : ''}`}
      onClick={decoratedOnClick}
    >
      {children}
    </div>
  );
}

ContextAwareToggle.propTypes = {
  children: PropTypes.any.isRequired,
  eventKey: PropTypes.any.isRequired,
  callback: PropTypes.func.isRequired,
};

SidebarItems.propTypes = {
  playlist: PropTypes.any.isRequired,
  count: PropTypes.any.isRequired,
  allPlaylists: PropTypes.any.isRequired,
  playlistId: PropTypes.any.isRequired,
  showLti: PropTypes.bool.isRequired,
  shared: PropTypes.bool.isRequired,
  viewType: PropTypes.any.isRequired,
  activeActivityId: PropTypes.any.isRequired,
  projectId: PropTypes.number.isRequired,
  setCurrentActivePlaylist: PropTypes.func.isRequired,
  setH5pCurrentActivity: PropTypes.func.isRequired,
  selectedPlaylist: PropTypes.any.isRequired,
};

export default SidebarItems;
