/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Dropdown } from 'react-bootstrap';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { simpleSearchAction } from 'store/actions/search';
import { loadResourceTypesAction } from 'store/actions/resource';
import {
  educationLevels,
  subjects,
} from 'components/ResourceCard/AddResource/dropdownData';
import { searchUserInOrganization } from 'store/actions/organization';

function SearchForm() {
  const history = useHistory();
  const dispatcher = useDispatch();

  const [simpleSearch, setSimpleSearch] = useState();
  const [activityTypes, setActivityTypes] = useState([]);
  const [value, setValue] = useState(0);
  const activityTypesState = useSelector((state) => state.resource.types);
  const searchState = useSelector((state) => state.search);
  const {
    currentOrganization,
    searchUsers,
    permission,
    activeOrganization,
  } = useSelector((state) => state.organization);

  useEffect(() => {
    if (activityTypesState?.length === 0) {
      dispatcher(loadResourceTypesAction());
    }
  }, []);

  const compare = (a, b) => {
    // Use toUpperCase() to ignore character casing
    const bandA = a.title.toUpperCase();
    const bandB = b.title.toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  };

  useEffect(() => {
    const allItems = [];
    activityTypesState?.map((data) => data.activityItems.map((itm) => allItems.push(itm)));
    setActivityTypes(allItems.sort(compare));
    if (searchState?.searchQuery !== simpleSearch) {
      setSimpleSearch('');
    }
  }, [activityTypesState, searchState.searchQuery]);

  const closeModel = useRef();
  return (
    <Dropdown>
      <div className="search-block navbtn">
        <input
          className="search-term"
          placeholder="Search existing content"
          value={simpleSearch}
          onChange={(e) => {
            setSimpleSearch(e.target.value);
          }}
          ref={closeModel}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              if (!simpleSearch.trim()) {
                Swal.fire('Search field is required');
              } else if (simpleSearch.length > 255) {
                Swal.fire('Character limit should be less than 255 ');
              } else {
                const searchData = {
                  phrase: simpleSearch.trim(),
                  from: 0,
                  size: 20,
                  type: 'public',
                };
                dispatcher(simpleSearchAction(searchData));
                localStorage.setItem('loading', 'true');
                history.push(`/org/${currentOrganization?.domain}/search?q=${simpleSearch.trim()}&type=public`);
                localStorage.setItem('refreshPage', false);
              }
            }
            return true;
          }}
        />

        <Dropdown.Toggle variant="" id="dropdown-basic">
          <FontAwesomeIcon icon="chevron-down" />
        </Dropdown.Toggle>
      </div>

      <Dropdown.Menu>
        <div className="overlay-search-form">
          <h4>Advanced Search</h4>
          <Formik
            initialValues={{
              phrase: '',
              subjectArray: [],
              subject: '',
              author: '',
              selectedAuthor: [],
              authors: [],
              grade: '',
              gradeArray: [],
              standard: '',
              standardArray: [],
              email: '',
              words: '',
              no_words: undefined,
              type: 'public',
              toDate: undefined,
              fromDate: undefined,
              from: 0,
              size: 20,
              model: undefined,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.phrase && values.type !== 'orgSearch') {
                errors.phrase = 'required';
              }
              if (values.fromDate && values.toDate) {
                if (values.fromDate > values.toDate) errors.dateError = 'Invalid Date Format';
              }
              return errors;
            }}
            onSubmit={(values) => {
              closeModel.current.click();
              const h5pNameArray = [];
              values.standardArray.filter((h5p) => h5pNameArray.push(h5p.value));
              values.standardArray = h5pNameArray;
              // eslint-disable-next-line max-len
              history.push(`/org/${currentOrganization?.domain}/search?q=${values.phrase}&type=${values.type}&grade=${values.subjectArray}&education=${values.gradeArray}&h5p=${h5pNameArray}`);
              localStorage.setItem('refreshPage', false);
              // const allSubjects = values.subjectArray;
              // values.subjectArray = allSubjects.forEach((subject) => {
              //   if (subject.includes('and')) {
              //     subject = subject.replace('and', '&');
              //   }
              // });
              // const allGrades = values.gradeArray;
              // values.gradeArray = allGrades.forEach((grade) => {
              //   if (grade.includes('and')) {
              //     grade = grade.replace('and', '&');
              //   }
              // });
              console.log(values.gradeArray, values.subjectArray, values);
              Swal.showLoading();
              dispatcher(simpleSearchAction(values));
              // resetForm({
              //   phrase: values.phrase,
              //   subjectArray: values.subjectArray,
              //   subject: values.subject,
              //   grade: values.grade,
              //   gradeArray: values.gradeArray,
              //   standard: values.standard,
              //   standardArray: values.standardArray,
              //   email: values.email,
              //   words: values.words,
              //   no_words: values.no_words,
              //   type: values.type,
              //   toDate: values.toDate,
              //   fromDate: values.fromDate,
              //   from: values.from,
              //   size: values.size,
              //   model: values.model,
              // });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <div className="radio-btns">
                    <label>
                      <input
                        name="type"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value="private"
                        checked={values.type === 'private'}
                        type="radio"
                      />
                      <span>Search My Projects</span>
                    </label>
                    <label>
                      <input
                        name="type"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value="public"
                        checked={values.type === 'public'}
                        type="radio"
                      />
                      <span>Search Project Showcase</span>
                    </label>
                    <label>
                      <input
                        name="type"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value="orgSearch"
                        checked={values.type === 'orgSearch'}
                        type="radio"
                      />
                      <span>Search All Projects in Organization</span>
                    </label>
                  </div>
                </div>

                <div className="form-group" style={{ display: values.type === 'orgSearch' ? 'none' : 'block' }}>
                  <input
                    name="phrase"
                    placeholder="Enter search phrase"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phrase}
                  />
                  <div className="error">
                    {errors.phrase && touched.phrase && errors.phrase}
                  </div>
                </div>
                <div className="form-group" style={{ display: permission?.Organization?.includes('organization:view-user') && values.type !== 'private' ? 'block' : 'none' }}>
                  <input
                    value={values.author}
                    placeholder="Enter Author name"
                    onChange={({ target }) => {
                      setFieldValue('author', target.value);
                      dispatcher(searchUserInOrganization(activeOrganization?.id, target.value));
                    }}
                    className="author"
                    onBlur={handleBlur}
                    name="author"
                  />
                </div>
                {values.author !== '' && (
                  <div className="author-main-box">
                    {searchUsers?.data?.length > 0 && searchUsers?.data.map((u) => (
                      <div className="author-box" data-list="true" key={u.id}>
                        <div
                          onClick={() => {
                            setFieldValue('author', '');
                            values.selectedAuthor.push(u);
                            values.authors.push(u.id);
                          }}
                        >
                          <div className="invite-member-name-mark">
                            <span>{`${u.first_name[0] || ''}${u.last_name[0] || ''}` }</span>
                          </div>

                          <div className="invite-member-info">
                            <h2 className="invite-member-name">{`${`${u.first_name } ${u.last_name}`} (${u.email})`}</h2>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {values.selectedAuthor.length > 0 && (
                  <div className="form-group wrap-keyword" data-name={value}>
                    {values.selectedAuthor.map((data) => (
                      <div className="keywords-de" key={data.id}>
                        {data?.first_name}
                        <div
                          className="iocns"
                          onClick={() => {
                            // eslint-disable-next-line no-param-reassign
                            values.selectedAuthor = values.selectedAuthor.filter((index) => index !== data);
                            values.authors = values.authors.filter((index) => index !== data.id);
                            setValue(value + 1);
                          }}
                        >
                          <FontAwesomeIcon icon="times" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="form-group">
                  <select
                    name="subject"
                    placeholder="Subject + Subject Area"
                    onChange={(e) => {
                      handleChange(e);
                      let updatedValue = e.target.value;
                      if (updatedValue.includes('&')) {
                        updatedValue = e.target.value.replace('&', 'and');
                        if (!values.subjectArray.includes(updatedValue)) {
                          values.subjectArray.push(updatedValue);
                        }
                      } else if (!values.subjectArray.includes(e.target.value)) {
                        values.subjectArray.push(e.target.value);
                      }
                    }}
                    onBlur={handleBlur}
                    value={values.subject}
                  >
                    <option value="" disabled selected hidden>
                      {' '}
                      Subject + Subject Area
                    </option>
                    {subjects.map((data) => (
                      <option key={data.value} value={data.subject}>
                        {data.subject}
                      </option>
                    ))}
                  </select>
                </div>

                {values.subjectArray.length > 0 && (
                  <div className="form-group wrap-keyword" data-name={value}>
                    {values.subjectArray.map((data) => (
                      <div className="keywords-de">
                        {data}
                        <div
                          className="iocns"
                          onClick={() => {
                            // eslint-disable-next-line no-param-reassign
                            values.subjectArray = values.subjectArray.filter((index) => index !== data);
                            setValue(value + 1);
                          }}
                        >
                          <FontAwesomeIcon icon="times" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-group">
                  <select
                    name="grade"
                    placeholder="Grade Level"
                    onChange={(e) => {
                      handleChange(e);
                      let updatedValue = e.target.value;
                      if (updatedValue.includes('&')) {
                        updatedValue = e.target.value.replace('&', 'and');
                        if (!values.gradeArray.includes(updatedValue)) {
                          values.gradeArray.push(updatedValue);
                        }
                      } else if (!values.gradeArray.includes(e.target.value)) {
                        values.gradeArray.push(e.target.value);
                      }
                    }}
                    value={values.grade}
                  >
                    <option value="" disabled selected hidden>Education Level</option>
                    {educationLevels.map((data) => (
                      <option key={data.value} value={data.name}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>

                {values.gradeArray.length > 0 && (
                  <div className="form-group wrap-keyword">
                    {values.gradeArray.map((data) => (
                      <div className="keywords-de" data-name={value}>
                        {data}
                        <div
                          className="iocns"
                          onClick={() => {
                            // eslint-disable-next-line no-param-reassign
                            values.gradeArray = values.gradeArray.filter((index) => index !== data);
                            setValue(value + 1);
                          }}
                        >
                          <FontAwesomeIcon icon="times" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-group">
                  <select
                    name="standard"
                    placeholder="Standard"
                    onChange={(e) => {
                      handleChange(e);
                      const nameSelected = activityTypes.filter((data) => {
                        if (data.h5pLib === e.target.value) {
                          return data;
                        }
                        return false;
                      });
                      let found = true;
                      values.standardArray.map((data) => {
                        if (data.value === e.target.value) {
                          found = false;
                        }
                        return true;
                      });
                      if (found) {
                        values.standardArray.push({ value: e.target.value, name: nameSelected[0].title });
                      }
                    }}
                    onBlur={handleBlur}
                    value={values.standard}
                  >
                    <option value="" disabled selected hidden>Type of Activity</option>
                    {activityTypes.map((data) => (
                      <option key={data.id} value={data.h5pLib}>
                        {data.title}
                      </option>
                    ))}
                  </select>
                </div>

                {values.standardArray.length > 0 && (
                  <div className="form-group wrap-keyword" data-name={value}>
                    {values.standardArray.map((data) => (
                      <div className="keywords-de">
                        {data.name}
                        <div
                          className="iocns"
                          onClick={() => {
                            // eslint-disable-next-line no-param-reassign
                            values.standardArray = values.standardArray.filter((index) => index !== data);
                            setValue(value + 1);
                          }}
                        >
                          <FontAwesomeIcon icon="times" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-group dual">
                  <input
                    name="fromDate"
                    placeholder="From Date"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.fromDate}
                    onFocus={(e) => {
                      e.target.type = 'date';
                    }}
                  />
                  <input
                    name="toDate"
                    placeholder="To Date"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.toDate}
                    onFocus={(e) => {
                      e.target.type = 'date';
                    }}
                  />
                  <div className="error">
                    {errors.dateError}
                  </div>
                </div>
                {/* <div className="form-group">
                  <input
                    name="email"
                    placeholder="From User:Enter Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </div> */}
                {/* <div className="form-group">
                  <input
                    name="words"
                    placeholder="Has the words"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.words}
                  />
                </div> */}
                <div className="form-group">
                  <input
                    name="no_words"
                    placeholder="Do not have the words"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.no_words}
                  />
                </div>
                <div className="dual_activity">
                  <button type="submit">Search</button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SearchForm;
