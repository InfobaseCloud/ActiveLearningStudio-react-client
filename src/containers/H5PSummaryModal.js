import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { loadH5pRecordAction } from 'store/actions/resource';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
/* eslint-disable  */
const H5PSummaryModal = (props) => {
  const { handleShow, handleClose, show, selectedPlaylistId, loadH5pRecord } = props;
  const [updateRecords, setUpdateRecords] = useState();
  const loadResources = async (records) => {
    records.then((record) => {
      setUpdateRecords(record.h5pRecords);
    })
  }
  useEffect(() => {
    const records = loadH5pRecord(selectedPlaylistId);
    loadResources(records)
  }, [loadH5pRecord]);
  return (
    <>
      <Link
        onClick={handleShow}
        to={"#"}
      >
        View Summary
      </Link>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Column Layout Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {updateRecords && updateRecords.map((data) => (
            <div className="d-flex justify-content-between">
              <h5>{data.activity_name}</h5>
              <h5>{data.statement?.result?.score?.raw} / {data.statement?.result?.score?.max}</h5>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

H5PSummaryModal.propTypes = {
  handleShow: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  show: PropTypes.any.isRequired,
  selectedPlaylistId: PropTypes.any.isRequired,
};
const mapDispatchToProps = (dispatch) => ({
  loadH5pRecord: (h5pRecordId) => dispatch(loadH5pRecordAction(h5pRecordId)),
});

const mapStateToProps = (state) => ({
  resource: state.resource,
  parentPlaylist: state.playlist.selectedPlaylist,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(H5PSummaryModal));