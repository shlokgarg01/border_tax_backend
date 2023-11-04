const get_current_time = () => {
  const current_date = new Date()
  const only_date = current_date.toISOString().slice(0,10)
  const timeInMss = current_date.getTime(); // Get the current timestamp
  const date = new Date(timeInMss); // Convert timestamp to a Date object

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const hours12 = hours % 12 || 12;

  const formattedTime = `${only_date} ${hours12}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${ampm}`;

  return formattedTime;
};

module.exports = {get_current_time}