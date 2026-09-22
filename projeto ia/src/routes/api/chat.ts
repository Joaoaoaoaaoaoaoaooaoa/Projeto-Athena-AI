import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { z } from "zod";

import { ATHENA_SYSTEM_PROMPT, createAthenaModel } from "@/lib/ai-gateway.server";

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(50),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = BodySchema.parse(await request.json());
        } catch {
          return new Response("Mensagem inválida.", { status: 400 });
        }

        try {
          const result = streamText({
            model: createAthenaModel(),
            system: ATHENA_SYSTEM_PROMPT,
            messages: parsed.messages,
            providerOptions: {
              openai: {
                forceReasoning: true,
                reasoningEffort: "low",
                store: false,
              },
            },
          });

          return result.toTextStreamResponse();
        } catch (error) {
          const status =
            typeof error === "object" &&
            error !== null &&
            "statusCode" in error &&
            typeof (error as { statusCode?: number }).statusCode === "number"
              ? (error as { statusCode: number }).statusCode
              : 500;
          const message =
            status === 402
              ? "Os créditos de IA acabaram. Adicione créditos para continuar conversando com a Athena."
              : status === 429
                ? "Muitas mensagens ao mesmo tempo. Espere alguns segundos e tente de novo."
                : error instanceof Error
                  ? error.message
                  : "Não consegui responder agora.";
          console.error("Athena chat error", status, error);
          return new Response(message, { status });
        }
      },
    },
  },
});
