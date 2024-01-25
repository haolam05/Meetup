export const formattedDate = date => {
  date = new Date(date);
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
};

export const formattedTime = date => {
  date = new Date(date);
  return `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`;
};

export function dateToFormat(date) {
  if (!date) return false;

  date = new Date(date);
  let identifier = 'AM';
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();

  if (+hours > 12) {
    hours = `${hours - 12}`.padStart(2, '0');
    identifier = 'PM';
  }

  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  const formattedDate = `${month}/${day}/${year} ${hours}:${minutes} ${identifier}`;

  return formattedDate
}

export const isValidDateFormat = (dateInput, errorName, setErrors) => {
  const datetimeFormat = document.querySelector(`input[type="datetime-local"]#${errorName}`);

  if (datetimeFormat) {
    return new Date(dateInput);
  }

  const [date, time, identifier] = dateInput.split(' ');

  if (!date || !date.length) {
    setErrors({ [errorName]: "Date is required" });
    return false;
  }

  if (!time || !time.length) {
    setErrors({ [errorName]: "Time is required" });
    return false;
  }
  if (identifier !== "AM" && identifier !== "PM") {
    setErrors({ [errorName]: "Time identifier must be AM or PM" });
    return false;
  }

  const dateValue = new Date(`${date} ${time} ${identifier}`);

  if (dateValue.toString() === 'Invalid Date') {
    setErrors({ [errorName]: `Invalid Date. Please enter in this format: "MM/DD/YYYY HH:mm ${errorName === 'endDate' ? 'PM' : 'AM'}"` });
    return false;
  }

  return dateValue;
}
