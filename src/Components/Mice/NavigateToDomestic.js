// NavigateToDomesticDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { baseurl } from '../../Api/Baseurl';

const NavigateToDomesticDetails = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await fetch(`${baseurl}/api/mice/domestic/city/${encodeURIComponent(cityName)}`);
        if (!response.ok) {
          throw new Error('City not found');
        }
        const cityData = await response.json();
        // Navigate to the domestic details page with the city ID
        navigate(`/mice/domestic-details/${cityData.id}`);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCityData();
  }, [cityName, navigate]);

  if (loading) {
    return <div>Loading city details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
};

export default NavigateToDomesticDetails;