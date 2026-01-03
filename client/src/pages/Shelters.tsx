import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getShelters } from '../redux/slices/shelterSlice';
import Layout from '../components/layout/Layout';
import ShelterCard from '../components/shelters/ShelterCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

function Shelters() {
  const dispatch = useDispatch<AppDispatch>();
  const { shelters, isLoading } = useSelector((state: RootState) => state.shelters);

  useEffect(() => {
    dispatch(getShelters());
  }, [dispatch]);

  return (
    <Layout>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Emergency Shelters</h2>

      {isLoading ? (
        <LoadingSpinner text="Loading shelters..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelters.map((shelter) => (
            <ShelterCard key={shelter._id} shelter={shelter} />
          ))}
          {shelters.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p className="text-lg">No shelters available at the moment</p>
              <p className="text-sm mt-2">Please check back later</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

export default Shelters;
