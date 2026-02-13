'use server';
/**
 * @fileOverview A Genkit flow for intelligently redirecting excess funds to micro-investments or savings pots.
 *
 * - intelligentMicroInvestmentRedirect - A function that evaluates and recommends a micro-investment or savings pot.
 * - IntelligentMicroInvestmentRedirectInput - The input type for the intelligentMicroInvestmentRedirect function.
 * - IntelligentMicroInvestmentRedirectOutput - The return type for the intelligentMicroInvestmentRedirect function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InvestmentOptionSchema = z.object({
  name: z.string().describe('The name of the investment or savings option.'),
  type: z.string().describe('The type of option, e.g., "Savings" or "Investment".'),
  riskLevel: z.enum(['Very Low', 'Low', 'Medium', 'High', 'Very High']).describe('The risk level associated with the option.'),
  expectedReturn: z.string().describe('The expected return for the option, e.g., "2.0%" or "10-15%".'),
  description: z.string().describe('A brief description of the investment or savings option.'),
});

const IntelligentMicroInvestmentRedirectInputSchema = z.object({
  excessAmount: z.number().describe('The amount of money to be redirected.'),
  userFinancialGoals: z.string().describe('A description of the user\'s financial goals.'),
  currentMarketConditions: z.string().describe('A summary of current market conditions.'),
  availableInvestmentOptions: z.array(InvestmentOptionSchema).describe('A list of available micro-investment and savings pot options.'),
});
export type IntelligentMicroInvestmentRedirectInput = z.infer<typeof IntelligentMicroInvestmentRedirectInputSchema>;

const IntelligentMicroInvestmentRedirectOutputSchema = z.object({
  recommendedAction: z.string().describe('The recommended action NudgeWealth should take, e.g., "Invest in Aggressive Growth Fund".'),
  recommendationRationale: z.string().describe('An explanation for the recommendation, considering financial goals and market conditions.'),
  investmentOption: InvestmentOptionSchema.describe('The specific investment option chosen for redirection.'),
  redirectAmount: z.number().describe('The amount that will be redirected.'),
});
export type IntelligentMicroInvestmentRedirectOutput = z.infer<typeof IntelligentMicroInvestmentRedirectOutputSchema>;

export async function intelligentMicroInvestmentRedirect(
  input: IntelligentMicroInvestmentRedirectInput
): Promise<IntelligentMicroInvestmentRedirectOutput> {
  return intelligentMicroInvestmentRedirectFlow(input);
}

const intelligentMicroInvestmentRedirectPrompt = ai.definePrompt({
  name: 'intelligentMicroInvestmentRedirectPrompt',
  input: { schema: IntelligentMicroInvestmentRedirectInputSchema },
  output: { schema: IntelligentMicroInvestmentRedirectOutputSchema },
  prompt: `You are NudgeWealth, an AI-powered financial advisor. Your task is to evaluate the most suitable micro-investment opportunity or savings pot for a user based on their financial goals and current market conditions.\n\nHere is the information you need:\nExcess Amount to Redirect: {{{excessAmount}}}\nUser's Financial Goals: {{{userFinancialGoals}}}\nCurrent Market Conditions: {{{currentMarketConditions}}}\nAvailable Investment and Savings Options:\n{{#each availableInvestmentOptions}}\n- Name: {{{this.name}}}\n  Type: {{{this.type}}}\n  Risk Level: {{{this.riskLevel}}}\n  Expected Return: {{{this.expectedReturn}}}\n  Description: {{{this.description}}}\n{{/each}}\n\nAnalyze the provided information and recommend the single best option from the 'Available Investment and Savings Options' to redirect the 'Excess Amount to Redirect'. Ensure your recommendation aligns with the user's financial goals and the current market conditions. Provide a clear rationale for your choice.\n\nYour output must be a JSON object conforming to the IntelligentMicroInvestmentRedirectOutputSchema.`,
});

const intelligentMicroInvestmentRedirectFlow = ai.defineFlow(
  {
    name: 'intelligentMicroInvestmentRedirectFlow',
    inputSchema: IntelligentMicroInvestmentRedirectInputSchema,
    outputSchema: IntelligentMicroInvestmentRedirectOutputSchema,
  },
  async (input) => {
    const { output } = await intelligentMicroInvestmentRedirectPrompt(input);
    if (!output) {
      throw new Error('Failed to get a recommendation from the AI model.');
    }
    return output;
  }
);
