// src/app/api/eligibility/route.ts
// Fast eligibility pre-check. No PII needed, no PII stored.

import { z } from 'zod'
import { getState } from '@/lib/states-data'

const EligibilitySchema = z.object({
  stateId: z.string().length(2).toUpperCase(),
  separationReason: z.enum([
    'layoff', 'reduced_hours', 'quit_good_cause', 'fired', 'contract_ended', 'company_closed', 'other'
  ]),
  employmentDuration: z.enum(['less_than_3_months', '3_to_12_months', 'over_12_months']),
  availableForWork: z.boolean(),
})

type EligibilityResult = {
  verdict: 'likely' | 'possible' | 'unlikely' | 'more_info_needed'
  confidence: number
  reason: string
  nextSteps: string[]
  estimatedWeeklyBenefit?: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = EligibilitySchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { stateId, separationReason, employmentDuration, availableForWork } = parsed.data
    const state = getState(stateId)

    if (!state) {
      return Response.json({ error: 'Unknown state' }, { status: 400 })
    }

    // Not available = not eligible in any state
    if (!availableForWork) {
      return Response.json({
        verdict: 'unlikely',
        confidence: 90,
        reason: 'Unemployment benefits require you to be available and actively seeking work.',
        nextSteps: [
          'If your situation changes and you become available for work, file immediately',
          `Call ${state.phone} to discuss your specific circumstances`,
        ],
      } satisfies EligibilityResult)
    }

    // Less than 3 months is usually insufficient
    if (employmentDuration === 'less_than_3_months') {
      return Response.json({
        verdict: 'possible',
        confidence: 40,
        reason: 'Most states require a minimum earnings history. Under 3 months may be insufficient, but it depends on your total wages.',
        nextSteps: [
          'File anyway — the agency will determine your exact eligibility based on wages',
          `Visit ${state.portalUrl} to start your application`,
          `Call ${state.phone} to ask about minimum earnings requirements`,
        ],
      } satisfies EligibilityResult)
    }

    // Strong qualifying reasons
    if (['layoff', 'reduced_hours', 'contract_ended', 'company_closed'].includes(separationReason)) {
      const estimate = `$${state.minWeeklyBenefit}–$${state.maxWeeklyBenefit}`
      return Response.json({
        verdict: 'likely',
        confidence: 90,
        reason: `${separationReason === 'layoff' ? 'Being laid off' : separationReason === 'reduced_hours' ? 'Having your hours significantly reduced' : separationReason === 'contract_ended' ? 'Your contract ending' : 'Your company closing'} often qualifies for unemployment benefits.`,
        estimatedWeeklyBenefit: estimate,
        nextSteps: [
          `File within ${state.filingDeadlineDays} days of your last day of work`,
          `Gather: SSN, employer info, last day worked, and bank account details`,
          `Start your application at ${state.portalUrl}`,
          `Expected benefit: ${estimate} for up to ${state.maxDurationWeeks} weeks`,
        ],
      } satisfies EligibilityResult)
    }

    // Possible qualifying reasons
    if (separationReason === 'quit_good_cause') {
      return Response.json({
        verdict: 'possible',
        confidence: 60,
        reason: 'Quitting for "good cause" can qualify — but the agency will evaluate your specific reason. Examples: unsafe working conditions, harassment, significant pay cut.',
        nextSteps: [
          'Document your reason for quitting in writing',
          'File your claim and explain your situation clearly',
          `Visit ${state.portalUrl} to apply`,
          'Our AI can help you craft your explanation',
        ],
      } satisfies EligibilityResult)
    }

    if (separationReason === 'fired') {
      return Response.json({
        verdict: 'possible',
        confidence: 45,
        reason: 'Being fired can qualify if it was not for "misconduct." Performance issues, downsizing disguised as termination, or disagreements often qualify.',
        nextSteps: [
          'File your claim — the agency will investigate both sides',
          'Write down exactly what happened before you forget details',
          'Our AI can help you prepare your statement',
          `Call ${state.phone} if you have questions about your situation`,
        ],
      } satisfies EligibilityResult)
    }

    return Response.json({
      verdict: 'more_info_needed',
      confidence: 50,
      reason: 'Your situation needs more context to assess. File your claim anyway — the agency will make the official determination.',
      nextSteps: [
        `File your claim at ${state.portalUrl}`,
        'Use our AI chat to walk through your specific situation',
        `Call ${state.phone} for a direct assessment`,
      ],
    } satisfies EligibilityResult)
  } catch (error) {
    console.error('[Eligibility API] Error:', error)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export const runtime = 'edge'
