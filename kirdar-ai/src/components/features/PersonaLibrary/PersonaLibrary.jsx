import React, { useState } from 'react';
import { RefreshCw, UserPlus } from 'lucide-react';

const PersonaLibrary = () => {
  // Add to existing state
  const [selectedDomain, setSelectedDomain] = useState('financial');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [numPersonas, setNumPersonas] = useState(1);
  const [description, setDescription] = useState('');

  const handleGeneratePersonas = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch('/api/personas/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domain: selectedDomain,
          category: selectedCategory !== 'all' ? selectedCategory : null,
          numPersonas,
          description
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate personas');
      }

      const newPersonas = await response.json();
      setPersonas(prev => [...prev, ...newPersonas]);
      setGenerationSuccess('New personas generated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 space-y-4">
        {/* Domain and Category filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-gray-800 text-white rounded-lg p-2"
          >
            {Object.entries(DOMAIN_PROMPTS).map(([key, value]) => (
              <option key={key} value={key}>{value.name}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 text-white rounded-lg p-2"
          >
            <option value="all">All Categories</option>
            {DOMAIN_PROMPTS[selectedDomain].categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            max="20"
            value={numPersonas}
            onChange={(e) => setNumPersonas(Number(e.target.value))}
            className="bg-gray-800 text-white rounded-lg p-2"
            placeholder="Number of personas"
          />
        </div>

        {/* Description input */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg p-2"
          placeholder="Optional: Describe specific characteristics for the personas..."
          rows={3}
        />

        {/* Generate button */}
        <button
          onClick={handleGeneratePersonas}
          disabled={isGenerating}
          className="bg-sky-600 hover:bg-sky-700 text-white rounded-lg p-2 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Generate New Personas
            </>
          )}
        </button>
      </div>

      {/* Existing persona grid */}
    </div>
  );
};

export default PersonaLibrary;
