import { useState } from 'react';
import { Calculator, ChevronDown, AlertCircle } from 'lucide-react';
import api from '../services/api';

const FIELD_OPTIONS = {
  property_type: ['Apartment', 'Villa', 'Independent House', 'Studio'],
  furnishing_status: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'],
  property_age: ['0-1', '1-5', '5-10', '10+'],
  city: ['Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Chennai'],
};

function SelectField({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-600 mb-1.5">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="form-select pr-9"
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
      </div>
    </div>
  );
}

function NumberField({
  label,
  name,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  min: number;
  max?: number;
  suffix?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-600 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="number"
          name={name}
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          className="form-input pr-12"
          required
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">{suffix}</span>
        )}
      </div>
    </div>
  );
}

interface FormState {
  city: string;
  location: string;
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  furnishing_status: string;
  property_age: string;
  amenities: string;
  description: string;
}

export default function PredictionPage() {
  const [form, setForm] = useState<FormState>({
    city: 'Mumbai',
    location: '',
    area_sqft: 1200,
    bedrooms: 2,
    bathrooms: 2,
    property_type: 'Apartment',
    furnishing_status: 'Semi-Furnished',
    property_age: '1-5',
    amenities: '',
    description: '',
  });

  const [result, setResult] = useState<{ price: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const payload = {
      ...form,
      location: form.location || form.city,
    };

    try {
      const { data } = await api.post('/predict/', payload);
      if (data.success) {
        setResult({ price: data.data.predicted_price });
      } else {
        setError(data.errors?.[0] ?? 'Prediction failed. Please try again.');
      }
    } catch {
      setError('Could not reach the prediction service. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Page header */}
        <div className="mb-8">
          <p className="section-label mb-1.5">ML-powered valuation</p>
          <h1 className="text-2xl font-bold text-stone-900">Property Price Estimator</h1>
          <p className="text-stone-500 text-sm mt-1">
            Fill in the details below and our trained model will estimate the market value.
          </p>
        </div>

        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: City + Property type */}
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="City" name="city" value={form.city} options={FIELD_OPTIONS.city} onChange={handleChange} />
              <SelectField label="Property Type" name="property_type" value={form.property_type} options={FIELD_OPTIONS.property_type} onChange={handleChange} />
            </div>

            {/* Row 2: Area + Beds + Baths */}
            <div className="grid grid-cols-3 gap-4">
              <NumberField label="Area" name="area_sqft" value={form.area_sqft} min={100} suffix="sq.ft" onChange={handleChange} />
              <NumberField label="Bedrooms" name="bedrooms" value={form.bedrooms} min={1} max={10} onChange={handleChange} />
              <NumberField label="Bathrooms" name="bathrooms" value={form.bathrooms} min={1} max={10} onChange={handleChange} />
            </div>

            {/* Row 3: Furnishing + Age */}
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Furnishing" name="furnishing_status" value={form.furnishing_status} options={FIELD_OPTIONS.furnishing_status} onChange={handleChange} />
              <SelectField label="Property Age" name="property_age" value={form.property_age} options={FIELD_OPTIONS.property_age} onChange={handleChange} />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                Amenities <span className="font-normal text-stone-400">(optional — e.g. pool, parking, garden)</span>
              </label>
              <input
                type="text"
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                placeholder="pool, parking, garden"
                className="form-input"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                Description <span className="font-normal text-stone-400">(optional — helps refine the estimate)</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. Newly renovated, luxury furnished, corner unit with garden view"
                className="form-input resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Calculator className="h-4 w-4" />
              {loading ? 'Calculating…' : 'Get Price Estimate'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-5 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-6 p-6 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-1">
                Estimated Market Value
              </p>
              <p className="text-4xl font-extrabold text-stone-900 tracking-tight">
                {formatINR(result.price)}
              </p>
              <p className="text-xs text-stone-400 mt-2">
                This is a model estimate based on comparable listings. Actual prices may vary.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
