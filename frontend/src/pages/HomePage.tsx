import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, BedDouble, TrendingUp, ChevronDown, Star, CheckCircle2 } from 'lucide-react';

const CITIES = ['Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Chennai'];
const TYPES = ['Apartment', 'Villa', 'Independent House', 'Studio'];

const STATS = [
  { value: '2,000+', label: 'Properties Analyzed' },
  { value: '86%', label: 'Prediction Accuracy' },
  { value: '5', label: 'Major Cities' },
  { value: '3', label: 'ML Models' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Enter property details',
    desc: 'Provide location, size, bedrooms, and amenities.',
  },
  {
    step: '02',
    title: 'Our model analyzes the market',
    desc: 'We compare thousands of similar listings to find the right price range.',
  },
  {
    step: '03',
    title: 'Get an instant estimate',
    desc: 'Receive an accurate price prediction backed by real market data.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [beds, setBeds] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('location', city);
    if (type) params.set('type', type);
    if (beds) params.set('bedrooms', beds);
    navigate(`/recommend?${params.toString()}`);
  };

  return (
    <div className="w-full">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-stone-100">
        {/* subtle grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #f5f5f4 1px, transparent 1px), linear-gradient(to bottom, #f5f5f4 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="section-label mb-4">AI-powered price intelligence</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 leading-tight mb-5 tracking-tight">
              Find the true value of <br />
              any property — instantly.
            </h1>
            <p className="text-stone-500 text-lg mb-10 leading-relaxed">
              PropPredict uses machine learning trained on thousands of real listings
              to give you accurate, unbiased price estimates across India's top cities.
            </p>

            {/* Search card */}
            <form
              onSubmit={handleSearch}
              className="bg-white border border-stone-200 rounded-xl shadow-card p-1 flex flex-col sm:flex-row gap-1"
            >
              <div className="flex items-center gap-2 flex-1 px-3 py-2 border-b sm:border-b-0 sm:border-r border-stone-100">
                <MapPin className="h-4 w-4 text-stone-400 shrink-0" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-sm text-stone-700 bg-transparent focus:outline-none"
                >
                  <option value="">Any city</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1 px-3 py-2 border-b sm:border-b-0 sm:border-r border-stone-100">
                <ChevronDown className="h-4 w-4 text-stone-400 shrink-0" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full text-sm text-stone-700 bg-transparent focus:outline-none"
                >
                  <option value="">Any type</option>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1 px-3 py-2 border-b sm:border-b-0 sm:border-r border-stone-100">
                <BedDouble className="h-4 w-4 text-stone-400 shrink-0" />
                <select
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  className="w-full text-sm text-stone-700 bg-transparent focus:outline-none"
                >
                  <option value="">Any beds</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} BHK</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary rounded-lg px-6 shrink-0">
                <Search className="h-4 w-4" />
                Search
              </button>
            </form>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2 mt-5">
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => navigate(`/recommend?location=${c}`)}
                  className="px-3 py-1 text-xs font-medium text-stone-600 border border-stone-200 rounded-full hover:border-amber-400 hover:text-amber-700 transition-colors bg-white"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-stone-700">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center px-4">
                <p className="text-2xl font-bold text-amber-400">{value}</p>
                <p className="text-sm text-stone-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two main actions ──────────────────────────────────── */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Predict */}
            <div className="card p-8 flex flex-col">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-5">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Price Estimator</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-grow">
                Enter property details and get an AI-backed market valuation in seconds.
                Useful for buyers, sellers, and investors.
              </p>
              <Link to="/predict" className="btn-primary self-start">
                Estimate a Price
              </Link>
            </div>

            {/* Recommend */}
            <div className="card p-8 flex flex-col">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-5">
                <Search className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Property Recommendations</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-grow">
                Tell us your budget and location preference. We'll match you with
                the most relevant listings from our database.
              </p>
              <Link to="/recommend" className="btn-primary self-start">
                Find Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="bg-white border-y border-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-3">How it works</p>
          <h2 className="text-2xl font-bold text-stone-900 mb-10">
            Get a price estimate in under a minute
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <span className="text-3xl font-extrabold text-stone-100 leading-none select-none">{step}</span>
                <div>
                  <h4 className="font-semibold text-stone-900 mb-1">{title}</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What our model covers ─────────────────────────────── */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-start md:gap-16">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <p className="section-label mb-3">Model coverage</p>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                Built on real housing market data
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Our pipeline trains on thousands of property listings across major Indian cities.
                We account for location, size, age, amenities, and furnishing status — 
                the same factors a seasoned property agent would consider.
              </p>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-3">
              {[
                'Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Chennai',
                'Apartments', 'Villas', 'Independent Houses',
                'Furnishing Status', 'Property Age',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-stone-700">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center">
              <Star className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-stone-900 text-sm">PropPredict</span>
          </div>
          <p className="text-stone-400 text-xs">
            © {new Date().getFullYear()} PropPredict · Prices are model estimates, not appraisals.
          </p>
        </div>
      </footer>
    </div>
  );
}
