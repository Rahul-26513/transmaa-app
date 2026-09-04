import { formatPhone, formatCurrency, formatDateTime, formatDate, relativeTime } from './format';

export function mapBooking(b) {
  return {
    id: b._id,
    customerName: b.customerName,
    customerPhone: formatPhone(b.customerPhone),
    goodsType: b.goodsType,
    pickupDateTime: b.shiftingDate
      ? `${formatDate(b.shiftingDate)}, ${b.shiftingTime || ''}`.trim()
      : b.shiftingTime || '',
    fromLocation: b.fromLocation,
    toLocation: b.toLocation,
    truckType: b.truckType,
    capacity: b.truckCapacity,
    status: b.status,
    statusBadge: b.status,
    createdAt: relativeTime(b.createdAt),
    amount: formatCurrency(b.price),
    driverName: b.driverName,
    driverPhone: b.driverPhone ? formatPhone(b.driverPhone) : b.driverPhone,
    driverVehicle: b.driverVehicle,
    completedAt: b.completedAt ? formatDateTime(b.completedAt) : undefined,
    driverId: b.driverId
  };
}

export function mapPendingDriver(d) {
  return {
    id: d._id,
    name: d.name,
    phone: formatPhone(d.phone),
    photo: d.photo || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=300&q=80',
    gender: d.gender,
    dob: d.dob ? formatDate(d.dob) : '',
    bio: d.bio,
    experienceYears: d.experienceYears,
    vehicleType: d.vehicleType,
    vehicleModel: d.vehicleModel,
    vehicleNumber: d.vehicleNumber,
    dlNumber: d.dlNumber,
    panNumber: d.panNumber,
    status: d.verificationStatus,
    appliedDate: formatDateTime(d.createdAt)
  };
}

export function mapVerifiedDriver(d, mappedOrders) {
  const activeOrder = mappedOrders.find(
    (o) => o.driverId === d._id && ['driver_accepted', 'on_the_way'].includes(o.status)
  );

  return {
    id: d._id,
    name: d.name,
    phone: formatPhone(d.phone),
    vehicleType: d.vehicleType,
    vehicleNumber: d.vehicleNumber,
    experienceYears: d.experienceYears,
    status: d.status,
    currentOrder: activeOrder
      ? `${activeOrder.id.slice(-6).toUpperCase()} (${activeOrder.customerName})`
      : d.status === 'Active'
        ? 'None (Available)'
        : 'None (Off Duty)',
    rating: d.rating,
    tripsCompleted: d.tripsCompleted
  };
}

export function mapVehicle(v) {
  return {
    id: v._id,
    sellerName: v.sellerName,
    sellerPhone: formatPhone(v.sellerPhone),
    makeModel: v.makeModel,
    year: v.year,
    rcNumber: v.rcNumber,
    price: v.price,
    kmDriven: v.kmDriven,
    fuelType: v.fuelType,
    location: v.location,
    description: v.description,
    photos: v.photos || [],
    status: v.status,
    submittedAt: relativeTime(v.createdAt),
    publishedAt: v.publishedAt ? formatDate(v.publishedAt) : undefined,
    interestedBuyers: (v.interestedBuyers || []).map((buyer) => ({
      id: buyer._id,
      name: buyer.name,
      phone: formatPhone(buyer.phone),
      requestedDate: formatDateTime(buyer.requestedAt)
    }))
  };
}

export function mapEnquiry(e) {
  return {
    id: e._id,
    name: e.name,
    phone: formatPhone(e.phone),
    vehicleType: e.vehicleType,
    rcNumber: e.rcNumber,
    enquiryType: e.enquiryType,
    submittedDate: formatDateTime(e.createdAt),
    status: e.status,
    loanAmountRequested: e.loanAmountRequested,
    notes: e.notes
  };
}
