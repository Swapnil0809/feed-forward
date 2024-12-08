export const createLocationObject = ({
  userLocation = {},
  coordinates,
  address,
  state,
  city,
  pincode,
}) => {
  const coordinatesArray =
    coordinates?.map(Number) || userLocation?.coordinates;

  return {
    type: "Point",
    coordinates: coordinatesArray,
    properties: {
      address: address.toLowerCase() || userLocation?.properties?.address,
      state: state.toLowerCase() || userLocation?.properties?.state,
      city: city.toLowerCase() || userLocation?.properties?.city,
      pincode: pincode || userLocation?.properties?.pincode,
    },
  };
};
