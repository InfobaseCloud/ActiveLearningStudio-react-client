/* eslint-disable  */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Accordion from 'react-bootstrap/Accordion';
import { useSelector } from 'react-redux';
import SidebarItems from './SidebarItems';

const H5PIVSidebar = (props) => {
  const [isOpen, setOpen] = React.useState(false);
  const {
    allPlaylists,
    activeActivityId,
    setCurrentActiveId,
    showLti,
    shared,
    projectId,
    playlistId,
    nextResource,
    viewType,
    setH5pCurrentActivity,
    selectedPlaylist
  } = props;
  console.log({ act: activeActivityId });
  // const organization = useSelector((state) => state.organization);
  const [currentActivePlaylist, setCurrentActivePlaylist] = useState();
  useEffect(() => {
    const currentPlaylistIndex = parseInt(allPlaylists.findIndex((p) => p.id === playlistId)) + 1;
    setCurrentActivePlaylist(currentPlaylistIndex)
  }, [])
  // const currentPlaylistIndex = parseInt(allPlaylists.findIndex((p) => p.id === playlistId)) + 1;

  return (
    <div className="sidebar-wrapper">
      <div className="project-heading-wrapper">
        <h3>
          <div className="sidebar-project-name d-flex justify-content-between">
            {allPlaylists[0]?.project?.name}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825L9.425 14.6L8 16Z" fill="#515151" />
            </svg>
          </div>
        </h3>
      </div>

      <Accordion className="sidebar-accordion" activeKey={currentActivePlaylist}>
        {allPlaylists.map((playlist, count) => (
          <SidebarItems
            playlist={playlist}
            count={count}
            allPlaylists={allPlaylists}
            playlistId={playlistId}
            showLti={showLti}
            viewType={viewType}
            shared={shared}
            activeActivityId={activeActivityId}
            projectId={projectId}
            setH5pCurrentActivity={setH5pCurrentActivity}
            setCurrentActivePlaylist={setCurrentActivePlaylist}
            selectedPlaylist={selectedPlaylist}
          />
        ))}
      </Accordion>
    </div >
  );
};

H5PIVSidebar.propTypes = {
  activeActivityId: PropTypes.any.isRequired,
  selectedPlaylist: PropTypes.any.isRequired,
  setCurrentActiveId: PropTypes.func.isRequired,
  showLti: PropTypes.bool,
  shared: PropTypes.bool,
  projectId: PropTypes.number,
  playlistId: PropTypes.number.isRequired,
  nextResource: PropTypes.object,
  allPlaylists: PropTypes.array,
};

H5PIVSidebar.defaultProps = {
  showLti: false,
  shared: false,
  projectId: null,
  nextResource: null,
  allPlaylists: [],
};

export default H5PIVSidebar;