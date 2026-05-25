import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, ChevronDown, BedDouble, IndianRupee, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';

const CITIES = ['', 'Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Chennai'];
const TYPES = ['', 'Apartment', 'Villa', 'Independent House', 'Studio'];

interface Property {
  id: number;
  title: string;
  city: string;
  locality: string;
  property_type: string;
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  furnishing_status: string;
  listed_price: number;
}

function PropertyCard({ property }: { property: Property }) {
  const formatPrice = (n: number) =>
    n >= 1_00_00_000
      ? `₹${(n / 1_00_00_000).toFixed(2)} Cr`
      : `₹${(n / 1_00_000).toFixed(1)} L`;

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-stone-900 leading-snug">{property.title}</p>
          <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {property.locality}, {property.city}
          </p>
        </div>
        <span className="shrink-0 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
          {property.property_type}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-stone-500">
        <span className="flex items-center gap-1">
          <BedDouble className="h-3.5 w-3.5" />
          {property.bedrooms} BHK
        </span>
        <span>{property.area_sqft.toLocaleString()} sq.ft</span>
        <span>{property.furnishing_status}</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
        <span className="text-lg font-bold text-stone-900">{formatPrice(property.listed_price)}</span>
        <span className="text-xs text-stone-400">
          ₹{Math.round(property.listed_price / property.area_sqft).toLocaleString()}/sq.ft
        </span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-4 bg-stone-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-stone-100 rounded w-1/2 mb-4" />
      <div className="h-3 bg-stone-100 rounded w-full mb-2" />
      <div className="h-6 bg-stone-100 rounded w-1/3 mt-4" />
    </div>
  );
}

export default function RecommendationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    location: searchParams.get('location') ?? '',
    type: searchParams.get('type') ?? '',
    budget: searchParams.get('budget') ?? '',
    bedrooms: searchParams.get('bedrooms') ?? '',
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError('');
    setSearched(true);

    const params: Record<string, string> = {};
    if (filters.location) params.location = filters.location;
    if (filters.type) params.property_type = filters.type;
    if (filters.budget) params.budget = filters.budget;
    if (filters.bedrooms) params.bedrooms = filters.bedrooms;

    try {
      const { data } = await api.get('/recommendations/', { params: { ...params, limit: 12 } });
      if (data.success) {
        setProperties(data.data ?? []);
      } else {
        setError('Failed to load recommendations.');
      }
    } catch {
      setError('Could not reach the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Auto-run if url has params
  useEffect(() => {
    if (searchParams.toString()) {
      fetchRecommendations();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (filters.location) p.set('location', filters.location);
    if (filters.type) p.set('type', filters.type);
    if (filters.budget) p.set('budget', filters.budget);
    if (filters.bedrooms) p.set('bedrooms', filters.bedrooms);
    setSearchParams(p);
    fetchRecommendations();
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <p className="section-label mb-1.5">Property search</p>
          <h1 className="text-2xl font-bold text-stone-900">Find matching properties</h1>
          <p className="text-stone-500 text-sm mt-1">
            Filter by location, budget, and type to see relevant listings.
          </p>
        </div>

        {/* Filter bar */}
        <form onSubmit={handleSubmit} className="card p-4 mb-8 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">
              <MapPin className="inline h-3 w-3 mr-1" />City
            </label>
            <div className="relative">
              <select name="location" value={filters.location} onChange={handleChange} className="form-select pr-8">
                {CITIES.map((c) => <option key={c} value={c}>{c || 'Any city'}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">Type</label>
            <div className="relative">
              <select name="type" value={filters.type} onChange={handleChange} className="form-select pr-8">
                {TYPES.map((t) => <option key={t} value={t}>{t || 'Any type'}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">
              <IndianRupee className="inline h-3 w-3 mr-1" />Max budget (₹)
            </label>
            <input
              type="number"
              name="budget"
              value={filters.budget}
              onChange={handleChange}
              placeholder="e.g. 10000000"
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-primary px-6 py-2.5 self-end">
            <SlidersHorizontal className="h-4 w-4" />
            Apply
          </button>
        </form>

        {/* Results */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && searched && properties.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No properties found for these filters.</p>
            <p className="text-sm mt-1">Try broadening your search criteria.</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="text-center py-20 text-stone-400">
            <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Set your filters and click Apply to search.</p>
          </div>
        )}

        {!loading && properties.length > 0 && (
          <>
            <p className="text-sm text-stone-500 mb-4">
              Showing <strong className="text-stone-700">{properties.length}</strong> matching properties
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
