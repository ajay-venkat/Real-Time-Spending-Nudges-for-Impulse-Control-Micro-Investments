'use server';
/**
 * @fileOverview A Genkit flow for providing personalized spending nudges and micro-investment suggestions.
 *
 * - personalizedSpendingNudges - A function that handles the personalized spending nudge process.
 * - PersonalizedSpendingNudgesInput - The input type for the personalizedSpendingNudges function.
 * - PersonalizedSpendingNudgesOutput - The return type for the personalizedSpendingNudges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedSpendingNudgesInputSchema = z.object({
  currentSpending: z
    .number()
    .describe('The user\'s current spending in the specified category.'),
  spendingLimit: z
    .number()
    .describe('The user-defined spending limit for the category.'),
  transactionAmount: z
    .number()
    .describe('The amount of the current transaction that triggered the nudge.'),
  transactionCategory: z
    .string()
    .describe('The category of the current transaction (e.g., food, entertainment).'),
  userFinancialGoals: z
    .array(z.string())
    .optional()
    .describe('Optional: A list of the user\'s financial goals for better personalization.'),
  investmentOpportunities: z
    .array(
      z.object({
        name: z.string().describe('The name of the investment opportunity.'),
        description: z
          .string()
          .describe('A brief description of the investment opportunity.'),
        potentialReturn: z
          .string()
          .optional()
          .describe('Optional: The potential return of the investment opportunity.'),
      })
    )
    .optional()
    .describe('Optional: A list of potential micro-investment opportunities.'),
});
export type PersonalizedSpendingNudgesInput = z.infer<
  typeof PersonalizedSpendingNudgesInputSchema
>;

const PersonalizedSpendingNudgesOutputSchema = z.object({
  nudgeMessage: z.string().describe('The personalized message to the user.'),
  suggestedAction: z
    .string()
    .optional()
    .describe('An alternative action or a specific micro-investment suggestion.'),
  isOverLimit: z
    .boolean()
    .describe('A boolean indicating if the user is over their spending limit.'),
});
export type PersonalizedSpendingNudgesOutput = z.infer<
  typeof PersonalizedSpendingNudgesOutputSchema
>;

export async function personalizedSpendingNudges(
  input: PersonalizedSpendingNudgesInput
): Promise<PersonalizedSpendingNudgesOutput> {
  return personalizedSpendingNudgesFlow(input);
}

const spendingNudgePrompt = ai.definePrompt({
  name: 'spendingNudgePrompt',
  input: {schema: PersonalizedSpendingNudgesInputSchema},
  output: {schema: PersonalizedSpendingNudgesOutputSchema},
  prompt: `You are NudgeWealth, a friendly and wise financial assistant.
Your goal is to help users manage their spending and make smart financial decisions, especially when they are nearing or exceeding their spending limits.
Provide context-aware notifications that include personalized advice or specific micro-investment opportunities.

Input:
Current Spending in category '{{{transactionCategory}}}': {{{currentSpending}}}
Spending Limit for category '{{{transactionCategory}}}': {{{spendingLimit}}}
Current Transaction Amount: {{{transactionAmount}}}
Projected Total if this transaction goes through: {{sum currentSpending transactionAmount}}

{{#if userFinancialGoals}}
User's Financial Goals: {{#each userFinancialGoals}}- {{{this}}}{{/each}}
{{/if}}

{{#if investmentOpportunities}}
Available Micro-Investment Opportunities:
{{#each investmentOpportunities}}
- Name: {{{name}}}, Description: {{{description}}} {{#if potentialReturn}} (Potential Return: {{{potentialReturn}}}){{/if}}
{{/each}}
{{/if}}

Based on the above information, generate a personalized nudge. Determine if the user is over their limit with this transaction.

Instructions:
1. Calculate if 'currentSpending + transactionAmount' exceeds 'spendingLimit'. Set 'isOverLimit' to true or false.
2. Craft a 'nudgeMessage' that is encouraging, clear, and actionable. If over limit, make it a hard alert. If nearing limit (e.g., within 10% of remaining budget), make it a soft alert.
3. In the 'nudgeMessage', refer to the 'transactionCategory' and how it relates to their 'spendingLimit'.
4. If the user is nearing or over the limit, suggest a 'suggestedAction'. This could be: 
   - Reconsidering the purchase.
   - Redirecting a portion of the 'transactionAmount' to savings/investments.
   - Highlighting a relevant 'investmentOpportunities' if available, especially if it aligns with 'userFinancialGoals'.
   - If no specific investment opportunities are provided, suggest general micro-investment or saving.

Example 'nudgeMessage' if nearing limit: "Hey! You're about to spend {{{transactionAmount}}} on '{{{transactionCategory}}}'. This will bring your '{{{transactionCategory}}}' spending to {{sum currentSpending transactionAmount}}, which is close to your {{{spendingLimit}}} limit! Consider if this purchase truly aligns with your financial goals."
Example 'nudgeMessage' if over limit: "Warning! Spending {{{transactionAmount}}} on '{{{transactionCategory}}}' will put you over your {{{spendingCategory}}} limit of {{{spendingLimit}}}. Your total for this category would be {{sum currentSpending transactionAmount}}. This is a hard stop!"

Focus on constructive advice tailored to their financial situation.
`,
});

const personalizedSpendingNudgesFlow = ai.defineFlow(
  {
    name: 'personalizedSpendingNudgesFlow',
    inputSchema: PersonalizedSpendingNudgesInputSchema,
    outputSchema: PersonalizedSpendingNudgesOutputSchema,
  },
  async (input) => {
    const {output} = await spendingNudgePrompt(input);
    return output!;
  }
);
