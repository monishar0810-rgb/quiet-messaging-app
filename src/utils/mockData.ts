import { Contact, Message, Advocate } from '../types';

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'mom',
    name: 'Mom ❤️',
    role: 'Family',
    avatarColor: 'bg-rose-500 text-white',
    isQuiet: false,
    status: 'online',
    lastMessageText: "Don't forget to eat dinner sweetie! xx",
    lastMessageAt: '9:05 AM',
    unreadCount: 12,
    chatTheme: 'crimson',
  },
  {
    id: 'bestie',
    name: 'Alex',
    role: 'Best Friend',
    avatarColor: 'bg-amber-500 text-white',
    isQuiet: false,
    status: 'online',
    lastMessageText: 'Bro, are we playing today? 🎮',
    lastMessageAt: 'Yesterday',
    unreadCount: 6,
    chatTheme: 'amber',
  },
  {
    id: 'gym_trainer',
    name: 'Marcus (Trainer) 💪',
    role: 'Personal Trainer',
    avatarColor: 'bg-sky-500 text-white',
    isQuiet: false,
    status: 'offline',
    lastMessageText: 'Leg day tomorrow at 6:00 AM. No excuses!',
    lastMessageAt: 'Yesterday',
    unreadCount: 4,
    chatTheme: 'emerald',
  },
  {
    id: 'ashliya',
    name: 'ashliya',
    role: 'Classmate',
    avatarColor: 'bg-purple-500 text-white',
    isQuiet: true,
    status: 'online',
    lastMessageText: 'Did you finish the math assignment?',
    lastMessageAt: '8:45 AM',
    unreadCount: 7,
    chatTheme: 'lavender',
  },
  {
    id: 'amaya',
    name: 'amaya',
    role: 'Co-worker',
    avatarColor: 'bg-emerald-500 text-white',
    isQuiet: false,
    status: 'offline',
    lastMessageText: 'The client presentation is ready to send.',
    lastMessageAt: '8:15 AM',
    unreadCount: 0,
    chatTheme: 'ocean',
  },
  {
    id: 'kamali',
    name: 'kamali',
    role: 'Study Partner',
    avatarColor: 'bg-indigo-500 text-white',
    isQuiet: false,
    status: 'online',
    lastMessageText: "Let's meet at the library at 2 PM.",
    lastMessageAt: 'Monday',
    unreadCount: 0,
    chatTheme: 'midnight',
  },
  {
    id: 'dad',
    name: 'Dad',
    role: 'Family',
    avatarColor: 'bg-blue-500 text-white',
    isQuiet: false,
    isArchived: true,
    status: 'offline',
    lastMessageText: 'Call me when you are free, kiddo.',
    lastMessageAt: 'Sunday',
    unreadCount: 2,
    chatTheme: 'midnight',
  },
  {
    id: 'spam_crypto',
    name: '🔥 CRYPTO DAILY',
    role: 'Spam Bot',
    avatarColor: 'bg-rose-600 text-white',
    isQuiet: true,
    isSpam: true,
    isBlocked: true,
    status: 'offline',
    lastMessageText: 'URGENT: $BTC is pumping! Claim your 0.5 BTC reward now at short.ly/fakebtc',
    lastMessageAt: '9:10 AM',
    unreadCount: 0,
    chatTheme: 'lavender',
  }
];

export const INITIAL_MESSAGES: Message[] = [
  // Mom History
  {
    id: 'm1',
    contactId: 'mom',
    sender: 'contact',
    text: 'Good morning! Did you sleep well?',
    timestamp: '8:00 AM',
    status: 'read',
    isQuietMessage: false,
  },
  {
    id: 'm2',
    contactId: 'mom',
    sender: 'me',
    text: 'Yes mom, slept great! Just starting my work day.',
    timestamp: '8:15 AM',
    status: 'read',
    isQuietMessage: false,
  },
  {
    id: 'm3',
    contactId: 'mom',
    sender: 'contact',
    text: "Don't forget to eat dinner sweetie! xx",
    timestamp: '9:05 AM',
    status: 'read',
    isQuietMessage: false,
  },

  // Alex History
  {
    id: 'a1',
    contactId: 'bestie',
    sender: 'me',
    text: 'Yo! That pizza yesterday was incredible.',
    timestamp: 'Yesterday',
    status: 'read',
    isQuietMessage: false,
  },
  {
    id: 'a2',
    contactId: 'bestie',
    sender: 'contact',
    text: 'Bro, are we playing today? 🎮',
    timestamp: 'Yesterday',
    status: 'read',
    isQuietMessage: false,
  },

  // Marcus History
  {
    id: 't1',
    contactId: 'gym_trainer',
    sender: 'contact',
    text: 'Remember to drink water today and eat high protein.',
    timestamp: 'Yesterday',
    status: 'read',
    isQuietMessage: false,
  },
  {
    id: 't2',
    contactId: 'gym_trainer',
    sender: 'contact',
    text: 'Leg day tomorrow at 6:00 AM. No excuses!',
    timestamp: 'Yesterday',
    status: 'read',
    isQuietMessage: false,
  },

  // ashliya History
  {
    id: 'as1',
    contactId: 'ashliya',
    sender: 'contact',
    text: 'Did you finish the math assignment?',
    timestamp: '8:45 AM',
    status: 'delivered',
    isQuietMessage: true,
  },

  // amaya History
  {
    id: 'am1',
    contactId: 'amaya',
    sender: 'contact',
    text: 'The client presentation is ready to send.',
    timestamp: '8:15 AM',
    status: 'read',
    isQuietMessage: false,
  },

  // kamali History
  {
    id: 'k1',
    contactId: 'kamali',
    sender: 'contact',
    text: "Let's meet at the library at 2 PM.",
    timestamp: 'Monday',
    status: 'read',
    isQuietMessage: false,
  },

  // Dad History
  {
    id: 'd1',
    contactId: 'dad',
    sender: 'contact',
    text: 'Call me when you are free, kiddo.',
    timestamp: 'Sunday',
    status: 'read',
    isQuietMessage: false,
  },

  // Crypto Spam History
  {
    id: 'c1',
    contactId: 'spam_crypto',
    sender: 'contact',
    text: 'URGENT: $BTC is pumping! Claim your 0.5 BTC reward now at short.ly/fakebtc',
    timestamp: '9:10 AM',
    status: 'delivered',
    isQuietMessage: true,
  },
];

export const SIMULATED_RESPONSES: Record<string, string[]> = {
  mom: [
    'Are you staying warm? Make sure to wear a jacket!',
    'I made some soup today, wish you were here to try it!',
    'Text me when you get a chance, love you!',
    'Did you get that package I sent you last week?',
    'Ok honey, talk to you later! ❤️'
  ],
  bestie: [
    'Dude, look at this meme! 😂',
    'I\'m online, join the discord lobby!',
    'Let\'s order some wings tonight.',
    'Did you hear about the new update? It looks sick!',
    'Hahaha that is wild.'
  ],
  gym_trainer: [
    'How are your macros looking today?',
    'Consistent effort leads to consistent results. Keep pushing!',
    'Make sure to stretch your hamstrings tonight.',
    'Add 5lbs to your squat next session!'
  ],
  ashliya: [
    'Can we study together after class?',
    'What did you get for question 4?',
    'Thanks for the help!'
  ],
  amaya: [
    'We got approval from the design lead.',
    'I will set up a meeting for tomorrow.',
    'Perfect, thank you.'
  ],
  kamali: [
    'Did you read chapter 3?',
    'I am heading to the cafe now.',
    'Awesome, see you there!'
  ],
  dad: [
    'Hope your day is going well!',
    'Did you see the game yesterday?',
    'Love you, kiddo.'
  ],
  spam_crypto: [
    '💸 DEPOSIT CONFIRMED! Spin the wheel to double your Ethereum now.',
    '⚠️ Account warning: Verify your wallet credentials immediately to prevent lock!',
    '🚀 MOONSHOT SIGNAL: Buy $SHIBA2.0 before it lists in 10 minutes!',
    'Exclusive VIP discount code inside: FREECOIN99'
  ],
  adv_priya: [
    'Vanakkam. I have received your request. Rest assured, your personal phone number and ID are masked for your privacy. How can I help you regarding your criminal law concern?',
    'Under Section 438 of CrPC, we can file for anticipatory bail if there is apprehension of arrest. Let me review your case notes.',
    'Please upload any relevant notices or FIR copies here in our secure folder so we can proceed with a petition.',
    'Let us schedule a formal discussion once I review the initial complaint structure.'
  ],
  adv_rajendran: [
    'Greetings. This is Advocate Rajendran. I specialize in Property disputes and Land acquisitions. As this is a secure, identity-cloaked bridge, I cannot see your personal details, which is optimal.',
    'Under the Real Estate Regulation Act (RERA), we have strong consumer protections. When was the property registration completed?',
    'We should check the parent documents and encumbrance certificate (EC) for the past 30 years to ensure clean title.',
    'I can represent your petition in the Coimbatore District Court.'
  ],
  adv_meera: [
    'Hello. I am Advocate Meera Alagappan. I specialize in Civil litigation and family governance. How may I assist you today on this secure platform?',
    'We can file a civil suit for injunction to prevent any unauthorized construction. Do you have the survey records?',
    'The Madras High Court Madurai Bench regularly handles these writ petitions. I will draft a response for you.',
    'Your privacy is fully protected under our quantum-secured portal. Please tell me more about the dispute.'
  ],
  adv_ramesh: [
    'Vanakkam. Advocate Ramesh here. Let us discuss your property assessment or partition deed query.',
    'Is the property ancestral or self-acquired? This significantly changes the legal inheritance hierarchy.',
    'I will draft a legal notice to be sent to the opposing party. This usually resolves 70% of property partition delays.',
    'Our conversation here is completely confidential.'
  ],
  adv_shalini: [
    'This is Advocate Shalini Naidu. I am currently attending a hearing, but I can review your criminal defense query shortly.',
    'Do not sign any statements without legal counsel. You have a constitutional right to remain silent under Article 20(3).',
    'I will check the status of the petition at the Madras High Court registry.'
  ]
};

export const MOCK_ADVOCATES: Advocate[] = [
  {
    id: 'adv-1',
    name: 'Adv. Priya Srinivasan',
    specialization: 'Criminal',
    experience: 12,
    court_location: 'Madras High Court (Main Bench)',
    current_availability: 'Available',
    contactId: 'adv_priya'
  },
  {
    id: 'adv-2',
    name: 'Adv. K. Rajendran',
    specialization: 'Property',
    experience: 15,
    court_location: 'Coimbatore District Court',
    current_availability: 'Busy',
    contactId: 'adv_rajendran'
  },
  {
    id: 'adv-3',
    name: 'Adv. Meera Alagappan',
    specialization: 'Civil',
    experience: 8,
    court_location: 'Madurai Bench of Madras High Court',
    current_availability: 'Available',
    contactId: 'adv_meera'
  },
  {
    id: 'adv-4',
    name: 'Adv. Ramesh Kumar',
    specialization: 'Property',
    experience: 10,
    court_location: 'Salem District Court',
    current_availability: 'Available',
    contactId: 'adv_ramesh'
  },
  {
    id: 'adv-5',
    name: 'Adv. Shalini Naidu',
    specialization: 'Criminal',
    experience: 14,
    court_location: 'Madras High Court (Main Bench)',
    current_availability: 'Busy',
    contactId: 'adv_shalini'
  }
];

