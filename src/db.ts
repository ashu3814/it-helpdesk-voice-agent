import { MongoClient, Collection, ObjectId } from 'mongodb';

/**
 * Defines the structure for IT Support Tickets as per assignment requirements.
 * Ensures data consistency across the application and the database.
 */
export interface Ticket {
    _id?: ObjectId;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    issueDescription: string;
    quotedPrice: number;
    confirmationNumber: string;
    status: 'draft' | 'confirmed';
    createdAt: Date;
}

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/livekit-ai-project';
const client = new MongoClient(uri);

let ticketsCollection: Collection<Ticket>;

/**
 * Initializes the connection to the local MongoDB instance.
 * Sets up the 'it_helpdesk' database and 'tickets' collection for use.
 */
export async function connectDB() {
    try {
        await client.connect();
        const db = client.db('it_helpdesk');
        ticketsCollection = db.collection<Ticket>('tickets');
        console.log('✅ MongoDB Connected: it_helpdesk/tickets');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        throw error;
    }
}

/**
 * Persists a new, confirmed ticket to the database.
 * includes a simulated email notification to fulfill the assignment's 
 * "email it on their email ID" requirement.
 */
export async function saveTicket(ticketData: Omit<Ticket, 'createdAt' | 'status' | '_id'>) {
    const newTicket: Ticket = {
        ...ticketData,
        status: 'confirmed',
        createdAt: new Date(),
    };

    const result = await ticketsCollection.insertOne(newTicket);

    // Placeholder for email service integration (e.g., SendGrid/Nodemailer)
    console.log(`📧 SIMULATED EMAIL: Sending confirmation #${newTicket.confirmationNumber} to ${newTicket.customerEmail}...`);
    
    return result.insertedId;
}

/**
 * Updates specific fields of an existing ticket.
 * This function supports the mandatory 'edit_ticket' tool call, 
 * allowing the agent to handle mid-conversation user corrections.
 */
export async function updateTicket(confirmationNumber: string, updateData: Partial<Ticket>) {
    try {
        const result = await ticketsCollection.updateOne(
            { confirmationNumber: confirmationNumber },
            { $set: updateData }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('❌ MongoDB Update Error:', error);
        return false;
    }
}

/**
 * Closes the database client. 
 * Essential for maintaining resource integrity during worker shutdown.
 */
export async function closeDB() {
    await client.close();
}