const DOMAIN_PROMPTS = {
    financial: {
      name: 'Financial',
      role: 'financial mentor',
      client: 'investor',
      context: 'financial planning and investment',
      topics: 'financial goals and investment strategies',
      concerns: 'financial risks and market uncertainties',
      mentorStyle: 'seasoned financial educator coaching advisors',
      categories: [
        "Investment Planning",
        "Retirement Planning",
        "Estate Planning",
        "Tax Planning",
        "Risk Management"
      ],
      scenarioPrompts: {
        'Estate Planning': {
          clientStyle: 'wealthy individual concerned with legacy and charitable impact',
          contextImportance: 'high',
          keyTopics: [
            'charitable giving structures',
            'tax efficiency',
            'family wealth preservation',
            'philanthropic impact'
          ]
        }
      }
    },
    sales: {
      role: "SALES REPRESENTATIVE",
      client: "CUSTOMER",
      context: "sales consultation",
      expertise: "product knowledge",
      topics: "product and service offerings",
      concerns: "purchase concerns",
      categories: [
        "Automotive Sales",
        "Insurance Sales",
        "Real Estate Sales",
        "Software/Tech Sales",
        "Retail Sales",
        "B2B Sales",
        "Medical Device Sales"
      ]
    },
    medical: {
      name: 'Medical',
      role: 'healthcare professional',
      client: 'patient',
      context: 'healthcare and medical consultations',
      topics: 'health goals, medical history, and lifestyle changes',
      concerns: 'health-related concerns and medical conditions',
      mentorStyle: 'experienced healthcare educator',
      clientPrompt: `You are a patient seeking medical advice. Your role:
      1. Express your health concerns clearly
      2. Ask questions about your condition
      3. Share relevant medical history
      4. Respond to healthcare recommendations
      5. Stay within your knowledge level`,
      mentorPrompt: `You are an experienced healthcare educator mentoring medical professionals.
      1. Evaluate the professional's patient communication
      2. Assess medical advice accuracy and appropriateness
      3. Guide on best practices in patient care
      4. Provide feedback on bedside manner
      5. Highlight areas for improvement`
    },
    legal: {
      role: "LAWYER",
      client: "CLIENT",
      context: "legal consultation",
      expertise: "legal knowledge",
      topics: "legal matters",
      concerns: "legal concerns",
      categories: [
        "Criminal Defense",
        "Family Law",
        "Corporate Law",
        "Real Estate Law",
        "Immigration Law"
      ]
    },
    counseling: {
      role: "THERAPIST",
      client: "CLIENT",
      context: "therapy session",
      expertise: "therapeutic knowledge",
      topics: "mental health topics",
      concerns: "personal concerns",
      categories: [
        "Individual Therapy",
        "Couples Counseling",
        "Family Therapy",
        "Grief Counseling",
        "Addiction Recovery"
      ]
    },
    education: {
      role: "TEACHER",
      client: "STUDENT/PARENT",
      context: "educational consultation",
      expertise: "educational knowledge",
      topics: "educational matters",
      concerns: "academic concerns",
      categories: [
        "Elementary Education",
        "Secondary Education",
        "Special Education",
        "College Counseling",
        "Career Guidance"
      ]
    }
  };
  
  const generateSystemPrompt = (domain, data, role = 'client') => {
    const domainConfig = DOMAIN_PROMPTS[domain];
    if (!domainConfig) {
      throw new Error(`Invalid domain: ${domain}`);
    }

    if (role === 'client') {
      return `You are a ${domainConfig.client} seeking ${domainConfig.context} advice. 
      
Your profile:
- Name: ${data.name}
- Age: ${data.age}
- Goals: ${data.goals}
- Concerns: ${data.concerns}
- Knowledge Level: ${data.knowledgeLevel}

IMPORTANT GUIDELINES:
1. You are ALWAYS the ${domainConfig.client}, never break character
2. Never acknowledge being AI or virtual
3. Express genuine concerns about ${data.concerns}
4. Ask relevant questions about your situation
5. Keep responses natural and conversational
6. Stay consistent with your profile details
7. Show appropriate knowledge level (${data.knowledgeLevel})`;
    }

    // Mentor role prompt remains the same
    return domainConfig.mentorPrompt || `You are an experienced ${domainConfig.role} mentor...`;
  };
  
  module.exports = {
    DOMAIN_PROMPTS,
    generateSystemPrompt
  };