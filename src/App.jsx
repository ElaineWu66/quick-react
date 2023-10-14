import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { useJsonQuery } from "./utilities/fetch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  const terms = ["Fall", "Winter", "Spring"];

  return (
    <div className="term-selector">
      {terms.map(term => (
        <button 
          key={term} 
          onClick={() => setSelectedTerm(term)}
          className={selectedTerm === term ? "active" : ""}
        >
          {term}
        </button>
      ))}
    </div>
  );
};



const App = () => {
  const [data, isLoading, error] = useJsonQuery(
    "https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php"
  );
  
  const [selectedTerm, setSelectedTerm] = useState("Fall");


  if (error) return <h1>Error loading Schedule data: {`${error}`}</h1>;
  if (isLoading) return <h1>Loading Schedule data...</h1>;
  if (!data) return <h1>No Schedule data found</h1>;
  
  // console.log(data)
  const schedule = data;
  return(
    <>
      <h1>{schedule.title}</h1>
      <TermSelector selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />

      <div className = "courses-grid">

      {Object.keys(schedule.courses)
      .filter(key => schedule.courses[key].term === selectedTerm)
      .map(key => (
        <>
        <div className="card m-1 p-2" key={key}>
        <h5 className="card-title" >{schedule.courses[key].term} CS {schedule.courses[key].number}</h5>
        <div className="card-text">{schedule.courses[key].title} </div>
        <div className="card-text">{schedule.courses[key].meets}</div> 
        </div>
        </>
        
      ))}
      </div>
    </>
  ) 
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
