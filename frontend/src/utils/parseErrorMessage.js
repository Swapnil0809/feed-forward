export const parseErrorMessage = (response) => {
  if (response && response.data) {
    // If the response contains HTML (i.e., contains <html> or <body>)
    if (response.data.includes("<html>") || response.data.includes("<body>")) {
      // Use regex to extract text before the first <br> tag
      const match = response.data.match(/Error: (.*?)<br>/);

      if (match && match[1]) {
        return match[1].trim(); // Return the message before <br> and remove any leading/trailing spaces
      }
    }
    // Handle JSON response with `message` key
    else if (response.data.message) {
      return response.data.message;
    }
  }

  // Fallback message if no valid message is found
  return "Something went wrong";
};
