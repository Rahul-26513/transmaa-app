export const GOODS_CATEGORIES = [
  {
    id: 1,
    title: 'Timber / Plywood / Laminate',
    iconName: 'Trees',
    desc: 'Wooden planks, raw timber, plywood sheets, laminate rolls',
    recommendedVehicle: 'Medium / Heavy Truck'
  },
  {
    id: 2,
    title: 'Electrical / Electronics / Home Appliances',
    iconName: 'Zap',
    desc: 'Washing machines, TVs, refrigerators, wiring coils & panels',
    recommendedVehicle: 'Mini / Pickup Truck'
  },
  {
    id: 3,
    title: 'General Goods',
    iconName: 'Package',
    desc: 'Misc packaged commodities, boxes, retail goods',
    recommendedVehicle: 'Mini Truck / LCV'
  },
  {
    id: 4,
    title: 'Building / Construction',
    iconName: 'Building2',
    desc: 'Cement, bricks, steel rods, tiles, sand bags',
    recommendedVehicle: 'Medium / Heavy Truck'
  },
  {
    id: 5,
    title: 'Catering / Restaurant / Event Management',
    iconName: 'UtensilsCrossed',
    desc: 'Cooking utensils, stage props, decorative fixtures, tents',
    recommendedVehicle: 'Pickup / Light Commercial'
  },
  {
    id: 6,
    title: 'Machines / Equipment / Spare Parts / Metals',
    iconName: 'Cog',
    desc: 'Industrial machinery, engine parts, metal pipes, lathe units',
    recommendedVehicle: 'Medium / Heavy Truck'
  },
  {
    id: 7,
    title: 'Textile / Garments / Fashion Accessories',
    iconName: 'Shirt',
    desc: 'Yarn rolls, fabric bales, ready garments, retail clothing',
    recommendedVehicle: 'Light Commercial / Medium Truck'
  },
  {
    id: 8,
    title: 'Furniture / Home Furnishing',
    iconName: 'Armchair',
    desc: 'Sofa sets, beds, tables, mattresses, office workstations',
    recommendedVehicle: 'Pickup / Light Commercial Truck'
  },
  {
    id: 9,
    title: 'House Shifting',
    iconName: 'Home',
    desc: 'Complete household items, appliances, personal luggage',
    recommendedVehicle: 'Pickup / 14ft LCV Truck'
  },
  {
    id: 10,
    title: 'Ceramics / Sanitary / Hardware',
    iconName: 'Bath',
    desc: 'Sanitaryware, ceramic tiles, bathroom fittings, pipe bundles',
    recommendedVehicle: 'Light Commercial / Medium Truck'
  },
  {
    id: 11,
    title: 'Paper / Packaging / Printed Material',
    iconName: 'FileText',
    desc: 'Paper rolls, corrugated boxes, printed brochures, books',
    recommendedVehicle: 'Mini / Light Commercial Truck'
  }
];

export const TRUCK_TYPES = [
  {
    id: 'mini-truck',
    name: 'Mini Truck',
    subName: 'Tata Ace Gold / Mahindra Jeeto',
    capacity: '750 kg - 1 Ton',
    dimensions: '7ft x 4.8ft x 4.8ft',
    suitableFor: 'Small household goods, electronics, general packages',
    availability: 'Available Nearby (5 mins away)',
    basePrice: 1200,
    perKmPrice: 22,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Tata_Ace_Mini_Truck_%281%29.JPG/960px-Tata_Ace_Mini_Truck_%281%29.JPG',
    badge: 'Popular for City'
  },
  {
    id: 'pickup-truck',
    name: 'Pickup Truck',
    subName: 'Mahindra Bolero Maxi Truck / Isuzu D-Max',
    capacity: '1.5 - 2.5 Tons',
    dimensions: '9ft x 5.5ft x 5ft',
    suitableFor: 'House shifting, furniture, catering equipment, textile bales',
    availability: 'Available Nearby (10 mins away)',
    basePrice: 2100,
    perKmPrice: 32,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Loaded_pickup_truck_Memphis_TN_2013-04-07_002.jpg/960px-Loaded_pickup_truck_Memphis_TN_2013-04-07_002.jpg',
    badge: 'Most Booked'
  },
  {
    id: 'light-commercial',
    name: 'Light Commercial Truck (LCV)',
    subName: 'Eicher Pro 14ft Open/Closed Container',
    capacity: '3.5 - 5 Tons',
    dimensions: '14ft x 6.5ft x 6.5ft',
    suitableFor: 'Plywood, heavy machinery spares, event gear, large house shifts',
    availability: 'Available on Booking',
    basePrice: 3800,
    perKmPrice: 48,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    badge: 'Best for Inter-city'
  },
  {
    id: 'medium-truck',
    name: 'Medium Truck (6-Wheeler)',
    subName: 'Tata 1109 / Eicher 19ft',
    capacity: '7 - 10 Tons',
    dimensions: '19ft x 7.5ft x 7ft',
    suitableFor: 'Construction cement, timber planks, ceramics, industrial cargo',
    availability: 'Available on Booking',
    basePrice: 6500,
    perKmPrice: 65,
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80',
    badge: 'Heavy Load'
  },
  {
    id: 'heavy-truck',
    name: 'Heavy Commercial Truck (10-12 Wheeler)',
    subName: 'BharatBenz 2823C / Ashok Leyland 3518',
    capacity: '16 - 25 Tons',
    dimensions: '22ft - 28ft Multi-Axle Open Body',
    suitableFor: 'Bulk construction steel, raw timber, heavy factory machinery',
    availability: 'Scheduled Booking',
    basePrice: 12500,
    perKmPrice: 95,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Truck_at_Highway_of_Hyderabad_2.jpg/960px-Truck_at_Highway_of_Hyderabad_2.jpg',
    badge: 'Bulk Freight'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'TRM-849201',
    fromLocation: 'Sircilla Textile Park',
    toLocation: 'Hitech City, Hyderabad',
    pickupDate: '2026-08-28',
    pickupTime: '10:00 AM - 12:00 PM',
    goodsCategory: 'Textile / Garments / Fashion Accessories',
    loadWeight: '2.5 Tons (12 Bales)',
    specialInstructions: 'Handle fabric rolls with moisture-proof cover',
    truckType: 'Pickup Truck (Mahindra Bolero)',
    status: 'Driver Assigned',
    currentStage: 3, // 1: Submitted, 2: Verified, 3: Driver Assigned, 4: Pickup, 5: On the Way, 6: Delivered
    estimatedFare: 4250,
    createdDate: '2026-08-27',
    driverDetails: {
      name: 'Ramesh Kumar (Transmaa Verified Driver)',
      phone: '+91 98490 XXXXX',
      vehicleNumber: 'TS 09 AB 4821',
      rating: '4.9 ⭐'
    }
  },
  {
    id: 'TRM-739105',
    fromLocation: 'Kukatpally Housing Board, Hyderabad',
    toLocation: 'Banjara Hills, Hyderabad',
    pickupDate: '2026-08-25',
    pickupTime: '02:00 PM',
    goodsCategory: 'House Shifting',
    loadWeight: '1.2 Tons',
    specialInstructions: 'Glassware fragile box present',
    truckType: 'Mini Truck (Tata Ace)',
    status: 'Delivered',
    currentStage: 6,
    estimatedFare: 1850,
    createdDate: '2026-08-24',
    driverDetails: {
      name: 'Venkatesh Rao',
      phone: '+91 97000 XXXXX',
      vehicleNumber: 'TS 07 EA 1092',
      rating: '4.8 ⭐'
    }
  },
  {
    id: 'TRM-620481',
    fromLocation: 'Industrial Estate, Sanathnagar',
    toLocation: 'Auto Nagar, Vijayawada',
    pickupDate: '2026-08-21',
    pickupTime: '08:00 AM',
    goodsCategory: 'Machines / Equipment / Spare Parts / Metals',
    loadWeight: '4.8 Tons',
    specialInstructions: 'Lathe machine needs crane loading assistance',
    truckType: 'Light Commercial Truck (Eicher 14ft)',
    status: 'Delivered',
    currentStage: 6,
    estimatedFare: 11400,
    createdDate: '2026-08-20',
    driverDetails: {
      name: 'Satyanarayana M.',
      phone: '+91 94400 XXXXX',
      vehicleNumber: 'AP 16 TZ 8831',
      rating: '5.0 ⭐'
    }
  }
];

export const INITIAL_VEHICLES_FOR_SALE = [
  {
    id: 'VEH-101',
    title: 'Tata Ace Gold Cx 2022',
    type: 'Mini Truck',
    model: 'Ace Gold Cx Diesel',
    year: 2022,
    price: 385000,
    location: 'Hyderabad, Telangana',
    kmsDriven: '32,000 km',
    fuelType: 'Diesel',
    owners: '1st Owner',
    rcVerified: true,
    rcNumber: 'TS 08 ET ****',
    fitnessExpiry: 'March 2027',
    insuranceExpiry: 'Dec 2026',
    description: 'Well-maintained single owner Tata Ace Gold. Regularly serviced at authorized Tata Motors center. New radial tires fitted.',
    images: [
      'https://images.unsplash.com/photo-1586191582056-a05e26b1df30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'VEH-102',
    title: 'Mahindra Bolero Maxi Truck Plus 2021',
    type: 'Pickup Truck',
    model: 'Bolero Maxi Truck Plus m2DiCR',
    year: 2021,
    price: 540000,
    location: 'Karimnagar, Telangana',
    kmsDriven: '48,500 km',
    fuelType: 'Diesel',
    owners: '1st Owner',
    rcVerified: true,
    rcNumber: 'TS 02 FA ****',
    fitnessExpiry: 'August 2028',
    insuranceExpiry: 'Nov 2026',
    description: 'Excellent condition Mahindra Bolero Pickup. Power steering, reinforced leaf spring suspension, clean cabin body.',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'VEH-103',
    title: 'Eicher Pro 2049 14ft Container 2023',
    type: 'Light Commercial Truck',
    model: 'Pro 2049 E-483',
    year: 2023,
    price: 980000,
    location: 'Vijayawada, Andhra Pradesh',
    kmsDriven: '21,000 km',
    fuelType: 'Diesel',
    owners: '1st Owner',
    rcVerified: true,
    rcNumber: 'AP 16 TB ****',
    fitnessExpiry: 'June 2029',
    insuranceExpiry: 'Feb 2027',
    description: 'Factory-built 14ft waterproof container body. Ideal for ecommerce, courier, and FMCG transportation. Under company warranty.',
    images: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'VEH-104',
    title: 'BharatBenz 1217C Tipper / Open Body 2020',
    type: 'Medium Truck',
    model: '1217C BS-VI',
    year: 2020,
    price: 1450000,
    location: 'Warangal, Telangana',
    kmsDriven: '76,000 km',
    fuelType: 'Diesel',
    owners: '2nd Owner',
    rcVerified: true,
    rcNumber: 'TS 03 FE ****',
    fitnessExpiry: 'Oct 2027',
    insuranceExpiry: 'Jan 2027',
    description: 'Heavy duty 6-wheeler chassis with high payload capacity. Clean engine performance, tubeless tires in 80% condition.',
    images: [
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501700493788-df30413429c8?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOT-01',
    title: 'Driver Assigned to Booking TRM-849201',
    message: 'Ramesh Kumar (TS 09 AB 4821) has been assigned for your pickup from Sircilla Textile Park.',
    timestamp: '10 mins ago',
    read: false,
    type: 'booking'
  },
  {
    id: 'NOT-02',
    title: 'Booking TRM-849201 Verified',
    message: 'Transmaa team has verified your load details and route fare.',
    timestamp: '1 hour ago',
    read: false,
    type: 'verification'
  },
  {
    id: 'NOT-03',
    title: 'Vehicle Finance Enquiry Received',
    message: 'Our financial officer will contact you regarding your loan query for Mahindra Bolero within 24 hours.',
    timestamp: 'Yesterday',
    read: true,
    type: 'finance'
  },
  {
    id: 'NOT-04',
    title: 'Load Delivered TRM-739105',
    message: 'Your house shifting load to Banjara Hills was successfully delivered.',
    timestamp: '2 days ago',
    read: true,
    type: 'delivered'
  }
];
