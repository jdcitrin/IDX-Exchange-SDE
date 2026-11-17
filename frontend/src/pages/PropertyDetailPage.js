import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPropertyDetail } from '../api/client';
import PropertyImageGallery from '../components/PropertyImageGallery';
import PropertyMap from '../components/PropertyMap';

// full page for one property
export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setProperty(null);
    setError(null);

    fetchPropertyDetail(id)
      .then((result) => {
        if (!ignore) setProperty(result);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  let content;
  if (error) {
    content = <p role="alert">Error: {error}</p>;
  } else if (!property) {
    content = <p>Loading property…</p>;
  } else {
    content = (
      <>
        <PropertyImageGallery rawPhotos={property.L_Photos} />

        <h2>${Number(property.L_SystemPrice).toLocaleString()}</h2>
        <p>
          {property.L_Address}, {property.L_City}, {property.L_State} {property.L_Zip}
        </p>
        <p>
          {property.L_Keyword2} beds · {Number(property.LM_Dec_3)} baths · {property.LM_Int2_3} sqft · Built{' '}
          {property.YearBuilt}
        </p>

        <h3>Description</h3>
        <p>{property.L_Remarks}</p>

        <h3>Property Details</h3>
        <ul>
          <li>Listing ID: {property.L_ListingID}</li>
          <li>Property type: {property.L_Type_}</li>
          <li>Class: {property.L_Class}</li>
        </ul>

        <h3>Location</h3>
        <PropertyMap lat={property.LMD_MP_Latitude} lng={property.LMD_MP_Longitude} />
      </>
    );
  }

  return (
    <section>
      <Link to="/">Back to listings</Link>
      {content}
    </section>
  );
}
