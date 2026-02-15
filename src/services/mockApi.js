
const STORAGE_KEY = 'globopersona_data';

const initializeMockData = () => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) {
    const mockData = {
      campaigns: [
        {
          id: '1',
          name: 'Q1 Product Launch Campaign',
          status: 'running',
          createdAt: '2026-02-10T10:00:00Z',
          contactsCount: 150,
          sentCount: 120,
          openCount: 85,
          clickCount: 42,
          replyCount: 15,
          bounceCount: 3,
          openRate: 70.8,
          clickRate: 35.0,
          replyRate: 12.5,
          campaignInfo: {
            companyDescription: 'Leading SaaS provider in project management',
            productService: 'AI-powered project management platform',
            offer: '30% off annual subscription for early adopters',
            goal: 'lead_generation'
          },
          targetAudience: {
            industries: ['Technology', 'Startups'],
            jobRoles: ['CTO', 'VP Engineering', 'Product Manager'],
            companySizes: ['51-200', '201-500'],
            locations: ['United States', 'Canada']
          },
          emailTemplate: {
            subject: 'Transform your team\'s productivity with AI',
            body: 'Hi {{firstName}},\n\nI noticed {{company}} is scaling fast. Our AI-powered platform helps teams like yours ship 40% faster.\n\nInterested in a quick demo?\n\nBest,\nTeam'
          }
        },
        {
          id: '2',
          name: 'Customer Feedback Survey',
          status: 'completed',
          createdAt: '2026-01-25T14:30:00Z',
          contactsCount: 500,
          sentCount: 500,
          openCount: 380,
          clickCount: 220,
          replyCount: 95,
          bounceCount: 8,
          openRate: 76.0,
          clickRate: 44.0,
          replyRate: 19.0,
          campaignInfo: {
            companyDescription: 'E-commerce platform',
            productService: 'Customer satisfaction survey',
            offer: '$50 gift card for completing survey',
            goal: 'feedback'
          }
        },
        {
          id: '3',
          name: 'Partnership Outreach - Series A',
          status: 'draft',
          createdAt: '2026-02-12T09:15:00Z',
          contactsCount: 75,
          sentCount: 0,
          openCount: 0,
          clickCount: 0,
          replyCount: 0,
          bounceCount: 0,
          openRate: 0,
          clickRate: 0,
          replyRate: 0
        }
      ],
      contacts: [
        {
          id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@infosys.com',
          company: 'Infosys Technologies',
          role: 'CTO',
          valid: true,
          tags: ['technology', 'decision-maker'],
          uploadedAt: '2026-02-10T10:00:00Z'
        },
        {
          id: '2',
          name: 'Priya Sharma',
          email: 'priya.s@flipkart.com',
          company: 'Flipkart India',
          role: 'VP Product',
          valid: true,
          tags: ['ecommerce', 'product'],
          uploadedAt: '2026-02-10T10:00:00Z'
        }
      ],
      emailLists: [
        {
          id: 'el-1',
          name: 'Tech Decision Makers',
          description: 'Senior technology leaders at mid-to-large enterprises',
          contacts: [
            { firstName: 'Alex', lastName: 'Chen', email: 'alex.chen@techcorp.io', company: 'TechCorp', jobTitle: 'CTO' },
            { firstName: 'Maria', lastName: 'Santos', email: 'maria.s@innovate.com', company: 'Innovate Inc', jobTitle: 'VP Engineering' },
            { firstName: 'James', lastName: 'Wilson', email: 'jwilson@dataflow.co', company: 'DataFlow', jobTitle: 'Director of IT' },
            { firstName: 'Priya', lastName: 'Sharma', email: 'priya@cloudnine.dev', company: 'CloudNine', jobTitle: 'Head of Infrastructure' }
          ],
          contactsCount: 4,
          fieldsCount: 5,
          createdAt: '2026-02-08T09:00:00Z'
        },
        {
          id: 'el-2',
          name: 'Startup Founders Q1',
          description: 'Early-stage startup founders for outreach campaign',
          contacts: [
            { firstName: 'Ryan', lastName: 'Park', email: 'ryan@launchpad.io', company: 'Launchpad', jobTitle: 'CEO' },
            { firstName: 'Emma', lastName: 'Liu', email: 'emma@buildfast.co', company: 'BuildFast', jobTitle: 'Founder' },
            { firstName: 'Noah', lastName: 'Adams', email: 'noah@scaleup.com', company: 'ScaleUp', jobTitle: 'Co-Founder' }
          ],
          contactsCount: 3,
          fieldsCount: 5,
          createdAt: '2026-02-12T14:30:00Z'
        },
        {
          id: 'el-3',
          name: 'Marketing Managers',
          description: 'Marketing leads interested in campaign automation',
          contacts: [
            { firstName: 'Sophie', lastName: 'Martin', email: 'sophie@brandco.com', company: 'BrandCo', jobTitle: 'Marketing Director' },
            { firstName: 'David', lastName: 'Kim', email: 'dkim@growthlab.io', company: 'GrowthLab', jobTitle: 'Head of Marketing' }
          ],
          contactsCount: 2,
          fieldsCount: 5,
          createdAt: '2026-02-14T11:00:00Z'
        }
      ],
      aiConfigurations: [],
      generatedEmails: [],
      senderAccounts: [
        {
          id: 'acc1',
          name: 'madhu',
          email: 'kotlamadhu0614@gmail.com',
          verified: true,
          isDefault: true
        },
        {
          id: 'acc2',
          name: 'madhu',
          email: 'madhu.k@globopersona.com',
          verified: true,
          isDefault: false
        },
        {
          id: 'acc3',
          name: 'test',
          email: 'test@globopersona.com',
          verified: true,
          isDefault: false
        }
      ]
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    return mockData;
  }
  const data = JSON.parse(existingData);
  const defaultSenderAccounts = [
    { id: 'acc1', name: 'Primary', email: 'noreply@globopersona.com', verified: true, isDefault: true },
    { id: 'acc2', name: 'Support', email: 'support@globopersona.com', verified: true, isDefault: false },
    { id: 'acc3', name: 'Marketing', email: 'marketing@globopersona.com', verified: true, isDefault: false },
  ];
  if (!data.senderAccounts || data.senderAccounts.length === 0) {
    data.senderAccounts = defaultSenderAccounts;
    saveData(data);
  }
  if (!data.emailLists) data.emailLists = [];
  const seedEmailLists = [
    {
      id: 'el-1',
      name: 'Tech Leaders India',
      description: 'Senior technology leaders at top Indian IT companies',
      contacts: [
        { firstName: 'Arjun', lastName: 'Patel', email: 'arjun.patel@tcs.com', company: 'Tata Consultancy Services', jobTitle: 'CTO' },
        { firstName: 'Kavya', lastName: 'Reddy', email: 'kavya.r@wipro.com', company: 'Wipro Technologies', jobTitle: 'VP Engineering' },
        { firstName: 'Vikram', lastName: 'Singh', email: 'vikram@hcltech.com', company: 'HCL Technologies', jobTitle: 'Director of IT' },
        { firstName: 'Ananya', lastName: 'Iyer', email: 'ananya@techm.com', company: 'Tech Mahindra', jobTitle: 'Head of Infrastructure' }
      ],
      contactsCount: 4,
      fieldsCount: 5,
      createdAt: '2026-02-08T09:00:00Z'
    },
    {
      id: 'el-2',
      name: 'Startup Founders Bangalore',
      description: 'Early-stage startup founders from Bangalore ecosystem',
      contacts: [
        { firstName: 'Rohan', lastName: 'Mehta', email: 'rohan@zerodha.com', company: 'Zerodha', jobTitle: 'CEO' },
        { firstName: 'Sneha', lastName: 'Gupta', email: 'sneha@razorpay.com', company: 'Razorpay', jobTitle: 'Founder' },
        { firstName: 'Aditya', lastName: 'Verma', email: 'aditya@cred.club', company: 'CRED', jobTitle: 'Co-Founder' }
      ],
      contactsCount: 3,
      fieldsCount: 5,
      createdAt: '2026-02-12T14:30:00Z'
    },
    {
      id: 'el-3',
      name: 'Marketing Heads Mumbai',
      description: 'Marketing leaders from Mumbai-based companies',
      contacts: [
        { firstName: 'Neha', lastName: 'Kapoor', email: 'neha@zomato.com', company: 'Zomato', jobTitle: 'Marketing Director' },
        { firstName: 'Rahul', lastName: 'Joshi', email: 'rahul@swiggy.in', company: 'Swiggy', jobTitle: 'Head of Marketing' }
      ],
      contactsCount: 2,
      fieldsCount: 5,
      createdAt: '2026-02-14T11:00:00Z'
    }
  ];
  let merged = false;
  seedEmailLists.forEach(seed => {
    if (!data.emailLists.find(l => l.id === seed.id)) {
      data.emailLists.push(seed);
      merged = true;
    }
  });
  if (merged) saveData(data);
  return data;
};

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const getData = () => {
  return initializeMockData();
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const campaignService = {
  async getAll(filters = {}) {
    await delay();
    const data = getData();
    let campaigns = data.campaigns;

    if (filters.status && filters.status !== 'all') {
      campaigns = campaigns.filter(c => c.status === filters.status);
    }
    if (filters.search) {
      campaigns = campaigns.filter(c => 
        c.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return { data: campaigns, total: campaigns.length };
  },

  async getById(id) {
    await delay();
    const data = getData();
    const campaign = data.campaigns.find(c => c.id === id);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    return campaign;
  },

  async create(campaignData) {
    await delay();
    const data = getData();
    const newCampaign = {
      id: Date.now().toString(),
      ...campaignData,
      createdAt: new Date().toISOString(),
      sentCount: 0,
      openCount: 0,
      clickCount: 0,
      replyCount: 0,
      bounceCount: 0,
      openRate: 0,
      clickRate: 0,
      replyRate: 0,
    };
    data.campaigns.unshift(newCampaign);
    saveData(data);
    return newCampaign;
  },

  async update(id, updates) {
    await delay();
    const data = getData();
    const index = data.campaigns.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Campaign not found');
    }
    data.campaigns[index] = { ...data.campaigns[index], ...updates };
    saveData(data);
    return data.campaigns[index];
  },

  async delete(id) {
    await delay();
    const data = getData();
    data.campaigns = data.campaigns.filter(c => c.id !== id);
    saveData(data);
    return { success: true };
  },

  async validate(campaignData) {
    await delay(500);
    const spamScore = Math.floor(Math.random() * 30) + 10; // 10-40
    const deliverability = Math.floor(Math.random() * 15) + 85; // 85-100
    const predictedOpenRate = Math.floor(Math.random() * 20) + 50; // 50-70

    const issues = [];
    if (campaignData.emailTemplate?.body?.includes('FREE') || 
        campaignData.emailTemplate?.body?.includes('CLICK HERE')) {
      issues.push({
        type: 'warning',
        message: 'Spam trigger words detected: "FREE", "CLICK HERE"'
      });
    }

    return {
      spamScore,
      riskLevel: spamScore < 20 ? 'low' : spamScore < 35 ? 'medium' : 'high',
      deliverability,
      predictedOpenRate,
      issues,
      invalidEmails: 0,
      missingVariables: []
    };
  },

  async send(campaignData) {
    await delay(800);
    const data = getData();
    const campaign = await this.create({
      ...campaignData,
      status: 'running'
    });
    return campaign;
  },

  async getAnalytics(id, dateRange = '30d') {
    await delay();
    const campaign = await this.getById(id);
    
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const timeSeriesData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      timeSeriesData.push({
        date: date.toISOString().split('T')[0],
        sent: Math.floor(Math.random() * 20) + 5,
        opens: Math.floor(Math.random() * 15) + 3,
        clicks: Math.floor(Math.random() * 8) + 1,
        replies: Math.floor(Math.random() * 3)
      });
    }

    return {
      ...campaign,
      timeSeriesData,
      deviceBreakdown: {
        desktop: 65,
        mobile: 30,
        tablet: 5
      },
      locationBreakdown: [
        { country: 'United States', percentage: 45 },
        { country: 'Canada', percentage: 25 },
        { country: 'United Kingdom', percentage: 15 },
        { country: 'Other', percentage: 15 }
      ]
    };
  }
};

export const contactService = {
  async uploadCSV(file, contacts) {
    await delay(1000);
    const data = getData();
    
    const newContacts = contacts.map((contact, index) => ({
      id: `${Date.now()}-${index}`,
      ...contact,
      valid: this.validateEmail(contact.email),
      uploadedAt: new Date().toISOString(),
      tags: []
    }));

    data.contacts.push(...newContacts);
    saveData(data);

    return {
      total: contacts.length,
      valid: newContacts.filter(c => c.valid).length,
      invalid: newContacts.filter(c => !c.valid).length,
      contacts: newContacts
    };
  },

  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  async getAll() {
    await delay();
    const data = getData();
    return data.contacts;
  }
};

export const dashboardService = {
  async getMetrics(dateRange = '30d') {
    await delay();
    const data = getData();
    
    const totalCampaigns = data.campaigns.length;
    const activeCampaigns = data.campaigns.filter(c => c.status === 'running').length;
    
    const totalSent = data.campaigns.reduce((sum, c) => sum + c.sentCount, 0);
    const totalOpens = data.campaigns.reduce((sum, c) => sum + c.openCount, 0);
    const totalClicks = data.campaigns.reduce((sum, c) => sum + c.clickCount, 0);
    const totalReplies = data.campaigns.reduce((sum, c) => sum + c.replyCount, 0);
    
    const avgOpenRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0;
    const avgClickRate = totalOpens > 0 ? (totalClicks / totalOpens) * 100 : 0;
    const avgReplyRate = totalSent > 0 ? (totalReplies / totalSent) * 100 : 0;

    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const chartData = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      chartData.push({
        date: dateStr,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sent: Math.floor(totalSent / Math.max(days, 1)) + Math.floor(Math.random() * 5),
        opens: Math.floor(totalOpens / Math.max(days, 1)) + Math.floor(Math.random() * 4),
        clicks: Math.floor(totalClicks / Math.max(days, 1)) + Math.floor(Math.random() * 2),
        replies: Math.floor(totalReplies / Math.max(days, 1)),
      });
    }

    const statusBreakdown = data.campaigns.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalCampaigns,
      activeCampaigns,
      totalContacts: data.contacts.length,
      totalSent,
      totalOpens,
      totalClicks,
      totalReplies,
      openRate: avgOpenRate.toFixed(1),
      clickRate: avgClickRate.toFixed(1),
      replyRate: avgReplyRate.toFixed(1),
      recentCampaigns: data.campaigns.slice(0, 5),
      chartData: chartData.slice(-14),
      statusBreakdown,
    };
  }
};

export const emailListService = {
  async getAll() {
    await delay();
    const data = getData();
    return data.emailLists || [];
  },

  async getById(id) {
    await delay();
    const data = getData();
    const list = (data.emailLists || []).find(l => l.id === id);
    if (!list) {
      throw new Error('Email list not found');
    }
    return list;
  },

  async create(name, description, contacts) {
    await delay();
    const data = getData();
    if (!data.emailLists) data.emailLists = [];

    const newList = {
      id: Date.now().toString(),
      name,
      description,
      contacts,
      createdAt: new Date().toISOString(),
      contactsCount: contacts.length,
      fieldsCount: Object.keys(contacts[0] || {}).length
    };

    data.emailLists.unshift(newList);
    saveData(data);
    return newList;
  },

  async update(id, updates) {
    await delay();
    const data = getData();
    const index = (data.emailLists || []).findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Email list not found');
    }
    data.emailLists[index] = { ...data.emailLists[index], ...updates };
    saveData(data);
    return data.emailLists[index];
  },

  async delete(id) {
    await delay();
    const data = getData();
    data.emailLists = (data.emailLists || []).filter(l => l.id !== id);
    saveData(data);
    return { success: true };
  }
};

export const aiConfigService = {
  async save(campaignId, config) {
    await delay();
    const data = getData();
    if (!data.aiConfigurations) data.aiConfigurations = [];

    const existingIndex = data.aiConfigurations.findIndex(c => c.campaignId === campaignId);
    
    const aiConfig = {
      campaignId,
      ...config,
      status: 'configured',
      createdAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      data.aiConfigurations[existingIndex] = aiConfig;
    } else {
      data.aiConfigurations.push(aiConfig);
    }

    saveData(data);
    return aiConfig;
  },

  async get(campaignId) {
    await delay();
    const data = getData();
    return (data.aiConfigurations || []).find(c => c.campaignId === campaignId);
  },

  async delete(campaignId) {
    await delay();
    const data = getData();
    data.aiConfigurations = (data.aiConfigurations || []).filter(c => c.campaignId !== campaignId);
    saveData(data);
    return { success: true };
  }
};

export const emailGenerationService = {
  async generateForContacts(campaignId, contactIds, aiConfig) {
    await delay(2000); // Simulate AI generation time
    const data = getData();
    if (!data.generatedEmails) data.generatedEmails = [];

    const companyInfo = aiConfig?.companyInfo?.trim() || 'your company';
    const productService = aiConfig?.productService?.trim() || 'our solutions';

    const generatedEmails = (contactIds || []).map(contactId => {
      const confidence = Math.floor(Math.random() * 15) + 82; // 82-97%
      const tokens = Math.floor(Math.random() * 200) + 600; // 600-800 tokens

      const personalizationFields = [
        'First Name',
        'Job Title',
        'Company Name',
        'Industry',
        'City Location',
        'State Location',
        'Website'
      ];

      const usedFields = personalizationFields
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 5);

      return {
        id: `email-${Date.now()}-${contactId}`,
        campaignId: campaignId || 'draft',
        contactId,
        subject: `Exploring Synergies Between ${companyInfo} and Your Organization`,
        body: `Hi {{firstName}},\n\nI believe there's an opportunity for us to collaborate, especially considering your projects likely require ${productService}. I'd love to invite you to share any upcoming needs for a quote or perhaps join me for lunch at our office to discuss our services further.\n\nBest regards,\nTeam`,
        personalizationFields: usedFields,
        confidence,
        tokens,
        status: 'pending',
        generatedAt: new Date().toISOString()
      };
    });

    data.generatedEmails.push(...generatedEmails);
    saveData(data);
    return generatedEmails;
  },

  async getByCampaign(campaignId) {
    await delay();
    const data = getData();
    return (data.generatedEmails || []).filter(e => e.campaignId === campaignId);
  },

  async updateStatus(emailId, status) {
    await delay();
    const data = getData();
    const index = (data.generatedEmails || []).findIndex(e => e.id === emailId);
    if (index === -1) {
      throw new Error('Email not found');
    }
    data.generatedEmails[index].status = status;
    saveData(data);
    return data.generatedEmails[index];
  },

  async regenerate(emailId, aiConfig) {
    await delay(1500);
    const data = getData();
    const index = (data.generatedEmails || []).findIndex(e => e.id === emailId);
    if (index === -1) {
      throw new Error('Email not found');
    }

    const confidence = Math.floor(Math.random() * 15) + 82;
    const tokens = Math.floor(Math.random() * 200) + 600;

    data.generatedEmails[index] = {
      ...data.generatedEmails[index],
      confidence,
      tokens,
      generatedAt: new Date().toISOString(),
      status: 'pending'
    };

    saveData(data);
    return data.generatedEmails[index];
  }
};

export const senderAccountService = {
  async getAll() {
    await delay();
    const data = getData();
    return data.senderAccounts || [];
  },

  async getDefault() {
    await delay();
    const data = getData();
    return (data.senderAccounts || []).find(a => a.isDefault);
  },

  async setDefault(accountId) {
    await delay();
    const data = getData();
    data.senderAccounts = (data.senderAccounts || []).map(a => ({
      ...a,
      isDefault: a.id === accountId
    }));
    saveData(data);
    return data.senderAccounts.find(a => a.id === accountId);
  }
};

export const createEmailList = emailListService.create;
export const getEmailLists = emailListService.getAll;
export const getEmailListById = emailListService.getById;
