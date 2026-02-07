import { llm } from '@livekit/agents';
import { z } from 'zod';
import { saveTicket, updateTicket } from './db.js';

/**
 * Tool: create_ticket
 * Requirement: "create_ticket → write a new ticket"
 * This tool is triggered at the end of the conversation once the user confirms all details.
 * It persists the final data to MongoDB and generates a confirmation number.
 */
const create_ticket = llm.tool({
    description: 'Creates a new IT support ticket in the database once all user details are confirmed.',
    parameters: z.object({
        name: z.string().describe('Full name of the customer'),
        email: z.string().email().describe('Email address of the customer'),
        phone: z.string().describe('Phone number of the customer'),
        address: z.string().describe('Physical address for the service'),
        issue: z.string().describe('Description of the IT problem'),
        price: z.number().describe('The quoted price based on the issue type'),
    }),
    execute: async (data) => {
        try {
            // Generates a 4-digit confirmation number for the user's reference.
            const confirmationNumber = Math.floor(1000 + Math.random() * 9000).toString();

            // Maps parameters to the database schema defined in db.ts.
            await saveTicket({
                customerName: data.name,
                customerEmail: data.email,
                customerPhone: data.phone,
                customerAddress: data.address,
                issueDescription: data.issue,
                quotedPrice: data.price,
                confirmationNumber: confirmationNumber,
            });

            return `Ticket successfully created. Confirmation number is ${confirmationNumber}.`;
        } catch (error) {
            console.error('❌ Ticket Creation Failed:', error);
            return 'I encountered an error while saving the ticket. Please try again.';
        }
    },
});

/**
 * Tool: edit_ticket
 * Requirement: "edit_ticket → update name, phone, address, or issue before confirmation"
 * This tool handles conversational edge cases where a user corrects a previous detail.
 */
const edit_ticket = llm.tool({
    description: 'Updates a specific detail of the ticket (name, phone, address, or issue) if the user provides a correction.',
    parameters: z.object({
        confirmationNumber: z.string().describe('The confirmation number provided during the draft phase'),
        field: z.enum(['customerName', 'customerPhone', 'customerAddress', 'issueDescription']),
        newValue: z.string().describe('The new, corrected value provided by the user'),
    }),
    execute: async ({ confirmationNumber, field, newValue }) => {
        // Dynamically creates the payload for the MongoDB update operator ($set).
        const updatePayload = { [field]: newValue };

        const success = await updateTicket(confirmationNumber, updatePayload);

        if (success) {
            return `I have successfully updated the ${field} to ${newValue}.`;
        } else {
            // Fallback response if the database update fails but the session context is maintained.
            return `I couldn't find a ticket with that number, but I have noted the change to ${newValue} for our confirmation.`;
        }
    },
});

/**
 * Exports the required tools as a unified object for the LiveKit AgentSession.
 */
export const ticketTools = {
    create_ticket,
    edit_ticket,
};