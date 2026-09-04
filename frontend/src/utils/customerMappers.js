const STAGE_BY_STATUS = {
  waiting: 1,
  accepted: 2,
  rejected: 1,
  driver_accepted: 3,
  on_the_way: 5,
  delivered: 6
};

const STATUS_LABEL = {
  waiting: 'Pending Verification',
  accepted: 'Verified',
  rejected: 'Rejected by Transmaa',
  driver_accepted: 'Driver Assigned',
  on_the_way: 'On the Way',
  delivered: 'Delivered'
};

export function mapBookingForDisplay(b) {
  return {
    id: b._id,
    fromLocation: b.fromLocation,
    toLocation: b.toLocation,
    pickupDate: b.shiftingDate ? String(b.shiftingDate).split('T')[0] : '',
    pickupTime: b.shiftingTime,
    goodsCategory: b.goodsType,
    loadWeight: b.loadWeight,
    expectedTransportationCost: b.customerExpectedCost,
    description: b.description,
    specialInstructions: b.specialInstructions,
    truckType: b.truckType,
    estimatedFare: b.price,
    status: STATUS_LABEL[b.status] || b.status,
    currentStage: STAGE_BY_STATUS[b.status] || 1,
    createdDate: b.createdAt ? String(b.createdAt).split('T')[0] : '',
    driverDetails: b.driverName
      ? {
          name: b.driverName,
          phone: b.driverPhone,
          vehicleNumber: b.driverVehicle,
          rating: b.driverRating ? `${b.driverRating} ⭐` : undefined
        }
      : null
  };
}
