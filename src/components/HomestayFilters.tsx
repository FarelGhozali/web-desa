'use client';

import { useState, useCallback, useEffect } from 'react';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface FilterState {
  minPrice: string;
  maxPrice: string;
  maxGuests: string;
  sortBy: string;
  facilities: string[];
}

interface HomestayFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  isLoading?: boolean;
}

const GUEST_OPTIONS = [
  { label: '1-2 tamu', value: '2' },
  { label: '3-4 tamu', value: '4' },
  { label: '5+ tamu', value: '999' },
];

const SORT_OPTIONS = [
  { label: 'Terbaru', value: 'newest' },
  { label: 'Harga Terendah', value: 'price-asc' },
  { label: 'Harga Tertinggi', value: 'price-desc' },
];

export default function HomestayFilters({ onFilterChange, isLoading = false }: HomestayFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    maxGuests: '',
    sortBy: 'newest',
    facilities: [],
  });

  const [amenitiesList, setAmenitiesList] = useState<string[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(true);

  // Fetch amenities from database
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch('/api/homestays/facilities');
        const data = await response.json();
        if (data.success) {
          setAmenitiesList(data.data);
        }
      } catch (error) {
        console.error('Error fetching amenities:', error);
      } finally {
        setLoadingAmenities(false);
      }
    };

    fetchAmenities();
  }, []);

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newFilters = { ...filters, [name]: value };
      setFilters(newFilters);
    },
    [filters]
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      const newFilters = { ...filters, [name]: value };
      setFilters(newFilters);
    },
    [filters]
  );

  const handleFacilityToggle = useCallback(
    (amenity: string) => {
      setFilters((prev) => {
        const newFacilities = prev.facilities.includes(amenity)
          ? prev.facilities.filter((f: string) => f !== amenity)
          : [...prev.facilities, amenity];
        return { ...prev, facilities: newFacilities };
      });
    },
    []
  );

  const handleApplyFilters = useCallback(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleResetFilters = useCallback(() => {
    const resetedFilters: FilterState = {
      minPrice: '',
      maxPrice: '',
      maxGuests: '',
      sortBy: 'newest',
      facilities: [],
    };
    setFilters(resetedFilters);
    onFilterChange(resetedFilters);
  }, [onFilterChange]);

  return (
    <div className="space-y-6 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700/80">
          Cari Homestay
        </h3>

        {/* Price Range */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            type="number"
            name="minPrice"
            placeholder="Harga Minimum"
            value={filters.minPrice}
            onChange={handlePriceChange}
            min="0"
            disabled={isLoading}
            className="w-full"
          />
          <Input
            type="number"
            name="maxPrice"
            placeholder="Harga Maksimum"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            min="0"
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Guests & Sort */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select
            name="maxGuests"
            value={filters.maxGuests}
            onChange={handleSelectChange}
            disabled={isLoading}
          >
            <option value="">Semua Kapasitas</option>
            {GUEST_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleSelectChange}
            disabled={isLoading}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Fasilitas */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-stone-700">Fasilitas</label>
          {loadingAmenities ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600"></div>
              <p className="ml-2 text-sm text-stone-500">Memuat fasilitas...</p>
            </div>
          ) : amenitiesList.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 p-2 transition hover:border-emerald-500 hover:bg-emerald-50"
                >
                  <input
                    type="checkbox"
                    checked={filters.facilities.includes(amenity)}
                    onChange={() => handleFacilityToggle(amenity)}
                    disabled={isLoading}
                    className="h-4 w-4 cursor-pointer rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-stone-700">{amenity}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500">Tidak ada fasilitas ditemukan</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? 'Mencari...' : 'Cari Homestay'}
          </Button>
          <Button
            onClick={handleResetFilters}
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
