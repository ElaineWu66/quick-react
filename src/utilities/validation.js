export const validateTitle = (title) => {
    if (title.length < 2) {
      return "Title must be at least two characters.";
    }
    return null;
};

export const validateMeets = (meets) => {
    if (meets !== "" && !/^[MTWTFSS]+ \d{1,2}:\d{2}-\d{1,2}:\d{2}$/.test(meets)) {
      return "Meets must contain days and start-end, e.g., MWF 12:00-13:20";
    }
    return null;
};
