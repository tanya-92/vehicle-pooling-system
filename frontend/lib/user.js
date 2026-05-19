export function hasVehicleInfo(user) {
  if (!user?.vehicleInfo) return false;
  const v = user.vehicleInfo;
  return Boolean(
    v.vehicleType &&
      v.vehicleModel &&
      v.vehicleNumber &&
      v.vehicleColor &&
      v.seatsAvailable
  );
}
