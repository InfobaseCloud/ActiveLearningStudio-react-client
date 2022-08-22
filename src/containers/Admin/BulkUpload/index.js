import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, Button } from 'react-bootstrap';
import {
  removeActiveAdminForm,
  uploadBulkUsers,
} from 'store/actions/admin';
import './style.scss';
import Swal from 'sweetalert2';

const BulkUpload = (props) => {
  const { mode, uploadMultipleUsers } = props;
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const handleCsvFile = (csvFile) => (csvFile && csvFile.type === 'text/csv' ? setFile(csvFile) : '');
  return (
    <div>
      <Modal className="uploadUserModal" show onHide={() => dispatch(removeActiveAdminForm())}>
        <Modal.Header className="create-user-modal-header" closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mode === 'bulk_upload' && (
            <div className="modal-user-upload">
              <input
                type="file"
                id="user-bulk-upload"
                name="user-bulk-upload"
                onChange={(e) => handleCsvFile(e.target.files[0])}
              />
              <Button
                onClick={() => {
                  Swal.fire({
                    text: 'Are you sure you want to upload',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#084892',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    allowOutsideClick: false,
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      const formData = new FormData();
                      formData.append('import_file', file);
                      await uploadMultipleUsers(formData);
                      dispatch(removeActiveAdminForm());
                    }
                  });
                }}
              >
                Upload
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

BulkUpload.propTypes = {
  mode: PropTypes.string.isRequired,
  uploadMultipleUsers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentOrg: state.organization.currentOrganization,
});

const mapDispatchToProps = (dispatch) => ({
  uploadMultipleUsers: (fileCsv) => dispatch(uploadBulkUsers(fileCsv)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BulkUpload));
