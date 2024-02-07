export const getAverageLocation = locations => {
  const averageLocation = locations.reduce((acc, location) => {
    acc.lat += location.lat;
    acc.lng += location.lng;
    return acc;
  }, { lat: 0, lng: 0 });
  averageLocation.lat = parseFloat(averageLocation.lat / locations.length);
  averageLocation.lng = parseFloat(averageLocation.lng / locations.length);
  console.log(averageLocation);
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
