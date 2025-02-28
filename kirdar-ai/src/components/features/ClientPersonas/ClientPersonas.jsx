import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Target, 
  AlertCircle, 
  BookOpen,
  Activity,
  PlusCircle,
  Edit,
  Trash2,
  DatabaseBackup,
  RefreshCw,
  CheckCircle2,
  Briefcase,
  Stethoscope,
  Scale,
  HeartHandshake,
  GraduationCap,
  ShoppingCart,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import CreatePersona from './CreatePersona';
import HandbookManager from './HandbookManager';
import Modal from '../../common/Modal/Modal';
import { DOMAIN_PROMPTS } from '../../../config/domainPrompts';

const DOMAIN_ICONS = {
  financial: Briefcase,
  medical: Stethoscope,
  legal: Scale,
  counseling: HeartHandshake,
  education: GraduationCap,
  sales: ShoppingCart
};

const ClientCard = ({ persona, onEdit, onDelete, isAdmin }) => {
  const navigate = useNavigate();

  const handleStartSimulation = () => {
    navigate('/simulation', { 
      state: { 
        type: 'persona',
        data: persona
      }
    });
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-sky-900/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-sky-400">{persona.name}</h3>
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(persona);
                }}
                className="text-gray-400 hover:text-sky-400 transition-colors"
                title="Edit Persona"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(persona);
                }}
                className="text-gray-400 hover:text-red-400 transition-colors"
                title="Delete Persona"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-sky-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-300">Annual Income: {persona.income}</p>
              <p className="text-gray-300">Current Portfolio: {persona.portfolio}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-sky-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-300">Goals: {persona.goals}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-sky-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-300">Concerns: {persona.concerns}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-sky-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-300">Knowledge Level: {persona.knowledgeLevel}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartSimulation}
          className="w-full bg-gradient-to-r from-sky-600 to-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:from-sky-500 hover:to-blue-600 flex items-center justify-center gap-2"
        >
          Start Simulation
          <Activity className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ClientPersonas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [personas, setPersonas] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('financial');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState('');

  const fetchPersonas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiUrl}/personas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch personas');
      }

      const data = await response.json();
      setPersonas(data);
    } catch (err) {
      console.error('Error fetching personas:', err);
      setError(err.message || 'Server connection failed. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  useEffect(() => {
    let filtered = personas;
    
    if (selectedDomain !== 'all') {
      filtered = filtered.filter(p => p.domain === selectedDomain);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.goals.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredPersonas(filtered);
  }, [personas, selectedDomain, selectedCategory, searchQuery]);

  const handleCreatePersona = async (newPersona) => {
    try {
      await fetchPersonas();
      setIsCreateModalOpen(false);
      setSuccessMessage('Persona created successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePersona = async (persona) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiUrl}/personas/${persona._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete persona');
      }

      setSuccessMessage('Persona deleted successfully!');
      await fetchPersonas();
      setIsDeleteModalOpen(false);
      setSelectedPersona(null);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetDatabase = async () => {
    try {
      setIsResetting(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiUrl}/personas/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset database');
      }

      const data = await response.json();
      setSuccessMessage('Database reset to default personas successfully!');
      await fetchPersonas();
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Reset error:', err);
      setError('Failed to reset database. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleGenerateMore = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setGenerationSuccess('');

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiUrl}/personas/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domain: selectedDomain,
          category: selectedCategory !== 'all' ? selectedCategory : null,
          numPersonas: 5 // Generate 5 personas at a time
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-4">
              Client Personas
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Select a client persona to begin a simulation. Each persona represents a unique client profile with specific financial goals, concerns, and knowledge levels.
            </p>
          </div>
          
          {user?.isAdmin && (
            <div className="flex gap-4">
              <button
                onClick={handleResetDatabase}
                disabled={isResetting}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <DatabaseBackup className="w-5 h-5" />
                    Reset Database
                  </>
                )}
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                Create Persona
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-6 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-500">{successMessage}</p>
          </div>
        )}

        {user?.isAdmin && (
          <div className="mb-8">
            <HandbookManager />
          </div>
        )}

        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-gray-800 text-white rounded-lg p-2"
            >
              <option value="all">All Domains</option>
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
              {DOMAIN_PROMPTS[selectedDomain]?.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <button
              onClick={handleGenerateMore}
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
                  Generate More Personas
                </>
              )}
            </button>
          </div>

          {generationSuccess && (
            <div className="flex items-center gap-2 text-green-400 bg-green-900/20 p-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              {generationSuccess}
            </div>
          )}
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search personas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 text-white rounded-lg p-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonas.map(persona => (
            <ClientCard
              key={persona._id}
              persona={persona}
              onEdit={(persona) => {
                setSelectedPersona(persona);
                setIsCreateModalOpen(true);
              }}
              onDelete={(persona) => {
                setSelectedPersona(persona);
                setIsDeleteModalOpen(true);
              }}
              isAdmin={user?.isAdmin}
            />
          ))}
        </div>

        {personas.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No personas found. Create one to get started!
            </p>
          </div>
        )}

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedPersona(null);
          }}
          title={selectedPersona ? "Edit Persona" : "Create New Persona"}
        >
          <CreatePersona
            onClose={() => {
              setIsCreateModalOpen(false);
              setSelectedPersona(null);
            }}
            onPersonaCreated={handleCreatePersona}
            initialData={selectedPersona}
          />
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPersona(null);
          }}
          title="Delete Persona"
        >
          <div className="p-6">
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this persona? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePersona(selectedPersona)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ClientPersonas;