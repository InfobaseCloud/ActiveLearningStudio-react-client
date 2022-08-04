/* eslint-disable */
import React, { useState, useEffect } from "react";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const MultiSelectCheckbox = ({ projectType, selectedProject, handleProjectlayout }) => {
  const [selectedProjectLayout, setSelectedProjectLayout] = useState([]);

  useEffect(() => {
    setSelectedProjectLayout([{
      value: selectedProject.project_type,
      label: selectedProject.project_type,
    }]);
  }, [selectedProject]);

  function getDropdownButtonLabel({ placeholderButtonLabel, value }) {
    return `${selectedProject.project_type}`;
  }

  function onChange(value, event) {
    if (event.action === "deselect-option") {
      handleProjectlayout(null);
    } else {
      handleProjectlayout(event);
    }
  }

  return (
    <ReactMultiSelectCheckboxes
      options={[...projectType]}
      placeholderButtonLabel="Layout Type"
      getDropdownButtonLabel={getDropdownButtonLabel}
      value={selectedProjectLayout}
      onChange={onChange}
      setState={setSelectedProjectLayout}
    />
  );
};

export default MultiSelectCheckbox;
