import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { useJsonQuery } from './utilities/fetch';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { doCoursesConflict } from './utilities/courseUtilities';
import { validateTitle, validateMeets } from './utilities/validation';
import React from 'react';
import useFirebaseQuery from './hooks/useFirebaseQuery';
import { set, ref } from 'firebase/database';
import { db } from './utilities/firebase';

import { useAuthState } from './hooks/useAuth';
import { signInWithGoogle, firebaseSignOut } from './utilities/firebase';

import Banner from './components/Banner';
import CourseList from './components/CourseList';

// const schedule = {
//   "title": "CS Courses for 2018-2019",
//   "courses": {
//     "F101" : {
//       "term": "Fall",
//       "number": "101",
//       "meets" : "MWF 11:00-11:50",
//       "title" : "Computer Science: Concepts, Philosophy, and Connections"
//     },
//     "F110" : {
//       "term": "Fall",
//       "number": "110",
//       "meets" : "MWF 10:00-10:50",
//       "title" : "Intro Programming for non-majors"
//     },
//     "S313" : {
//       "term": "Spring",
//       "number": "313",
//       "meets" : "TuTh 15:30-16:50",
//       "title" : "Tangible Interaction Design and Learning"
//     },
//     "S314" : {
//       "term": "Spring",
//       "number": "314",
//       "meets" : "TuTh 9:30-10:50",
//       "title" : "Tech & Human Interaction"
//     }
//   }
// };

const TermSelector = ({ selectedTerm, setSelectedTerm }) => {
  const terms = ['Fall', 'Winter', 'Spring'];

  return (
    <div className="term-selector">
      {terms.map((term) => (
        <button
          key={term}
          onClick={() => setSelectedTerm(term)}
          className={selectedTerm === term ? 'active' : ''}>
          {term}
        </button>
      ))}
    </div>
  );
};

const Modal = ({ selectedCourses, courses, onClose }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      {selectedCourses.length === 0 ? (
        <p>No courses selected. Click on a course to select it.</p>
      ) : (
        selectedCourses.map((key) => (
          <div key={key}>
            CS {courses[key].number}: {courses[key].title} -{' '}
            {courses[key].meets}
          </div>
        ))
      )}
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const App = () => {
  // const [data, isLoading, error] = useJsonQuery(
  //   "https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php"
  // );

  const [data, isLoading, error] = useFirebaseQuery('/');

  const [selectedTerm, setSelectedTerm] = useState('Fall');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [currentCourseKey, setCurrentCourseKey] = useState(null);

  const [user, isAdmin] = useAuthState();

  const isCourseConflicting = (courseKey) => {
    const course = schedule.courses[courseKey];
    return selectedCourses.some((selectedKey) =>
      doCoursesConflict(course, schedule.courses[selectedKey])
    );
  };

  const toggleCourseSelection = (key) => {
    if (selectedCourses.includes(key)) {
      setSelectedCourses(
        selectedCourses.filter((courseKey) => courseKey !== key)
      );
    } else if (!isCourseConflicting(key)) {
      setSelectedCourses([...selectedCourses, key]);
    }
  };

  const updateCourseInFirebase = (courseKey, courseData) => {
    const courseRef = ref(db, `/courses/${courseKey}`);
    set(courseRef, courseData);
  };

  const CourseEditForm = ({ course, onCancel }) => {
    const [title, setTitle] = useState(course.title);
    const [meets, setMeets] = useState(course.meets);

    const [errors, setErrors] = useState({});

    const onSubmit = (e) => {
      e.preventDefault();
      setErrors({});

      const titleError = validateTitle(title);
      const meetsError = validateMeets(meets);

      if (titleError || meetsError) {
        setErrors({
          title: titleError,
          meets: meetsError,
        });
        return;
      }
      if (title !== course.title || meets !== course.meets) {
        updateCourseInFirebase(currentCourseKey, { ...course, title, meets });
        setEditMode(false);
        setCurrentCourseKey(null);
      }
    };

    return (
      <form onSubmit={onSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <div className="error">{errors.title}</div>}
        </div>
        <div>
          <label>Meets:</label>
          <input
            type="text"
            value={meets}
            onChange={(e) => setMeets(e.target.value)}
          />
          {errors.meets && <div className="error">{errors.meets}</div>}
        </div>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Submit</button>
      </form>
    );
  };

  if (error) return <h1>Error loading Schedule data: {`${error}`}</h1>;
  if (isLoading) return <h1>Loading Schedule data...</h1>;
  if (!data) return <h1>No Schedule data found</h1>;

  // console.log(data)
  const schedule = data;

  return (
    <>
      <Banner title={schedule.title} />
      {editMode ? (
        <CourseEditForm
          course={schedule.courses[currentCourseKey]}
          onCancel={() => {
            setEditMode(false);
            setCurrentCourseKey(null);
          }}
        />
      ) : (
        <div>
          <div className="header">
            <div className="centered-term-selector">
              <TermSelector
                selectedTerm={selectedTerm}
                setSelectedTerm={setSelectedTerm}
              />
            </div>
            {user ? (
              <button className="float-right" onClick={firebaseSignOut}>
                Sign Out
              </button>
            ) : (
              <button className="float-right" onClick={signInWithGoogle}>
                Sign In with Google
              </button>
            )}

            <button className="float-right" onClick={() => setShowModal(true)}>
              Course Plan
            </button>
          </div>

          {showModal && (
            <Modal
              selectedCourses={selectedCourses}
              courses={schedule.courses}
              onClose={() => setShowModal(false)}
            />
          )}

          <CourseList
            courses={schedule.courses}
            selectedTerm={selectedTerm}
            selectedCourses={selectedCourses}
            toggleCourseSelection={toggleCourseSelection}
            user={user}
            isAdmin={isAdmin}
            setCurrentCourseKey={setCurrentCourseKey}
            setEditMode={setEditMode}
          />
        </div>
      )}
    </>
  );
};

const queryClient = new QueryClient();
function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

export default AppWrapper;
