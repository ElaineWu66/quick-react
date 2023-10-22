// courseUtilities.js

const doDaysOverlap = (meet1, meet2) => {
    const days1 = meet1.split(' ')[0];
    const days2 = meet2.split(' ')[0];
    return [...days1].some(day => days2.includes(day));
  };
  
const doTimesOverlap = (meet1, meet2) => {
    const [, time1] = meet1.split(' ');
    const [, time2] = meet2.split(' ');
    const [start1, end1] = time1.split('-').map(t => parseInt(t.replace(':', ''), 10));
    const [start2, end2] = time2.split('-').map(t => parseInt(t.replace(':', ''), 10));
    return (start1 < end2 && start2 < end1);
};
  
export const doCoursesConflict = (course1, course2) => {
    if (!course1.meets || !course2.meets) return false;
    return course1.term === course2.term && doDaysOverlap(course1.meets, course2.meets) && doTimesOverlap(course1.meets, course2.meets);
};
  