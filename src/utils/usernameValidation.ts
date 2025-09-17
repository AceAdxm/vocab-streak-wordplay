// Inappropriate words and patterns to filter out
const INAPPROPRIATE_WORDS = [
  // Basic profanity
  'fuck', 'shit', 'damn', 'bitch', 'ass', 'bastard', 'crap',
  // Stronger profanity
  'asshole', 'dickhead', 'motherfucker', 'cocksucker', 'prick',
  // Offensive slurs (partial list for content safety)
  'retard', 'faggot', 'nigger', 'nigga', 'spic', 'chink', 'kike',
  // Sexual content
  'porn', 'sex', 'nude', 'naked', 'boobs', 'tits', 'pussy', 'dick', 'cock', 'penis', 'vagina',
  // Drugs
  'cocaine', 'heroin', 'meth', 'weed', 'marijuana', 'drugs',
  // Violence
  'kill', 'murder', 'death', 'suicide', 'bomb', 'terrorist', 'gun', 'weapon',
  // Hate speech indicators
  'nazi', 'hitler', 'kkk', 'white power', 'supremacist',
  // Common inappropriate patterns
  'admin', 'moderator', 'support', 'official', 'staff', 'bot', 'system',
  // Scam indicators
  'free money', 'winner', 'prize', 'lottery', 'million',
];

// Patterns that might indicate inappropriate content
const INAPPROPRIATE_PATTERNS = [
  /(.)\1{4,}/, // Repeated characters (aaaaa, 11111)
  /^[0-9]+$/, // Only numbers
  /^.{1,2}$/, // Too short (1-2 chars)
  /^.{21,}$/, // Too long (over 20 chars)
  /[^a-zA-Z0-9_-]/, // Special characters except _ and -
  /^[-_]/, // Starts with dash or underscore
  /[-_]$/, // Ends with dash or underscore
  /_{2,}/, // Multiple underscores
  /-{2,}/, // Multiple dashes
];

export interface UsernameValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateUsername = (username: string): UsernameValidationResult => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, error: 'Username is required' };
  }

  const trimmedUsername = username.trim().toLowerCase();

  // Check length
  if (trimmedUsername.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' };
  }

  if (trimmedUsername.length > 20) {
    return { isValid: false, error: 'Username must be no more than 20 characters long' };
  }

  // Check against inappropriate patterns
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(trimmedUsername)) {
      return { isValid: false, error: 'Username contains invalid characters or format' };
    }
  }

  // Check against inappropriate words
  for (const word of INAPPROPRIATE_WORDS) {
    if (trimmedUsername.includes(word.toLowerCase())) {
      return { isValid: false, error: 'Username contains inappropriate content. Please choose a different name.' };
    }
  }

  // Check for common variations with numbers/symbols
  const alphaOnly = trimmedUsername.replace(/[0-9_-]/g, '');
  for (const word of INAPPROPRIATE_WORDS) {
    if (alphaOnly.includes(word.toLowerCase())) {
      return { isValid: false, error: 'Username contains inappropriate content. Please choose a different name.' };
    }
  }

  // Additional check for leetspeak variations (basic)
  const leetReplacements: Record<string, string> = {
    '3': 'e',
    '1': 'i',
    '0': 'o',
    '4': 'a',
    '5': 's',
    '7': 't',
    '@': 'a',
    '$': 's'
  };

  let leetDecoded = trimmedUsername;
  Object.entries(leetReplacements).forEach(([leet, normal]) => {
    leetDecoded = leetDecoded.replace(new RegExp(leet, 'g'), normal);
  });

  for (const word of INAPPROPRIATE_WORDS) {
    if (leetDecoded.includes(word.toLowerCase())) {
      return { isValid: false, error: 'Username contains inappropriate content. Please choose a different name.' };
    }
  }

  return { isValid: true };
};

// Check if username looks like it might be impersonating someone
export const checkForImpersonation = (username: string): UsernameValidationResult => {
  const impersonationWords = [
    'admin', 'moderator', 'mod', 'support', 'staff', 'official', 
    'bot', 'system', 'service', 'help', 'team', 'owner', 'ceo',
    'manager', 'developer', 'dev', 'tech', 'security'
  ];

  const lowerUsername = username.toLowerCase();
  
  for (const word of impersonationWords) {
    if (lowerUsername.includes(word)) {
      return { 
        isValid: false, 
        error: 'Username cannot impersonate staff or official accounts. Please choose a different name.' 
      };
    }
  }

  return { isValid: true };
};

// Main validation function that combines all checks
export const validateUsernameComplete = (username: string): UsernameValidationResult => {
  // Basic validation
  const basicValidation = validateUsername(username);
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  // Impersonation check
  const impersonationValidation = checkForImpersonation(username);
  if (!impersonationValidation.isValid) {
    return impersonationValidation;
  }

  return { isValid: true };
};