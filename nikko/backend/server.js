import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuid } from "uuid";
import agentPkg from "@aws-sdk/client-bedrock-agent-runtime";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";

const app = express();
app.use(cors());
app.use(express.json());

// ===== AWS CLIENTS =====
const pollyClient = new PollyClient({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: process.env.AWS_REGION });
const transcribe = new TranscribeClient({ region: process.env.AWS_REGION });

const { BedrockAgentRuntimeClient, InvokeAgentCommand } = agentPkg;
const bedrock = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION,
});

// ===== MULTER (en memoria) =====
const upload = multer({ storage: multer.memoryStorage() });

// ===== HEALTH =====
app.get("/", (_, res) => res.json({ ok: true }));

// =====================
// 💬 CHAT (Bedrock)
// =====================
app.post("/api/chat", async (req, res) => {
  const { message, sessionId } = req.body;

  try {
    const command = new InvokeAgentCommand({
      agentId: process.env.BEDROCK_AGENT_ID,
      agentAliasId: process.env.BEDROCK_ALIAS_ID,
      sessionId,
      inputText: message,
    });

    const response = await bedrock.send(command);
    let output = "";

    for await (const event of response.completion) {
      if (event.chunk?.bytes) {
        output += new TextDecoder().decode(event.chunk.bytes);
      }
    }

    res.json({ reply: output });
  } catch (e) {
    console.error("❌ Bedrock error:", e);
    res.status(500).json({ reply: "Error técnico 💙" });
  }
});

// =====================
// 🔊 TTS (Polly)
// =====================
app.post("/api/tts", async (req, res) => {
  const { text } = req.body;

  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Sergio",
    Engine: "neural",
    LanguageCode: "es-ES",
  });

  const response = await pollyClient.send(command);
  res.set({ "Content-Type": "audio/mpeg" });
  response.AudioStream.pipe(res);
});

// =====================
// 🎤 STT (Transcribe normal OPTIMIZADO)
// =====================
app.post("/api/stt", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "audio_required" });

    const bucket = process.env.S3_BUCKET;
    const key = `audio/${uuid()}.webm`;
    const jobName = `job-${uuid()}`;

    // 1️⃣ Subir audio a S3
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: req.file.buffer,
        ContentType: "audio/webm",
      })
    );

    // 2️⃣ Lanzar Transcribe
    await transcribe.send(
      new StartTranscriptionJobCommand({
        TranscriptionJobName: jobName,
        LanguageCode: "es-ES",
        MediaFormat: "webm",
        Media: {
          MediaFileUri: `s3://${bucket}/${key}`,
        },
      })
    );

    // 3️⃣ Polling rápido (máx 15s)
    let transcriptUri;

    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 1000));

      const job = await transcribe.send(
        new GetTranscriptionJobCommand({
          TranscriptionJobName: jobName,
        })
      );

      const status = job.TranscriptionJob.TranscriptionJobStatus;

      if (status === "COMPLETED") {
        transcriptUri =
          job.TranscriptionJob.Transcript.TranscriptFileUri;
        break;
      }

      if (status === "FAILED") {
        throw new Error("Transcribe failed");
      }
    }

    if (!transcriptUri) {
      return res.status(504).json({ error: "timeout" });
    }

    // 4️⃣ Descargar texto
    const response = await fetch(transcriptUri);
    const data = await response.json();
    const text = data.results.transcripts[0]?.transcript || "";

    res.json({ text });
  } catch (e) {
    console.error("❌ STT error:", e);
    res.status(500).json({ error: "stt_failed" });
  }
});

app.listen(3001, () => {
  console.log("✅ Backend activo en http://localhost:3001");
});

