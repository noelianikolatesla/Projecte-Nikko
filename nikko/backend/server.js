import "dotenv/config";
import express from "express";
import cors from "cors";
import agentPkg from "@aws-sdk/client-bedrock-agent-runtime";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

//configurar la salida del audio
import multer from "multer";
//import fs from "fs";
import { v4 as uuid } from "uuid";

// importar s3 y transcribe
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";


//const upload = multer({ dest: "uploads/" });
const upload = multer({ storage: multer.memoryStorage() });

const pollyClient = new PollyClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});

// configurar s3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});

const transcribe = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});

const { BedrockAgentRuntimeClient, InvokeAgentCommand } = agentPkg;

const app = express();
app.use(cors());
app.use(express.json());

const client = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION,
});

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  console.log("📩 Mensaje recibido:", req.body);
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({
      reply: "Faltan datos para procesar el mensaje.",
    });
  }

  try {
    const command = new InvokeAgentCommand({
      agentId: process.env.BEDROCK_AGENT_ID,
      agentAliasId: process.env.BEDROCK_ALIAS_ID,
      sessionId,
      inputText: message,
    });

    const response = await client.send(command);

    let output = "";

    for await (const event of response.completion) {
      if (event.chunk?.bytes) {
        output += new TextDecoder().decode(event.chunk.bytes);
      }
    }

    res.json({ reply: output || "Estoy aquí contigo 💙" });
  } catch (error) {
    console.error("❌ Error Bedrock:", error);
    res.status(500).json({
      reply:
        "Lo siento, ahora mismo tengo un problema técnico, pero sigo aquí contigo 💙",
    });
  }
});

// configurar amazon polly
app.post("/api/tts", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Texto requerido" });
  }

  try {
    const command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: "mp3",
      VoiceId: "Sergio",
      Engine: "neural",
      LanguageCode: "es-ES",
    });

    const response = await pollyClient.send(command);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "inline",
    });

    response.AudioStream.pipe(res);
  } catch (error) {
    console.error("❌ Error Polly:", error);
    res.status(500).json({ error: "Error generando voz" });
  }
});

// configurar audio subida endopind speech to text
app.post("/api/stt", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "audio_required" });
    }

    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      return res.status(500).json({ error: "S3_BUCKET not defined" });
    }

    const key = `audio/${uuid()}.webm`;

    // 1️⃣ Subir audio a S3 (desde memoria)
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype || "audio/webm",
      })
    );

    const jobName = `job-${uuid()}`;

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

    // 3️⃣ Esperar resultado (polling)
    let transcriptUri;

    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));

      const job = await transcribe.send(
        new GetTranscriptionJobCommand({
          TranscriptionJobName: jobName,
        })
      );

      const status = job.TranscriptionJob.TranscriptionJobStatus;

      if (status === "COMPLETED") {
        transcriptUri = job.TranscriptionJob.Transcript.TranscriptFileUri;
        break;
      }

      if (status === "FAILED") {
        return res.status(500).json({
          error: "transcribe_failed",
          reason: job.TranscriptionJob.FailureReason,
        });
      }
    }

    if (!transcriptUri) {
      return res.status(504).json({ error: "transcribe_timeout" });
    }

    // 4️⃣ Descargar JSON y extraer texto
    const response = await fetch(transcriptUri);
    const data = await response.json();
    const text = data.results.transcripts[0]?.transcript || "";

    return res.json({ text });
  } catch (err) {
    console.error("❌ STT error:", err);
    return res.status(500).json({ error: "stt_failed" });
  }
});

app.listen(3001, () => {
  console.log("✅ Backend activo en http://localhost:3001");
});


