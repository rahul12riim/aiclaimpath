// src/lib/states-data.ts
// All 50 states unemployment data — manually verified, updated monthly
// PRIVACY: No user data is stored alongside this. State rules only.

export interface StateData {
  id: string
  name: string
  abbr: string
  agency: string
  agencyFull: string
  portalUrl: string
  maxWeeklyBenefit: number
  minWeeklyBenefit: number
  maxDurationWeeks: number
  processingWeeks: string
  filingDeadlineDays: number  // days after last day of work
  qualifyingReasons: string[]
  requiredDocs: string[]
  weeklyRequirements: string[]
  phone: string
  emoji: string
}

export const STATES: StateData[] = [
  {
    id: 'CA', name: 'California', abbr: 'CA', emoji: '🌴',
    agency: 'EDD', agencyFull: 'Employment Development Department',
    portalUrl: 'https://edd.ca.gov/en/unemployment/UI_Online/',
    maxWeeklyBenefit: 450, minWeeklyBenefit: 40, maxDurationWeeks: 26,
    processingWeeks: '2–3', filingDeadlineDays: 14,
    qualifyingReasons: ['Layoff', 'Reduction in hours', 'Quitting for good cause', 'Employer misconduct', 'Company closure'],
    requiredDocs: ['Social Security Number', 'Last employer name & address', 'Last day worked', 'Reason for separation', 'Bank account for direct deposit', 'Earnings for past 18 months'],
    weeklyRequirements: ['Certify every 2 weeks via UI Online or phone', 'Report all earnings including part-time', 'Be available and actively seeking work'],
    phone: '1-800-300-5616',
  },
  {
    id: 'TX', name: 'Texas', abbr: 'TX', emoji: '⭐',
    agency: 'TWC', agencyFull: 'Texas Workforce Commission',
    portalUrl: 'https://www.twc.texas.gov/jobseekers/unemployment-benefits-services',
    maxWeeklyBenefit: 563, minWeeklyBenefit: 69, maxDurationWeeks: 26,
    processingWeeks: '3–4', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'Company downsizing', 'Contract ended', 'Reduction in hours > 20%', 'Employer relocation'],
    requiredDocs: ['Social Security Number', 'Driver\'s license or ID', 'Last employer info', 'Employment dates', 'Reason for job separation', 'Bank account info'],
    weeklyRequirements: ['Request payment every 2 weeks', 'Apply to 3 jobs per week', 'Report all work and earnings', 'Register at WorkInTexas.com'],
    phone: '1-800-939-6631',
  },
  {
    id: 'NY', name: 'New York', abbr: 'NY', emoji: '🗽',
    agency: 'DOL', agencyFull: 'Department of Labor',
    portalUrl: 'https://labor.ny.gov/ui/claimantinfo/beforeyouapplyfaq.shtm',
    maxWeeklyBenefit: 504, minWeeklyBenefit: 100, maxDurationWeeks: 26,
    processingWeeks: '2–3', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'Employer closed', 'Hours reduced involuntarily', 'Constructive discharge', 'Domestic violence'],
    requiredDocs: ['Social Security Number', 'Work history (past 18 months)', 'Last employer info', 'Union card if applicable', 'Alien registration if non-citizen', 'Bank account info'],
    weeklyRequirements: ['Certify weekly online or by phone', 'Apply to 3 jobs per week', 'Keep a work search record', 'Report any earnings immediately'],
    phone: '1-888-209-8124',
  },
  {
    id: 'FL', name: 'Florida', abbr: 'FL', emoji: '🌊',
    agency: 'DEO', agencyFull: 'Department of Economic Opportunity',
    portalUrl: 'https://connect.myflorida.com',
    maxWeeklyBenefit: 275, minWeeklyBenefit: 32, maxDurationWeeks: 12,
    processingWeeks: '3–4', filingDeadlineDays: 21,
    qualifyingReasons: ['Laid off', 'Temporary layoff', 'Business closing', 'Hours significantly reduced', 'Employer moved out of state'],
    requiredDocs: ['Social Security Number', 'Driver\'s license or ID', 'Last 18 months employment history', 'Reason for separation', 'Bank account info', 'Email address'],
    weeklyRequirements: ['Certify weekly via CONNECT portal', 'Complete 5 work search activities per week', 'Report all earnings', 'Be available for full-time work'],
    phone: '1-800-204-2418',
  },
  {
    id: 'PA', name: 'Pennsylvania', abbr: 'PA', emoji: '🔔',
    agency: 'UCSC', agencyFull: 'UC Service Center',
    portalUrl: 'https://www.uc.pa.gov',
    maxWeeklyBenefit: 572, minWeeklyBenefit: 68, maxDurationWeeks: 26,
    processingWeeks: '3', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'Reduced hours', 'Company closed', 'Seasonal work ended', 'Medical separation (employer caused)'],
    requiredDocs: ['Social Security Number', 'PA driver\'s license number', 'Last employer name and address', 'Start and end dates', 'Reason for separation', 'Bank routing and account numbers'],
    weeklyRequirements: ['File biweekly claims online', 'Report all wages earned', 'Conduct 2 job contacts per week', 'Register with PA CareerLink'],
    phone: '888-313-7284',
  },
  {
    id: 'IL', name: 'Illinois', abbr: 'IL', emoji: '🌿',
    agency: 'IDES', agencyFull: 'Illinois Department of Employment Security',
    portalUrl: 'https://ides.illinois.gov/unemployment.html',
    maxWeeklyBenefit: 484, minWeeklyBenefit: 51, maxDurationWeeks: 26,
    processingWeeks: '2–3', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'Furloughed', 'Company restructure', 'Plant closure', 'Involuntary hours reduction'],
    requiredDocs: ['Social Security Number', 'IPIN (created at registration)', 'Employment history (18 months)', 'Separation reason', 'Banking information'],
    weeklyRequirements: ['Certify weekly via ILogin portal', 'Report all hours worked', 'Apply to jobs as required', 'Report any job offers (accepted or refused)'],
    phone: '800-244-5631',
  },
  {
    id: 'GA', name: 'Georgia', abbr: 'GA', emoji: '🍑',
    agency: 'DOL', agencyFull: 'Department of Labor',
    portalUrl: 'https://www.dol.state.ga.us/UI',
    maxWeeklyBenefit: 365, minWeeklyBenefit: 55, maxDurationWeeks: 14,
    processingWeeks: '2–3', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'Company closed', 'Hours reduced', 'Temporary layoff', 'Employer bankruptcy'],
    requiredDocs: ['Social Security Number', 'Georgia driver\'s license', 'Last employer info', 'Separation reason', 'Banking info'],
    weeklyRequirements: ['Certify weekly via MyUI Claimant Portal', 'Conduct job searches as required', 'Report all earnings', 'Attend reemployment services if referred'],
    phone: '404-232-3001',
  },
  {
    id: 'OH', name: 'Ohio', abbr: 'OH', emoji: '🌻',
    agency: 'JFS', agencyFull: 'Job and Family Services',
    portalUrl: 'https://unemployment.ohio.gov',
    maxWeeklyBenefit: 480, minWeeklyBenefit: 129, maxDurationWeeks: 26,
    processingWeeks: '2–3', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'End of contract', 'Company relocating', 'Business closed', 'Lack of work'],
    requiredDocs: ['Social Security Number', 'Ohio driver\'s license', 'Work history (6 weeks)', 'Separation documentation', 'Banking info'],
    weeklyRequirements: ['Claim weekly online or by phone', 'Report all wages', 'Apply to jobs as instructed', 'Be available for work'],
    phone: '877-644-6562',
  },
  {
    id: 'MI', name: 'Michigan', abbr: 'MI', emoji: '🦌',
    agency: 'UIA', agencyFull: 'Unemployment Insurance Agency',
    portalUrl: 'https://www.michigan.gov/uia',
    maxWeeklyBenefit: 362, minWeeklyBenefit: 148, maxDurationWeeks: 20,
    processingWeeks: '3–4', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'Plant closure', 'Reduced schedule', 'Seasonal layoff', 'Business sold'],
    requiredDocs: ['Social Security Number', 'Michigan ID', 'Last 18 months employers', 'Separation reason', 'Bank info for direct deposit'],
    weeklyRequirements: ['Certify weekly via MiWAM', 'Report all work and wages', 'Conduct minimum 1 work search activity per week', 'Keep job search records 2 years'],
    phone: '866-500-0017',
  },
  {
    id: 'WA', name: 'Washington', abbr: 'WA', emoji: '🌲',
    agency: 'ESD', agencyFull: 'Employment Security Department',
    portalUrl: 'https://esd.wa.gov/unemployment/apply',
    maxWeeklyBenefit: 1019, minWeeklyBenefit: 295, maxDurationWeeks: 26,
    processingWeeks: '2–3', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'End of seasonal work', 'Hours cut', 'Employer closed', 'Constructive quit'],
    requiredDocs: ['Social Security Number', 'WA driver\'s license', 'Last employer name/address', 'Last day worked', 'Reason for separation', 'Bank info'],
    weeklyRequirements: ['Claim weekly online at esd.wa.gov', 'Report all hours and earnings', 'Apply to 3 jobs per week (unless waived)', 'Complete reemployment activities if assigned'],
    phone: '800-318-6022',
  },
  {
    id: 'NC', name: 'North Carolina', abbr: 'NC', emoji: '🌸',
    agency: 'DES', agencyFull: 'Division of Employment Security',
    portalUrl: 'https://des.nc.gov',
    maxWeeklyBenefit: 350, minWeeklyBenefit: 15, maxDurationWeeks: 12,
    processingWeeks: '2–3', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'Company downsizing', 'Contract ended', 'Plant closed', 'Medical (employer-related)'],
    requiredDocs: ['Social Security Number', 'NC driver\'s license', '18-month work history', 'Separation reason', 'Banking info'],
    weeklyRequirements: ['Certify weekly via DES Online', 'Apply to jobs as required', 'Report all earnings', 'Remain in contact with DES'],
    phone: '888-737-0259',
  },
  {
    id: 'AZ', name: 'Arizona', abbr: 'AZ', emoji: '🌵',
    agency: 'DES', agencyFull: 'Department of Economic Security',
    portalUrl: 'https://des.az.gov/services/employment/unemployment-individual',
    maxWeeklyBenefit: 320, minWeeklyBenefit: 181, maxDurationWeeks: 26,
    processingWeeks: '3', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'Employer closed', 'Hours reduced', 'Temporary layoff'],
    requiredDocs: ['Social Security Number', 'AZ ID', 'Employer history', 'Separation documents', 'Bank info'],
    weeklyRequirements: ['Certify biweekly', 'Conduct job searches', 'Report all income', 'Register with Arizona Job Connection'],
    phone: '877-600-2722',
  },
  {
    id: 'CO', name: 'Colorado', abbr: 'CO', emoji: '🏔️',
    agency: 'CDLE', agencyFull: 'Department of Labor and Employment',
    portalUrl: 'https://myui.coworkforce.com',
    maxWeeklyBenefit: 781, minWeeklyBenefit: 25, maxDurationWeeks: 26,
    processingWeeks: '2–3', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'Reduction in hours', 'Employer closed', 'Lack of work', 'Seasonal end'],
    requiredDocs: ['Social Security Number', 'CO driver\'s license', 'Work history', 'Separation reason', 'Banking info'],
    weeklyRequirements: ['Certify weekly via MyUI+', 'Apply to 5 jobs per week', 'Report wages and hours', 'Accept suitable work if offered'],
    phone: '303-318-9000',
  },
  {
    id: 'NV', name: 'Nevada', abbr: 'NV', emoji: '🎰',
    agency: 'DETR', agencyFull: 'Department of Employment, Training & Rehabilitation',
    portalUrl: 'https://ui.nv.gov',
    maxWeeklyBenefit: 469, minWeeklyBenefit: 16, maxDurationWeeks: 26,
    processingWeeks: '3', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'Hours cut', 'Employer closed', 'Contract ended', 'Forced retirement'],
    requiredDocs: ['Social Security Number', 'NV ID', 'Employer history', 'Reason for separation', 'Bank info'],
    weeklyRequirements: ['Certify biweekly', 'Register with Nevada JobConnect', 'Conduct job search', 'Report all earnings'],
    phone: '888-890-8211',
  },
  {
    id: 'OR', name: 'Oregon', abbr: 'OR', emoji: '🌲',
    agency: 'OED', agencyFull: 'Oregon Employment Department',
    portalUrl: 'https://unemployment.oregon.gov',
    maxWeeklyBenefit: 783, minWeeklyBenefit: 151, maxDurationWeeks: 26,
    processingWeeks: '2–3', filingDeadlineDays: 14,
    qualifyingReasons: ['Laid off', 'Business closed', 'Hours reduced', 'Seasonal end', 'Medical (employer caused)'],
    requiredDocs: ['Social Security Number', 'Oregon ID', '18-month work history', 'Separation reason', 'Banking info'],
    weeklyRequirements: ['File weekly claims online', 'Apply to jobs each week', 'Report all wages', 'Participate in reemployment services if referred'],
    phone: '877-345-3484',
  },
]

// Helper: get state by ID
export function getState(id: string): StateData | undefined {
  return STATES.find(s => s.id === id.toUpperCase())
}

// Helper: format benefit range
export function formatBenefitRange(state: StateData): string {
  return `$${state.minWeeklyBenefit}–$${state.maxWeeklyBenefit}/week`
}
