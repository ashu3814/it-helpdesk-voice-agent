import 'dotenv/config';
import {
    type JobContext,
    WorkerOptions,
    cli,
    defineAgent,
    voice,
    inference,
} from '@livekit/agents';
import * as silero from '@livekit/agents-plugin-silero';
import * as deepgram from '@livekit/agents-plugin-deepgram';
import { fileURLToPath } from 'node:url';
import { connectDB } from './db.js';
import { ticketTools } from './tools.js';
import { IT_ASSISTANT_PROMPT } from './prompts.js';

/**
 * LiveKit Agent Definition
 * This core engine manages the lifecycle of the voice assistant.
 */
export default defineAgent({
    // Pre-loads the Voice Activity Detection (VAD) model to eliminate startup lag.
    // This is critical for meeting the sub-2-second latency requirement.
    prewarm: async (proc) => {
        proc.userData.vad = await silero.VAD.load();
    },

    entry: async (ctx: JobContext) => {
        try {
            // Establishes real-time connection to the room and the local MongoDB database.
            await ctx.connect();
            await connectDB();

            console.log(`🚀 Agent joined room: ${ctx.room.name}`);

            // Configures the 'Brain' of the system with business rules and functional tools.
            const agent = new voice.Agent({
                instructions: IT_ASSISTANT_PROMPT,
                tools: ticketTools,
            });

            // Pipeline Configuration: STT -> LLM -> TTS
            // Deepgram is used for both speech-to-text and text-to-speech to ensure stability and high performance.
            const session = new voice.AgentSession({
                stt: new deepgram.STT(),
                llm: new inference.LLM({ model: 'openai/gpt-4o-mini' }),
                tts: new deepgram.TTS(),
                vad: ctx.proc.userData.vad! as silero.VAD,
            });

            // Initiates the voice processing session.
            await session.start({ agent, room: ctx.room });

            // Triggers a proactive greeting as soon as the agent connects.
            await session.generateReply({
                instructions: "Professionally greet the caller and ask for their name and email.",
            });

        } catch (error) {
            console.error("🔥 Session Error:", error);
        }
    },
});

// Starts the worker process to listen for incoming support calls.
cli.runApp(new WorkerOptions({
    agent: fileURLToPath(import.meta.url)
}));