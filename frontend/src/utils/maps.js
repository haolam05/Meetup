export const getAverageLocation = locations => {
  const averageLocation = locations.reduce((acc, location) => {
    acc.lat += parseFloat(location.lat);
    acc.lng += parseFloat(location.lng);
    return acc;
  }, { lat: 0, lng: 0 });

  if (locations.length > 0) averageLocation.lat = averageLocation.lat / locations.length;
  if (locations.length > 0) averageLocation.lng = averageLocation.lng / locations.length;

  return averageLocation;
}

export const getCurrentUserPosition = () => {
  const currentLocation = {};
  navigator.geolocation.getCurrentPosition(pos => {
    currentLocation["lat"] = pos.coords.latitude;
    currentLocation["lng"] = pos.coords.longitude;
  });
  return currentLocation;
}
