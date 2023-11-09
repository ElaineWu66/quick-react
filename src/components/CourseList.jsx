import React from 'react';
import { doCoursesConflict } from '../utilities/courseUtilities';

const CourseList = ({
  courses,
  selectedTerm,
  selectedCourses,
  toggleCourseSelection,
  user,
  isAdmin,
  setCurrentCourseKey,
  setEditMode,
}) => {
  const isCourseConflicting = (courseKey) => {
    const course = courses[courseKey];
    return selectedCourses.some((selectedKey) =>
      doCoursesConflict(course, courses[selectedKey])
    );
  };

  return (
    <div className="courses-grid">
      {Object.keys(courses)
        .filter((key) => courses[key].term === selectedTerm)
        .map((key) => {
          const isSelected = selectedCourses.includes(key);
          const isConflicting = !isSelected && isCourseConflicting(key);

          return (
            <div
              className={`card m-1 p-2 ${isSelected ? 'selected-course' : ''} ${
                isConflicting ? 'conflicting-course' : ''
              }`}
              key={key}
              onClick={() => toggleCourseSelection(key)}>
              <h5 className="card-title">
                {courses[key].term} CS {courses[key].number}
              </h5>
              <div className="card-text">{courses[key].title}</div>
              <div className="card-text">{courses[key].meets}</div>
              {user && isAdmin && (
                <button
                  className="edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCourseKey(key);
                    setEditMode(true);
                  }}>
                  Edit
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default CourseList;
