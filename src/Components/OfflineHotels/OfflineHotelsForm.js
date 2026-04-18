import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Button, InputGroup, Alert, Spinner, Tab, Nav, Badge } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import axios from 'axios';
import { baseurl } from '../../Api/Baseurl';
import { useNavigate, useParams } from 'react-router-dom';

// Country data for dropdown
const countries = [
  { id: 1, name: 'India', code: 'IN' },
  { id: 2, name: 'United Arab Emirates', code: 'AE' },
  { id: 3, name: 'Thailand', code: 'TH' },
  { id: 4, name: 'Singapore', code: 'SG' },
  { id: 5, name: 'Malaysia', code: 'MY' },
  { id: 6, name: 'Indonesia', code: 'ID' },
  { id: 7, name: 'Sri Lanka', code: 'LK' },
  { id: 8, name: 'Maldives', code: 'MV' },
  { id: 9, name: 'Nepal', code: 'NP' },
  { id: 10, name: 'Bhutan', code: 'BT' },
  { id: 11, name: 'Bangladesh', code: 'BD' },
  { id: 12, name: 'Myanmar', code: 'MM' },
  { id: 13, name: 'Vietnam', code: 'VN' },
  { id: 14, name: 'Cambodia', code: 'KH' },
  { id: 15, name: 'Laos', code: 'LA' },
  { id: 16, name: 'Philippines', code: 'PH' },
  { id: 17, name: 'China', code: 'CN' },
  { id: 18, name: 'Japan', code: 'JP' },
  { id: 19, name: 'South Korea', code: 'KR' },
  { id: 20, name: 'Turkey', code: 'TR' },
  { id: 21, name: 'Egypt', code: 'EG' },
  { id: 22, name: 'South Africa', code: 'ZA' },
  { id: 23, name: 'Kenya', code: 'KE' },
  { id: 24, name: 'Mauritius', code: 'MU' },
  { id: 25, name: 'Seychelles', code: 'SC' },
  { id: 26, name: 'United Kingdom', code: 'GB' },
  { id: 27, name: 'France', code: 'FR' },
  { id: 28, name: 'Italy', code: 'IT' },
  { id: 29, name: 'Spain', code: 'ES' },
  { id: 30, name: 'Switzerland', code: 'CH' },
  { id: 31, name: 'Germany', code: 'DE' },
  { id: 32, name: 'Netherlands', code: 'NL' },
  { id: 33, name: 'Greece', code: 'GR' },
  { id: 34, name: 'Portugal', code: 'PT' },
  { id: 35, name: 'Austria', code: 'AT' },
  { id: 36, name: 'United States', code: 'US' },
  { id: 37, name: 'Canada', code: 'CA' },
  { id: 38, name: 'Mexico', code: 'MX' },
  { id: 39, name: 'Brazil', code: 'BR' },
  { id: 40, name: 'Argentina', code: 'AR' },
  { id: 41, name: 'Australia', code: 'AU' },
  { id: 42, name: 'New Zealand', code: 'NZ' },
  { id: 43, name: 'Fiji', code: 'FJ' },
  { id: 44, name: 'Russia', code: 'RU' }
];

// Predefined Amenities
const COMMON_AMENITIES = [
  'Free WiFi', 'Air Conditioning', 'TV', 'Room Service', 'Wardrobe'
];

const ADVANCED_AMENITIES = [
  'Mini Fridge', 'Tea/Coffee Maker', 'Balcony', 'Work Desk'
];

const LUXURY_AMENITIES = [
  'Bathtub', 'Mini Bar', 'Butler Service', 'Jacuzzi', 'Smart Controls'
];

const ALL_AMENITIES = [...COMMON_AMENITIES, ...ADVANCED_AMENITIES, ...LUXURY_AMENITIES];

// Helper function to ensure amenities is always an array
const ensureArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : value.split(',').map(a => a.trim());
    } catch (e) {
      return value.split(',').map(a => a.trim());
    }
  }
  return [];
};

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  // Remove any leading slash to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseurl}${cleanPath}`;
};

// Helper function to safely format total amount
const formatTotalAmount = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00';
  }
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return numAmount.toFixed(2);
};

function OfflineHotels() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Image upload states
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  // Track deleted existing images for backend processing
  const [deletedExistingImages, setDeletedExistingImages] = useState([]);

  // Hotel Search Details
  const [searchDetails, setSearchDetails] = useState({
    country: '',
    city: '',
    location: '',
    propertyName: '',
    checkInDate: '',
    checkOutDate: '',
    rooms: 1,
    adults: 2,
    children: 0,
    pets: false
  });

  // Children ages state
  const [childrenAges, setChildrenAges] = useState([]);

  // Hotel Details
  const [hotelDetails, setHotelDetails] = useState({
    hotelName: '',
    location: '',
    starRating: 3,
    mainImage: '',
    additionalImages: [],
    rating: 0,
    totalRatings: 0,
    price: '',
    pricePerChild: '',
    totalAmount: 0,
    taxes: '',
    amenities: [],
    status: 'Available',
    freeStayForKids: false,
    limitedTimeSale: false,
    salePrice: '',
    originalPrice: '',
    loginToBook: false,
    payLater: false
  });

  // Custom Amenities
  const [customAmenities, setCustomAmenities] = useState([]);
  const [newAmenityInput, setNewAmenityInput] = useState('');

  // Description Content
  const [descriptions, setDescriptions] = useState({
    overview: '',
    hotelFacilities: '',
    airportTransfers: '',
    mealPlan: '',
    taxesDescription: ''
  });

  // Default empty room types data
  const getDefaultRoomTypesData = () => ({
    standard: {
      enabled: true,
      hotels: [
        {
          id: Date.now(),
          roomType: 'Standard Room Non AC',
          price: '',
          pricePerChild: '',
          amenities: ['Free WiFi'],
          maxOccupancy: 2,
          bedType: 'Double Bed',
          roomSize: '',
          availableRooms: '',
          description: '',
          images: [],
          imagePreviews: [],
          imageFiles: [],
          deletedImages: []
        }
      ]
    },
    deluxe: {
      enabled: true,
      hotels: [
        {
          id: Date.now() + 1,
          roomType: 'Deluxe Room With AC',
          price: '',
          pricePerChild: '',
          amenities: ['Free WiFi', 'Air Conditioning'],
          maxOccupancy: 2,
          bedType: 'Queen Bed',
          roomSize: '',
          availableRooms: '',
          description: '',
          images: [],
          imagePreviews: [],
          imageFiles: [],
          deletedImages: []
        }
      ]
    },
    luxury: {
      enabled: true,
      hotels: [
        {
          id: Date.now() + 2,
          roomType: 'Luxury Suite With AC',
          price: '',
          pricePerChild: '',
          amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar'],
          maxOccupancy: 3,
          bedType: 'King Bed',
          roomSize: '',
          availableRooms: '',
          description: '',
          images: [],
          imagePreviews: [],
          imageFiles: [],
          deletedImages: []
        }
      ]
    }
  });

  // Room Types Data
  const [roomTypesData, setRoomTypesData] = useState(getDefaultRoomTypesData());

  // Calculate total amount whenever relevant fields change
  useEffect(() => {
    const adultTotal = (searchDetails.adults || 0) * (parseFloat(hotelDetails.price) || 0);
    const childTotal = (searchDetails.children || 0) * (parseFloat(hotelDetails.pricePerChild) || 0);
    const total = adultTotal + childTotal;
    
    setHotelDetails(prev => ({
      ...prev,
      totalAmount: total
    }));
  }, [searchDetails.adults, searchDetails.children, hotelDetails.price, hotelDetails.pricePerChild]);

  // Fetch hotel data if editing
  useEffect(() => {
    if (id) {
      fetchHotelData(id);
    }
  }, [id]);

  const fetchHotelData = async (hotelId) => {
    setFetchLoading(true);
    setError('');

    try {
      const response = await axios.get(`${baseurl}/api/offline-hotels/${hotelId}`);
      
      if (response.data.success) {
        const hotelData = response.data.data;
        console.log('Fetched hotel data:', hotelData);
        
        // Set search details
        setSearchDetails({
          country: hotelData.country || '',
          city: hotelData.city || '',
          location: hotelData.location || '',
          propertyName: hotelData.property_name || '',
          checkInDate: hotelData.check_in_date || '',
          checkOutDate: hotelData.check_out_date || '',
          rooms: hotelData.rooms || 1,
          adults: hotelData.adults || 2,
          children: hotelData.children || 0,
          pets: hotelData.pets === 1 || hotelData.pets === true
        });

        // Set children ages
        setChildrenAges(ensureArray(hotelData.children_ages));

        // Ensure totalAmount is a number
        const totalAmount = hotelData.total_amount 
          ? parseFloat(hotelData.total_amount) 
          : 0;

        // Set hotel details
        setHotelDetails({
          hotelName: hotelData.hotel_name || '',
          location: hotelData.hotel_location || '',
          starRating: hotelData.star_rating || 3,
          mainImage: hotelData.main_image || '',
          additionalImages: ensureArray(hotelData.additional_images),
          rating: parseFloat(hotelData.rating) || 0,
          totalRatings: hotelData.total_ratings || 0,
          price: hotelData.price || '',
          pricePerChild: hotelData.price_per_child || '',
          totalAmount: totalAmount,
          taxes: hotelData.taxes || '',
          amenities: ensureArray(hotelData.amenities),
          status: hotelData.status || 'Available',
          freeStayForKids: hotelData.free_stay_for_kids === 1 || hotelData.free_stay_for_kids === true,
          limitedTimeSale: hotelData.limited_time_sale === 1 || hotelData.limited_time_sale === true,
          salePrice: hotelData.sale_price || '',
          originalPrice: hotelData.original_price || '',
          loginToBook: hotelData.login_to_book === 1 || hotelData.login_to_book === true,
          payLater: hotelData.pay_later === 1 || hotelData.pay_later === true
        });

        // Set custom amenities
        setCustomAmenities(ensureArray(hotelData.custom_amenities));

        // Set descriptions
        setDescriptions({
          overview: hotelData.overview_description || '',
          hotelFacilities: hotelData.hotel_facilities_description || '',
          airportTransfers: hotelData.airport_transfers_description || '',
          mealPlan: hotelData.meal_plan_description || '',
          taxesDescription: hotelData.taxes_description || ''
        });

        // Set room types data if available
        if (hotelData.room_types_data) {
          const roomData = { ...hotelData.room_types_data };
          
          // Ensure all categories exist
          ['standard', 'deluxe', 'luxury'].forEach(category => {
            if (!roomData[category]) {
              roomData[category] = { enabled: false, hotels: [] };
            }
          });
          
          // Process each category
          Object.keys(roomData).forEach(category => {
            if (roomData[category] && roomData[category].hotels) {
              roomData[category].hotels = roomData[category].hotels.map((hotel, index) => {
                const hotelId = hotel.id || Date.now() + index + Math.random();
                const hotelImages = ensureArray(hotel.images);
                const imagePreviews = hotelImages.map(img => getImageUrl(img));
                
                return {
                  ...hotel,
                  id: hotelId,
                  roomType: hotel.roomType || hotel.room_name || '',
                  price: hotel.price || '',
                  pricePerChild: hotel.pricePerChild || '',
                  amenities: ensureArray(hotel.amenities),
                  maxOccupancy: hotel.maxOccupancy || hotel.max_occupancy || 2,
                  bedType: hotel.bedType || hotel.bed_type || '',
                  roomSize: hotel.roomSize || hotel.room_size || '',
                  availableRooms: hotel.availableRooms || hotel.available_rooms || '',
                  description: hotel.description || '',
                  imagePreviews: imagePreviews,
                  images: hotelImages,
                  imageFiles: [],
                  deletedImages: []
                };
              });
            }
          });
          
          setRoomTypesData(roomData);
        }

        // Set main image preview if exists
        if (hotelData.main_image) {
          setMainImagePreview(getImageUrl(hotelData.main_image));
        }

        // Set additional images
        const additionalImages = ensureArray(hotelData.additional_images);
        if (additionalImages.length > 0) {
          const imageUrls = additionalImages.map(img => getImageUrl(img));
          setAdditionalImagePreviews(imageUrls);
          setExistingImages(additionalImages);
        }
      }
    } catch (err) {
      console.error('Error fetching hotel data:', err);
      setError(err.response?.data?.message || 'Failed to fetch hotel data');
    } finally {
      setFetchLoading(false);
    }
  };

  // Handle search details change
  const handleSearchChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle children count and ages
  const handleChildrenChange = (operation) => {
    setSearchDetails(prev => {
      let newCount = prev.children;
      
      if (operation === 'increase') {
        newCount = prev.children + 1;
      } else if (operation === 'decrease' && prev.children > 0) {
        newCount = prev.children - 1;
      }

      if (newCount > childrenAges.length) {
        setChildrenAges([...childrenAges, 5]);
      } else if (newCount < childrenAges.length) {
        setChildrenAges(childrenAges.slice(0, newCount));
      }

      return { ...prev, children: newCount };
    });
  };

  const handleChildAgeChange = (index, age) => {
    const newAges = [...childrenAges];
    newAges[index] = parseInt(age);
    setChildrenAges(newAges);
  };

  // Handle hotel details change
  const handleHotelDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHotelDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Hotel Amenities Handlers
  const toggleHotelAmenity = (amenity) => {
    setHotelDetails(prev => {
      const amenities = prev.amenities || [];
      if (amenities.includes(amenity)) {
        return { ...prev, amenities: amenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...amenities, amenity] };
      }
    });
  };

  const addCustomAmenity = () => {
    if (newAmenityInput.trim() && !customAmenities.includes(newAmenityInput.trim())) {
      setCustomAmenities([...customAmenities, newAmenityInput.trim()]);
      setNewAmenityInput('');
    }
  };

  const removeCustomAmenity = (amenity) => {
    setCustomAmenities(customAmenities.filter(a => a !== amenity));
    setHotelDetails(prev => ({
      ...prev,
      amenities: (prev.amenities || []).filter(a => a !== amenity)
    }));
  };

  // Room Amenities Handlers
  const toggleRoomAmenity = (roomType, hotelIndex, amenity) => {
    setRoomTypesData(prev => ({
      ...prev,
      [roomType]: {
        ...prev[roomType],
        hotels: prev[roomType].hotels.map((hotel, idx) => 
          idx === hotelIndex ? {
            ...hotel,
            amenities: (hotel.amenities || []).includes(amenity) 
              ? hotel.amenities.filter(a => a !== amenity)
              : [...(hotel.amenities || []), amenity]
          } : hotel
        )
      }
    }));
  };

  // Handle main image upload
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, JPG, PNG, GIF, and WEBP images are allowed');
        return;
      }

      setMainImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle additional images upload
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const validPreviews = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image should be less than 5MB');
        continue;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, JPG, PNG, GIF, and WEBP images are allowed');
        continue;
      }

      validFiles.push(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        validPreviews.push(reader.result);
        if (validPreviews.length === validFiles.length) {
          setAdditionalImagePreviews(prev => [...prev, ...validPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    setAdditionalImageFiles(prev => [...prev, ...validFiles]);
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    // Check if this is an existing image (index < existingImages.length)
    if (index < existingImages.length) {
      // Track as deleted
      setDeletedExistingImages(prev => [...prev, existingImages[index]]);
      
      // Remove from existing images
      const newExisting = [...existingImages];
      newExisting.splice(index, 1);
      setExistingImages(newExisting);
    } else {
      // Remove from new files (adjust index)
      const fileIndex = index - existingImages.length;
      const newFiles = [...additionalImageFiles];
      newFiles.splice(fileIndex, 1);
      setAdditionalImageFiles(newFiles);
    }
    
    // Remove preview
    const newPreviews = [...additionalImagePreviews];
    newPreviews.splice(index, 1);
    setAdditionalImagePreviews(newPreviews);
  };

  // Handle room image upload
  const handleRoomImageUpload = (roomType, hotelIndex, e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const validPreviews = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image should be less than 5MB');
        continue;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, JPG, PNG, GIF, and WEBP images are allowed');
        continue;
      }

      validFiles.push(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        validPreviews.push(reader.result);
        if (validPreviews.length === validFiles.length) {
          setRoomTypesData(prev => ({
            ...prev,
            [roomType]: {
              ...prev[roomType],
              hotels: prev[roomType].hotels.map((hotel, idx) => 
                idx === hotelIndex ? {
                  ...hotel,
                  imageFiles: [...(hotel.imageFiles || []), ...validFiles],
                  imagePreviews: [...(hotel.imagePreviews || []), ...validPreviews]
                } : hotel
              )
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove room image
  const removeRoomImage = (roomType, hotelIndex, imageIndex) => {
    setRoomTypesData(prev => ({
      ...prev,
      [roomType]: {
        ...prev[roomType],
        hotels: prev[roomType].hotels.map((hotel, idx) => {
          if (idx !== hotelIndex) return hotel;
          
          const existingImagesCount = (hotel.images || []).length;
          
          // Create new arrays
          let newImages = [...(hotel.images || [])];
          let newImagePreviews = [...(hotel.imagePreviews || [])];
          let newImageFiles = [...(hotel.imageFiles || [])];
          let newDeletedImages = [...(hotel.deletedImages || [])];
          
          if (imageIndex < existingImagesCount) {
            // Removing an existing database image
            const deletedImagePath = newImages[imageIndex];
            newDeletedImages.push(deletedImagePath);
            newImages.splice(imageIndex, 1);
          } else {
            // Removing a newly uploaded image
            const fileIndex = imageIndex - existingImagesCount;
            newImageFiles.splice(fileIndex, 1);
          }
          
          // Remove the preview at the specified index
          newImagePreviews.splice(imageIndex, 1);
          
          return {
            ...hotel,
            images: newImages,
            imagePreviews: newImagePreviews,
            imageFiles: newImageFiles,
            deletedImages: newDeletedImages
          };
        })
      }
    }));
  };

  // Handle descriptions change
  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setDescriptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Room Types Handlers
  const handleRoomTypeEnabledChange = (roomType, enabled) => {
    setRoomTypesData(prev => ({
      ...prev,
      [roomType]: {
        ...prev[roomType],
        enabled
      }
    }));
  };

  const handleRoomHotelChange = (roomType, hotelIndex, field, value) => {
    setRoomTypesData(prev => ({
      ...prev,
      [roomType]: {
        ...prev[roomType],
        hotels: prev[roomType].hotels.map((hotel, idx) => 
          idx === hotelIndex ? { ...hotel, [field]: value } : hotel
        )
      }
    }));
  };

  const addRoomHotel = (roomType) => {
    const defaultAmenities = roomType === 'standard' ? ['Free WiFi'] : 
                            roomType === 'deluxe' ? ['Free WiFi', 'Air Conditioning'] : 
                            ['Free WiFi', 'Air Conditioning', 'Mini Bar'];
    
    const newHotel = {
      id: Date.now() + Math.random(),
      roomType: roomType === 'standard' ? 'Standard Room' : 
                roomType === 'deluxe' ? 'Deluxe Room With AC' : 'Luxury Suite With AC',
      price: '',
      pricePerChild: '',
      amenities: defaultAmenities,
      maxOccupancy: 2,
      bedType: '',
      roomSize: '',
      availableRooms: '',
      description: '',
      images: [],
      imagePreviews: [],
      imageFiles: [],
      deletedImages: []
    };
    
    setRoomTypesData(prev => ({
      ...prev,
      [roomType]: {
        ...prev[roomType],
        hotels: [...prev[roomType].hotels, newHotel]
      }
    }));
  };

  const removeRoomHotel = (roomType, hotelIndex) => {
    setRoomTypesData(prev => ({
      ...prev,
      [roomType]: {
        ...prev[roomType],
        hotels: prev[roomType].hotels.filter((_, idx) => idx !== hotelIndex)
      }
    }));
  };

  // Validation function
  const validateForm = () => {
    if (!searchDetails.country) {
      setError('Please select a country');
      return false;
    }
    if (!searchDetails.city) {
      setError('Please enter city');
      return false;
    }
    if (!searchDetails.checkInDate) {
      setError('Please select check-in date');
      return false;
    }
    if (!searchDetails.checkOutDate) {
      setError('Please select check-out date');
      return false;
    }
    if (!hotelDetails.hotelName) {
      setError('Please enter hotel name');
      return false;
    }
    if (!hotelDetails.price) {
      setError('Please enter price per adult');
      return false;
    }
    return true;
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Prepare room types data for submission
  const prepareRoomTypesDataForSubmit = () => {
    const cleanedData = {};
    
    Object.keys(roomTypesData).forEach(category => {
      cleanedData[category] = {
        enabled: roomTypesData[category].enabled,
        hotels: roomTypesData[category].hotels.map(hotel => {
          const { imagePreviews, imageFiles, deletedImages, ...hotelWithoutImages } = hotel;
          return {
            ...hotelWithoutImages,
            pricePerChild: hotel.pricePerChild || null,
            images: hotel.images || [],
            deletedImages: hotel.deletedImages || []
          };
        })
      };
    });
    
    return cleanedData;
  };

  // Collect all room image files for FormData
  const collectRoomImageFiles = () => {
    const files = [];
    
    Object.keys(roomTypesData).forEach(category => {
      roomTypesData[category].hotels.forEach((hotel, hotelIndex) => {
        if (hotel.imageFiles && hotel.imageFiles.length > 0) {
          hotel.imageFiles.forEach((file, fileIndex) => {
            files.push({
              category,
              hotelIndex,
              fileIndex,
              file
            });
          });
        }
      });
    });
    
    return files;
  };

  // Collect deleted room images to inform backend
  const collectDeletedRoomImages = () => {
    const deletedImages = [];
    
    Object.keys(roomTypesData).forEach(category => {
      roomTypesData[category].hotels.forEach((hotel, hotelIndex) => {
        if (hotel.deletedImages && hotel.deletedImages.length > 0) {
          hotel.deletedImages.forEach((imagePath) => {
            deletedImages.push({
              category,
              hotelIndex,
              imagePath
            });
          });
        }
      });
    });
    
    return deletedImages;
  };

  // Submit handler with FormData for file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      formData.append('searchDetails', JSON.stringify(searchDetails));
      formData.append('childrenAges', JSON.stringify(childrenAges));
      
      const updatedHotelDetails = {
        ...hotelDetails,
        additionalImages: existingImages,
        amenities: hotelDetails.amenities || []
      };
      formData.append('hotelDetails', JSON.stringify(updatedHotelDetails));
      formData.append('customAmenities', JSON.stringify(customAmenities));
      formData.append('descriptions', JSON.stringify(descriptions));
      
      // Append deleted existing images for hotel
      formData.append('deletedExistingImages', JSON.stringify(deletedExistingImages));
      
      // Prepare and append room types data
      const cleanedRoomData = prepareRoomTypesDataForSubmit();
      formData.append('roomTypesData', JSON.stringify(cleanedRoomData));
      
      // Append deleted room images
      const deletedRoomImages = collectDeletedRoomImages();
      formData.append('deletedRoomImages', JSON.stringify(deletedRoomImages));
      
      if (mainImageFile) {
        formData.append('mainImage', mainImageFile);
      }
      
      if (additionalImageFiles.length > 0) {
        additionalImageFiles.forEach((file) => {
          formData.append('additionalImages', file);
        });
      }
      
      // Append room images with metadata
      const roomImageFiles = collectRoomImageFiles();
      roomImageFiles.forEach((item) => {
        formData.append('roomImages', item.file);
        formData.append('roomImageMetadata', JSON.stringify({
          category: item.category,
          hotelIndex: item.hotelIndex,
          fileIndex: item.fileIndex
        }));
      });

      let response;
      if (id) {
        response = await axios.put(`${baseurl}/api/offline-hotels/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(`${baseurl}/api/offline-hotels`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data.success) {
        setSuccess(id ? 'Hotel updated successfully!' : 'Hotel saved successfully!');
        setTimeout(() => {
          navigate('/offline-hotels-table');
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting hotel:', error);
      if (error.response) {
        setError(error.response.data.message || `Failed to ${id ? 'update' : 'save'} hotel`);
      } else if (error.request) {
        setError('No response from server. Please check if the server is running.');
      } else {
        setError(`Error ${id ? 'updating' : 'submitting'} form. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    if (id) {
      fetchHotelData(id);
      setSuccess('');
    } else {
      setSearchDetails({
        country: '',
        city: '',
        location: '',
        propertyName: '',
        checkInDate: '',
        checkOutDate: '',
        rooms: 1,
        adults: 2,
        children: 0,
        pets: false
      });
      setChildrenAges([]);
      setHotelDetails({
        hotelName: '',
        location: '',
        starRating: 3,
        mainImage: '',
        additionalImages: [],
        rating: 0,
        totalRatings: 0,
        price: '',
        pricePerChild: '',
        totalAmount: 0,
        taxes: '',
        amenities: [],
        status: 'Available',
        freeStayForKids: false,
        limitedTimeSale: false,
        salePrice: '',
        originalPrice: '',
        loginToBook: false,
        payLater: false
      });
      setCustomAmenities([]);
      setNewAmenityInput('');
      setDescriptions({
        overview: '',
        hotelFacilities: '',
        airportTransfers: '',
        mealPlan: '',
        taxesDescription: ''
      });
      setRoomTypesData(getDefaultRoomTypesData());
      setMainImageFile(null);
      setMainImagePreview(null);
      setAdditionalImageFiles([]);
      setAdditionalImagePreviews([]);
      setExistingImages([]);
      setDeletedExistingImages([]);
      setSuccess('');
    }
  };

  // Amenity Selector Component
  const AmenitySelector = ({ selectedAmenities, onToggle, availableAmenities, title }) => {
    return (
      <div className="mb-3">
        <Form.Label>{title}</Form.Label>
        <div className="d-flex flex-wrap gap-2 p-3 border rounded bg-white" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {availableAmenities.map(amenity => (
            <Form.Check
              key={amenity}
              type="checkbox"
              id={`amenity-${amenity}-${title?.replace(/\s/g, '')}`}
              label={amenity}
              checked={(selectedAmenities || []).includes(amenity)}
              onChange={() => onToggle(amenity)}
              inline
            />
          ))}
        </div>
      </div>
    );
  };

  // Room Amenity Selector Component
  const RoomAmenitySelector = ({ selectedAmenities, onToggle, roomType }) => {
    let availableAmenities = ALL_AMENITIES;
    if (roomType === 'standard') {
      availableAmenities = COMMON_AMENITIES;
    } else if (roomType === 'deluxe') {
      availableAmenities = [...COMMON_AMENITIES, ...ADVANCED_AMENITIES];
    }
    
    return (
      <div className="mb-3">
        <div className="d-flex flex-wrap gap-2 p-3 border rounded bg-white" style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {availableAmenities.map(amenity => (
            <Form.Check
              key={amenity}
              type="checkbox"
              id={`room-amenity-${amenity}-${roomType}`}
              label={amenity}
              checked={(selectedAmenities || []).includes(amenity)}
              onChange={() => onToggle(amenity)}
              inline
            />
          ))}
        </div>
      </div>
    );
  };

  // Render Room Type Section
  const renderRoomTypeSection = (roomType, title, color) => {
    const data = roomTypesData[roomType] || { enabled: false, hotels: [] };
    
    return (
      <Card className="mb-4">
        <Card.Header style={{ backgroundColor: color, color: 'white' }}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{title} Rooms</h5>
            <Form.Check
              type="switch"
              id={`${roomType}-enabled`}
              label="Enable"
              checked={data.enabled || false}
              onChange={(e) => handleRoomTypeEnabledChange(roomType, e.target.checked)}
              style={{ color: 'white' }}
            />
          </div>
        </Card.Header>
        {data.enabled && (
          <Card.Body>
            {data.hotels && data.hotels.map((hotel, index) => (
              <div key={hotel.id || index} className="mb-4 p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Room Option #{index + 1}</h6>
                  {data.hotels.length > 1 && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeRoomHotel(roomType, index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Room Type Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., Deluxe Room Non AC"
                        value={hotel.roomType || ''}
                        onChange={(e) => handleRoomHotelChange(roomType, index, 'roomType', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Room Price(₹) <span className="text-danger">*</span></Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="1,044"
                          value={hotel.price || ''}
                          onChange={(e) => handleRoomHotelChange(roomType, index, 'price', e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  {/* <Col md={3}>
                    <Form.Group>
                      <Form.Label>Price Per Child (₹)</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Optional"
                          value={hotel.pricePerChild || ''}
                          onChange={(e) => handleRoomHotelChange(roomType, index, 'pricePerChild', e.target.value)}
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Leave empty if children stay free
                      </Form.Text>
                    </Form.Group>
                  </Col> */}
                </Row>

                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Available Rooms</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="e.g., 10"
                        value={hotel.availableRooms || ''}
                        onChange={(e) => handleRoomHotelChange(roomType, index, 'availableRooms', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Bed Type</Form.Label>
                      <Form.Select
                        value={hotel.bedType || ''}
                        onChange={(e) => handleRoomHotelChange(roomType, index, 'bedType', e.target.value)}
                      >
                        <option value="">Select Bed Type</option>
                        <option value="Single Bed">Single Bed</option>
                        <option value="Double Bed">Double Bed</option>
                        <option value="Queen Bed">Queen Bed</option>
                        <option value="King Bed">King Bed</option>
                        <option value="Twin Beds">Twin Beds</option>
                        <option value="Bunk Bed">Bunk Bed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Max Occupancy</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="10"
                        value={hotel.maxOccupancy || 2}
                        onChange={(e) => handleRoomHotelChange(roomType, index, 'maxOccupancy', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Room Size (sq ft)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., 250"
                        value={hotel.roomSize || ''}
                        onChange={(e) => handleRoomHotelChange(roomType, index, 'roomSize', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Room Amenities</Form.Label>
                      <RoomAmenitySelector
                        selectedAmenities={hotel.amenities || []}
                        onToggle={(amenity) => toggleRoomAmenity(roomType, index, amenity)}
                        roomType={roomType}
                      />
                      {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="mt-2">
                          <strong>Selected: </strong>
                          {hotel.amenities.map(amenity => (
                            <Badge key={amenity} bg="primary" className="me-1 mb-1">
                              {amenity}
                              <span 
                                style={{ cursor: 'pointer', marginLeft: '5px' }}
                                onClick={() => toggleRoomAmenity(roomType, index, amenity)}
                              >
                                ×
                              </span>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Room Images</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleRoomImageUpload(roomType, index, e)}
                      />
                      <Form.Text className="text-muted">
                        Upload images of this room type. Max 5MB each.
                      </Form.Text>
                    </Form.Group>
                    
                    {/* Display existing and newly uploaded room images */}
                    {(hotel.imagePreviews && hotel.imagePreviews.length > 0) && (
                      <Row className="mt-3">
                        {hotel.imagePreviews.map((preview, imgIndex) => (
                          <Col md={3} key={imgIndex} className="mb-2">
                            <div className="position-relative">
                              <img 
                                src={preview} 
                                alt={`Room ${index + 1} - Image ${imgIndex + 1}`} 
                                style={{ width: '100%', height: '100px', objectFit: 'cover' }} 
                                className="border rounded"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/100?text=Error';
                                }}
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0"
                                onClick={() => removeRoomImage(roomType, index, imgIndex)}
                              >
                                ×
                              </Button>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Room Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter room description, features, and highlights..."
                        value={hotel.description || ''}
                        onChange={(e) => handleRoomHotelChange(roomType, index, 'description', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
            
            <Button
              variant="outline-primary"
              onClick={() => addRoomHotel(roomType)}
              className="w-100"
            >
              + Add Another {title} Room Option
            </Button>
          </Card.Body>
        )}
      </Card>
    );
  };

  if (fetchLoading) {
    return (
      <Navbar>
        <Container fluid className="py-4 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading hotel data...</p>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <Container fluid className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{id ? 'Edit Offline Hotel' : 'Add Offline Hotel'}</h2>
        </div>

        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Hotel Search Section */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Hotel Search Details</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="country"
                      value={searchDetails.country}
                      onChange={handleSearchChange}
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>City <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="e.g., Goa, Mumbai, Delhi"
                      value={searchDetails.city}
                      onChange={handleSearchChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Property Name / Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="propertyName"
                      placeholder="e.g., Beachfront stays Goa"
                      value={searchDetails.propertyName}
                      onChange={handleSearchChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Check-In Date <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="date"
                      name="checkInDate"
                      value={searchDetails.checkInDate}
                      onChange={handleSearchChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Check-Out Date <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="date"
                      name="checkOutDate"
                      value={searchDetails.checkOutDate}
                      onChange={handleSearchChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Rooms</Form.Label>
                    <InputGroup>
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setSearchDetails(prev => ({ ...prev, rooms: Math.max(1, prev.rooms - 1) }))}
                        disabled={searchDetails.rooms <= 1}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={searchDetails.rooms}
                        readOnly
                        className="text-center"
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setSearchDetails(prev => ({ ...prev, rooms: prev.rooms + 1 }))}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Adults</Form.Label>
                    <InputGroup>
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setSearchDetails(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                        disabled={searchDetails.adults <= 1}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={searchDetails.adults}
                        readOnly
                        className="text-center"
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setSearchDetails(prev => ({ ...prev, adults: prev.adults + 1 }))}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Children (0-17)</Form.Label>
                    <InputGroup>
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleChildrenChange('decrease')}
                        disabled={searchDetails.children <= 0}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={searchDetails.children}
                        readOnly
                        className="text-center"
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleChildrenChange('increase')}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Pets</Form.Label>
                    <Form.Check
                      type="checkbox"
                      label="Travelling with pets?"
                      name="pets"
                      checked={searchDetails.pets}
                      onChange={handleSearchChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {searchDetails.children > 0 && (
                <Row className="mt-3">
                  <Col md={12}>
                    <Card bg="light" className="p-3">
                      <h6>Children Ages</h6>
                      <Row>
                        {childrenAges.map((age, index) => (
                          <Col md={3} key={index} className="mb-2">
                            <Form.Group>
                              <Form.Label>Child {index + 1} Age</Form.Label>
                              <Form.Select
                                value={age}
                                onChange={(e) => handleChildAgeChange(index, e.target.value)}
                              >
                                {[...Array(18).keys()].map(age => (
                                  <option key={age} value={age}>{age} years</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          {/* Hotel Details Section */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Hotel Details</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Hotel Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="hotelName"
                      placeholder="e.g., Estrela Do Mar Beach Resort"
                      value={hotelDetails.hotelName}
                      onChange={handleHotelDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Location <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      placeholder="e.g., North Goa | About a minute walk to Calangute Beach"
                      value={hotelDetails.location}
                      onChange={handleHotelDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Star Rating</Form.Label>
                    <Form.Select
                      name="starRating"
                      value={hotelDetails.starRating}
                      onChange={handleHotelDetailChange}
                    >
                      <option value={3}>3 Star</option>
                      <option value={4}>4 Star</option>
                      <option value={5}>5 Star</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Rating (0-5)</Form.Label>
                    <Form.Control
                      type="number"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={hotelDetails.rating}
                      onChange={handleHotelDetailChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Total Ratings</Form.Label>
                    <Form.Control
                      type="number"
                      name="totalRatings"
                      placeholder="e.g., 8205"
                      value={hotelDetails.totalRatings}
                      onChange={handleHotelDetailChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={hotelDetails.status}
                      onChange={handleHotelDetailChange}
                    >
                      <option value="Available">Available</option>
                      <option value="Limited Availability">Limited Availability</option>
                      <option value="Booked">Booked</option>
                      <option value="Under Renovation">Under Renovation</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Main Image Upload</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                    />
                    {mainImagePreview && (
                      <div className="mt-2 position-relative">
                        <img 
                          src={mainImagePreview} 
                          alt="Preview" 
                          style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }} 
                          className="border rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 start-0"
                          onClick={() => {
                            setMainImageFile(null);
                            setMainImagePreview(null);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    )}
                    <Form.Text className="text-muted">
                      Max 5MB. JPEG, JPG, PNG, GIF, WEBP only.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Or Main Image URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="mainImage"
                      placeholder="https://example.com/image.jpg"
                      value={hotelDetails.mainImage}
                      onChange={handleHotelDetailChange}
                      disabled={!!mainImageFile}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Additional Images</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                    />
                    {additionalImagePreviews.length > 0 && (
                      <Row className="mt-3">
                        {additionalImagePreviews.map((preview, index) => (
                          <Col md={3} key={index} className="mb-2">
                            <div className="position-relative">
                              <img 
                                src={preview} 
                                alt={`Additional ${index + 1}`} 
                                style={{ width: '100%', height: '100px', objectFit: 'cover' }} 
                                className="border rounded"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/100?text=Error';
                                }}
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0"
                                onClick={() => removeAdditionalImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    )}
                    <Form.Text className="text-muted">
                      You can select multiple images. Max 5MB each.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              {/* Hotel Amenities Section */}
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Hotel Amenities / Facilities</Form.Label>
                    
                    <AmenitySelector
                      selectedAmenities={hotelDetails.amenities || []}
                      onToggle={toggleHotelAmenity}
                      availableAmenities={COMMON_AMENITIES}
                      title="Common Amenities"
                    />
                    
                    <AmenitySelector
                      selectedAmenities={hotelDetails.amenities || []}
                      onToggle={toggleHotelAmenity}
                      availableAmenities={ADVANCED_AMENITIES}
                      title="Advanced Amenities (Deluxe / Luxury)"
                    />
                    
                    <AmenitySelector
                      selectedAmenities={hotelDetails.amenities || []}
                      onToggle={toggleHotelAmenity}
                      availableAmenities={LUXURY_AMENITIES}
                      title="Luxury Amenities"
                    />
                    
                    {/* Custom Amenities */}
                    <div className="mt-3">
                      <Form.Label>Custom Amenities</Form.Label>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {customAmenities.map(amenity => (
                          <Badge key={amenity} bg="success" className="p-2">
                            <Form.Check
                              type="checkbox"
                              id={`custom-${amenity}`}
                              label={amenity}
                              checked={(hotelDetails.amenities || []).includes(amenity)}
                              onChange={() => toggleHotelAmenity(amenity)}
                              inline
                              className="text-white"
                            />
                            <span 
                              style={{ cursor: 'pointer', marginLeft: '8px', color: 'white' }}
                              onClick={() => removeCustomAmenity(amenity)}
                            >
                              ×
                            </span>
                          </Badge>
                        ))}
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Add custom amenity"
                          value={newAmenityInput}
                          onChange={(e) => setNewAmenityInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                        />
                        <Button variant="outline-secondary" onClick={addCustomAmenity}>
                          Add
                        </Button>
                      </InputGroup>
                    </div>
                    
                    {(hotelDetails.amenities && hotelDetails.amenities.length > 0) && (
                      <div className="mt-3">
                        <strong>Selected Amenities: </strong>
                        <div className="d-flex flex-wrap gap-1 mt-2">
                          {hotelDetails.amenities.map(amenity => (
                            <Badge key={amenity} bg="primary" className="p-2">
                              {amenity}
                              <span 
                                style={{ cursor: 'pointer', marginLeft: '5px' }}
                                onClick={() => toggleHotelAmenity(amenity)}
                              >
                                ×
                              </span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Pricing Section */}
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Price Per Adult (₹) <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="price"
                        placeholder="Enter price per adult"
                        value={hotelDetails.price}
                        onChange={handleHotelDetailChange}
                        required
                        min="0"
                        step="0.01"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Price Per Child (₹)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="pricePerChild"
                        placeholder="Enter price per child"
                        value={hotelDetails.pricePerChild}
                        onChange={handleHotelDetailChange}
                        min="0"
                        step="0.01"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Optional - Leave empty if children stay free
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Total Amount (₹)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={formatTotalAmount(hotelDetails.totalAmount)}
                        readOnly
                        className="bg-light"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Auto-calculated: (Adults × Adult Price) + (Children × Child Price)
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Taxes & Fees (₹)</Form.Label>
                    <Form.Control
                      type="text"
                      name="taxes"
                      placeholder="1,205"
                      value={hotelDetails.taxes}
                      onChange={handleHotelDetailChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Original Price (₹)</Form.Label>
                    <Form.Control
                      type="text"
                      name="originalPrice"
                      placeholder="17,099"
                      value={hotelDetails.originalPrice}
                      onChange={handleHotelDetailChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Sale Price (₹)</Form.Label>
                    <Form.Control
                      type="text"
                      name="salePrice"
                      placeholder="10,518"
                      value={hotelDetails.salePrice}
                      onChange={handleHotelDetailChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <Form.Check
                    type="checkbox"
                    label="Free Stay for Kids"
                    name="freeStayForKids"
                    checked={hotelDetails.freeStayForKids}
                    onChange={handleHotelDetailChange}
                  />
                </Col>
                <Col md={3}>
                  <Form.Check
                    type="checkbox"
                    label="Limited Time Sale"
                    name="limitedTimeSale"
                    checked={hotelDetails.limitedTimeSale}
                    onChange={handleHotelDetailChange}
                  />
                </Col>
                <Col md={3}>
                  <Form.Check
                    type="checkbox"
                    label="Login to Book"
                    name="loginToBook"
                    checked={hotelDetails.loginToBook}
                    onChange={handleHotelDetailChange}
                  />
                </Col>
                <Col md={3}>
                  <Form.Check
                    type="checkbox"
                    label="Pay Later Option"
                    name="payLater"
                    checked={hotelDetails.payLater}
                    onChange={handleHotelDetailChange}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Description Tabs Section */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Hotel Descriptions</h5>
            </Card.Header>
            <Card.Body>
              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="overview">Overview</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="facilities">Hotel Facilities</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="transfers">Airport Transfers</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="meal">Meal Plan</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="taxes">Taxes</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="overview">
                    <Form.Group>
                      <Form.Label>Overview Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="overview"
                        placeholder="Enter hotel overview, highlights, and key information..."
                        value={descriptions.overview}
                        onChange={handleDescriptionChange}
                      />
                    </Form.Group>
                  </Tab.Pane>

                  <Tab.Pane eventKey="facilities">
                    <Form.Group>
                      <Form.Label>Hotel Facilities</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="hotelFacilities"
                        placeholder="List all hotel facilities: swimming pool, spa, gym, restaurant, wifi, parking, etc..."
                        value={descriptions.hotelFacilities}
                        onChange={handleDescriptionChange}
                      />
                    </Form.Group>
                  </Tab.Pane>

                  <Tab.Pane eventKey="transfers">
                    <Form.Group>
                      <Form.Label>Airport Transfers</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="airportTransfers"
                        placeholder="Describe airport transfer options, costs, pickup points, etc..."
                        value={descriptions.airportTransfers}
                        onChange={handleDescriptionChange}
                      />
                    </Form.Group>
                  </Tab.Pane>

                  <Tab.Pane eventKey="meal">
                    <Form.Group>
                      <Form.Label>Meal Plan</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="mealPlan"
                        placeholder="Describe meal plans available: Bed & Breakfast, Half Board, Full Board, All Inclusive, etc..."
                        value={descriptions.mealPlan}
                        onChange={handleDescriptionChange}
                      />
                    </Form.Group>
                  </Tab.Pane>

                  <Tab.Pane eventKey="taxes">
                    <Form.Group>
                      <Form.Label>Taxes Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="taxesDescription"
                        placeholder="Describe tax details: GST, service charges, city tax, resort fees, etc..."
                        value={descriptions.taxesDescription}
                        onChange={handleDescriptionChange}
                      />
                    </Form.Group>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>

          {/* Room Types Section */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Room Types & Pricing</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-4">
                Configure room types for this hotel. Reference format: Deluxe Room Non AC with Complimentary Wi-Fi Starting @ ₹1,044
              </p>
              
              {renderRoomTypeSection('standard', 'Standard', '#6c757d')}
              {renderRoomTypeSection('deluxe', 'Deluxe', '#0d6efd')}
              {renderRoomTypeSection('luxury', 'Luxury', '#dc3545')}
            </Card.Body>
          </Card>

          {/* Submit Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="secondary" 
              type="button"
              onClick={resetForm}
              disabled={loading}
            >
              Reset
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {id ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                id ? 'Update Hotel' : 'Save Hotel'
              )}
            </Button>
          </div>
        </Form>
      </Container>
    </Navbar>
  );
}

export default OfflineHotels;