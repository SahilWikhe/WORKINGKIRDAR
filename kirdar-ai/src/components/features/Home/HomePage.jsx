import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Brain, 
  Users, 
  Target, 
  Sparkles,
  MessageSquare,
  ArrowRight,
  Zap,
  Globe,
  ChartBar,
  Shield,
  Code,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Scale
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-sky-900/50 transition-all duration-300 hover:-translate-y-2 group">
    <div className="flex items-start gap-4">
      <div className="p-3 bg-sky-900/20 rounded-lg group-hover:bg-sky-900/30 transition-colors">
        <Icon className="w-6 h-6 text-sky-400" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const UseCaseCard = ({ icon: Icon, title, description, color }) => (
  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-sky-900/50 transition-all duration-300 hover:-translate-y-2">
    <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,1),rgba(4,6,12,1))]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow-delayed" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.03) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="relative">
                <Brain className="w-16 h-16 text-sky-400" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
                Kirdar.AI
              </span>
              <br />
              <span className="text-3xl md:text-4xl text-gray-300 mt-4 block">
                The Future of Interactive Simulations
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Transform training and learning with AI-powered interactive simulations. Create realistic scenarios 
              for any field, from healthcare to education, business to technology.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-8 py-4 rounded-full font-medium hover:from-sky-500 hover:to-blue-500 transition-all duration-300 flex items-center gap-2 group"
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/guest')}
                className="bg-gray-800 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-700 transition-all duration-300"
              >
                Try Demo
              </button>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            <FeatureCard
              icon={Brain}
              title="Advanced AI Interactions"
              description="Engage with sophisticated AI personas that adapt to your responses and provide natural, contextual interactions."
            />
            <FeatureCard
              icon={Zap}
              title="Real-time Feedback"
              description="Receive instant, personalized feedback to improve your skills and track your progress over time."
            />
            <FeatureCard
              icon={Target}
              title="Custom Scenarios"
              description="Create and customize scenarios specific to your industry, training needs, and learning objectives."
            />
          </div>

          {/* Use Cases */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-4">
              Endless Possibilities
            </h2>
            <p className="text-gray-400 text-lg mb-12">
              Discover how Kirdar.AI can transform training and learning across industries
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <UseCaseCard
                icon={Briefcase}
                title="Business"
                description="Sales training, customer service, negotiations, and leadership development"
                color="bg-blue-600"
              />
              <UseCaseCard
                icon={HeartPulse}
                title="Healthcare"
                description="Patient interactions, diagnostic training, and medical consultations"
                color="bg-red-600"
              />
              <UseCaseCard
                icon={GraduationCap}
                title="Education"
                description="Teacher training, student assessments, and educational scenarios"
                color="bg-green-600"
              />
              <UseCaseCard
                icon={Scale}
                title="Legal"
                description="Client consultations, case analysis, and legal procedure training"
                color="bg-purple-600"
              />
              <UseCaseCard
                icon={Shield}
                title="Security"
                description="Emergency response, security protocols, and crisis management"
                color="bg-orange-600"
              />
              <UseCaseCard
                icon={Globe}
                title="Cultural Training"
                description="Cross-cultural communication, language learning, and cultural sensitivity"
                color="bg-teal-600"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-24">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Training?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join organizations worldwide using Kirdar.AI to create immersive, effective learning experiences.
            </p>
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-8 py-4 rounded-full font-medium hover:from-sky-500 hover:to-blue-500 transition-all duration-300"
            >
              {user ? 'Go to Dashboard' : 'Start Free Trial'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;