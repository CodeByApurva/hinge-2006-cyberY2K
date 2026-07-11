import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import Avatar from '../../components/common/Avatar';
import { CITIES, PROFESSIONS, EDUCATION_OPTIONS, RELATIONSHIP_GOALS, INTERESTS_LIST } from '../../utils/constants';
import './Discover.css';

const ITEMS_PER_PAGE = 6;

export default function Discover() {
  const { users, sentInterests, expressInterest, skipUser, skippedUsers } = useApp();
  const navigate = useNavigate();

  // Filters State
  const [ageMin, setAgeMin] = useState<number>(18);
  const [ageMax, setAgeMax] = useState<number>(50);
  const [city, setCity] = useState<string>('');
  const [profession, setProfession] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [relationshipGoal, setRelationshipGoal] = useState<string>('');
  const [interest, setInterest] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset Filters
  const handleReset = () => {
    setAgeMin(18);
    setAgeMax(50);
    setCity('');
    setProfession('');
    setEducation('');
    setRelationshipGoal('');
    setInterest('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Filtered Users List (excluding current user 'user-self' and already skipped users)
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (u.id === 'user-self') return false;
      if (skippedUsers.includes(u.id)) return false;

      // Search Query (matches display name or about me)
      if (searchQuery && !u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) && !u.aboutMe.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Age filter
      if (u.age < ageMin || u.age > ageMax) return false;

      // City filter
      if (city && u.city !== city) return false;

      // Profession filter
      if (profession && u.profession !== profession) return false;

      // Education filter
      if (education && u.education !== education) return false;

      // Relationship Goal filter
      if (relationshipGoal && u.relationshipGoal !== relationshipGoal) return false;

      // Interest filter
      if (interest && !u.interests.includes(interest)) return false;

      return true;
    });
  }, [users, skippedUsers, searchQuery, ageMin, ageMax, city, profession, education, relationshipGoal, interest]);

  // Paginated Users
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handleInterest = (userId: string) => {
    const isNewMatch = expressInterest(userId);
    if (isNewMatch) {
      alert("It's a Match! 🎉 You expressed interest and they like you too. Go to Matches page or Messages page to talk!");
    } else {
      alert("Interest Sent! ❤️ We'll notify you if they express interest back.");
    }
  };

  return (
    <div className="discover-page animate-fadeIn">
      {/* Search Header Banner */}
      <div className="discover-header xp-panel mb-12">
        <div className="xp-panel__header">
          <span className="xp-panel__header-icon">🔎</span>
          Search Member Directory
        </div>
        <div className="xp-panel__body">
          <div className="discover-search-row">
            <input 
              type="text" 
              className="xp-input search-input" 
              placeholder="Search by keywords or name (e.g. 'artist', 'chef')..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
            <button className="xp-btn xp-btn--primary" onClick={() => setCurrentPage(1)}>Search Now</button>
            <button className="xp-btn" onClick={handleReset}>Clear All</button>
          </div>
        </div>
      </div>

      <div className="discover-content">
        {/* Left Side: Filter Form */}
        <div className="discover-sidebar xp-panel">
          <div className="xp-panel__header">
            <span className="xp-panel__header-icon">🔧</span>
            Filter Directory
          </div>
          <div className="xp-panel__body">
            <form className="filters-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group-filter">
                <label>Age Range:</label>
                <div className="age-inputs">
                  <input 
                    type="number" 
                    min="18" 
                    max="100" 
                    className="xp-input age-val" 
                    value={ageMin} 
                    onChange={(e) => { setAgeMin(Number(e.target.value)); setCurrentPage(1); }}
                  />
                  <span>to</span>
                  <input 
                    type="number" 
                    min="18" 
                    max="100" 
                    className="xp-input age-val" 
                    value={ageMax} 
                    onChange={(e) => { setAgeMax(Number(e.target.value)); setCurrentPage(1); }}
                  />
                </div>
              </div>

              <div className="form-group-filter">
                <label>City / Location:</label>
                <select 
                  className="xp-select w-full"
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">-- All Locations --</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group-filter">
                <label>Profession:</label>
                <select 
                  className="xp-select w-full"
                  value={profession}
                  onChange={(e) => { setProfession(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">-- All Professions --</option>
                  {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="form-group-filter">
                <label>Education:</label>
                <select 
                  className="xp-select w-full"
                  value={education}
                  onChange={(e) => { setEducation(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">-- All Education --</option>
                  {EDUCATION_OPTIONS.map(ed => <option key={ed} value={ed}>{ed}</option>)}
                </select>
              </div>

              <div className="form-group-filter">
                <label>Relationship Goal:</label>
                <select 
                  className="xp-select w-full"
                  value={relationshipGoal}
                  onChange={(e) => { setRelationshipGoal(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">-- All Goals --</option>
                  {RELATIONSHIP_GOALS.map(rg => <option key={rg} value={rg}>{rg}</option>)}
                </select>
              </div>

              <div className="form-group-filter">
                <label>Interests / Hobbies:</label>
                <select 
                  className="xp-select w-full"
                  value={interest}
                  onChange={(e) => { setInterest(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">-- All Interests --</option>
                  {INTERESTS_LIST.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Profile Cards Grid */}
        <div className="discover-grid-container">
          {filteredUsers.length === 0 ? (
            <div className="no-results-panel xp-panel">
              <div className="xp-panel__body text-center p-20">
                <p className="text-bold text-danger">⚠️ No profiles matched your search criteria.</p>
                <p className="mt-8">Try adjusting your filters or clearing the search query.</p>
                <button className="xp-btn mt-12" onClick={handleReset}>Reset All Filters</button>
              </div>
            </div>
          ) : (
            <>
              <div className="results-summary">
                Showing {Math.min(filteredUsers.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} - {Math.min(filteredUsers.length, currentPage * ITEMS_PER_PAGE)} of {filteredUsers.length} active profiles
              </div>
              
              <div className="discover-cards-grid">
                {paginatedUsers.map(u => {
                  const isInterested = sentInterests.includes(u.id);

                  return (
                    <div key={u.id} className="profile-grid-card xp-panel">
                      <div className="xp-panel__header truncate">
                        <span className={`status-dot status-dot--${u.status.toLowerCase()}`} />
                        {u.displayName}
                      </div>
                      <div className="xp-panel__body card-layout">
                        <div className="card-media">
                          <Avatar name={u.displayName} size={64} status={u.status} />
                          <div className="online-tag text-small text-muted mt-4">Active: {u.status}</div>
                        </div>
                        <div className="card-info">
                          <div className="card-primary-info">
                            <strong>{u.age} yrs old</strong> • {u.city}
                          </div>
                          <div className="card-job truncate">{u.profession}</div>
                          <div className="card-goal truncate">{u.relationshipGoal}</div>
                          <p className="card-bio-short">{u.aboutMe}</p>
                        </div>
                      </div>
                      
                      <div className="card-footer-actions">
                        <button 
                          className="xp-btn"
                          onClick={() => navigate(`/profile/${u.id}`)}
                          title="View Scrapbook & Testimonials"
                        >
                          👁️ Scrapbook
                        </button>
                        <button 
                          className="xp-btn"
                          onClick={() => skipUser(u.id)}
                          title="Skip and Hide Profile"
                        >
                          ✕ Skip
                        </button>
                        <button 
                          className={`xp-btn ${isInterested ? '' : 'xp-btn--primary'}`}
                          onClick={() => handleInterest(u.id)}
                          disabled={isInterested}
                          title="Send Interest to Match"
                        >
                          {isInterested ? '❤️ Sent' : '❤️ Interest'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Classic 2006 Pagination Toolbar */}
              <div className="pagination-toolbar xp-panel mt-12">
                <div className="xp-panel__body paginator-body">
                  <button 
                    className="xp-btn" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    ◀ Prev Page
                  </button>
                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(num => (
                      <button 
                        key={num} 
                        className={`page-num-btn ${currentPage === num ? 'active' : ''}`}
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <button 
                    className="xp-btn" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next Page ▶
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
