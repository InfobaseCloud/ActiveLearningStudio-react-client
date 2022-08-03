/*eslint-disable*/
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ResourceCardDropdown from 'components/ResourceCard/ResourceCardDropdown';

import './style.scss';
import { useSelector } from 'react-redux';
import moment from 'moment';
const ActivityCard = (props) => {
  const { activity, projectId, playlistId, lti, sampleID, setModalShow, setCurrentActivity, playlist, shared, project_type } = props;
  const organization = useSelector((state) => state.organization);

  return (
    <>
      {project_type === 'Column Layout' ?
        <div class="card project-card">
          <a href=""></a>
          <div class="card-img">
            <img class="card-img-top" src={activity.thumb_url}></img>
          </div>
          <div class="card-body">
            <div class="card-title">{activity.metadata ? activity.metadata.title : activity.title}</div>
          </div>
          <div class="card-footer">
            {activity.author_tags && activity.author_tags.length > 0
              && activity.author_tags.map((v) => (
                <p className='card-footer-desc'>{v.name}</p>
              ))}
            <p className='card-footer-duration'>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.55 14.55L9 11V6H11V10.175L13.95 13.125L12.55 14.55ZM9 4V2H11V4H9ZM16 11V9H18V11H16ZM9 18V16H11V18H9ZM2 11V9H4V11H2ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#F8AF2C" />
              </svg>
              {activity.duration ? moment.utc(activity.duration * 1000).format("HH:mm:ss") : ""}
            </p>
          </div>
        </div>
        :
        <>
          <li className="preview-list-update">
            {sampleID ? (
              <a
                onClick={() => {
                  setCurrentActivity(activity.id);
                  setModalShow(true);
                }}
              >
                <div
                  className="sharedActivityImage"
                  style={{
                    backgroundImage: `url(${activity.thumb_url})`,
                    // !!activity.thumb_url && activity.thumb_url.includes('pexels.com') ? `url(${activity.thumb_url})` : `url(${global.config.resourceUrl}${activity.thumb_url})`,
                  }}
                />
                <div className="textSharedActivity">{activity.metadata ? activity.metadata.title : activity.title}</div>
              </a>
            ) : (
              <>
                <Link
                  to={
                    shared
                      ? `/project/${projectId}/playlist/${playlistId}/shared?view=activity`
                      : lti
                        ? `/playlist/${playlistId}/activity/${activity.id}/preview/lti?view=activity`
                        : `/org/${organization.currentOrganization?.domain}/project/${projectId}/playlist/${playlistId}/activity/${activity.id}/preview?view=activity`
                  }
                  onClick={() => localStorage.setItem('projectPreview', true)}
                >
                  <div className="playimage-update-mobile">
                    <div
                      className="playimg playimage-update"
                      style={{
                        backgroundImage: `url(${activity.thumb_url})`
                        // !!activity.thumb_url && activity.thumb_url.includes('pexels.com') ? `url(${activity.thumb_url})` : `url(${global.config.resourceUrl}${activity.thumb_url})`,
                      }}
                    />
                    {/* <div className="plydet plydet-update" id="plydet-update-id">
                        {activity.metadata ? activity.metadata.title : activity.title}
                      </div> */}
                  </div>
                </Link>
                {/* {!lti && (
                  <div className="activity-options-wrapper check">
                    <ResourceCardDropdown
                      playlist={playlist}
                      resource={activity}
                      teamPermission={teamPermission || {}}
                      previewPage="projectPreview"
                    />
                  </div>
                )} */}
              </>
            )}
          </li>
        </>
      }
    </>
  );
};

ActivityCard.propTypes = {
  activity: PropTypes.object.isRequired,
  projectId: PropTypes.number.isRequired,
  playlistId: PropTypes.number.isRequired,
  lti: PropTypes.bool,
  sampleID: PropTypes.number,
  setModalShow: PropTypes.func,
  setCurrentActivity: PropTypes.func,
  playlist: PropTypes.object.isRequired,
  teamPermission: PropTypes.object.isRequired,
};

ActivityCard.defaultProps = {
  lti: false,
  sampleID: null,
  setModalShow: () => { },
  setCurrentActivity: () => { },
};

export default ActivityCard;
