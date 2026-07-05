import type {
  AiProvider,
  AiRequest,
  AiResponse,
  AiModel,
  ProviderCapabilities,
  ProviderHealthResult,
} from "./interfaces";
import type { AiTransport } from "./transport/types";
import { createMockTransport } from "./transport/mockTransport";

export type LiveProviderOptions = {
  id: string;
  label: string;
  capabilities: ProviderCapabilities;
  transport?: AiTransport;
};

/** Shared live provider implementation — vendor classes only supply config + transport. */
export class LiveProviderBase implements AiProvider {
  readonly id: string;
  readonly label: string;
  readonly capabilities: ProviderCapabilities;
  private readonly transport: AiTransport;

  constructor(options: LiveProviderOptions) {
    this.id = options.id;
    this.label = options.label;
    this.capabilities = options.capabilities;
    this.transport = options.transport ?? createMockTransport(options.id);
  }

  async generateText(request: AiRequest): Promise<AiResponse<string>> {
    const response = await this.transport.send<string>({
      providerId: this.id,
      operation: "generateText",
      request,
    });

    return this.toAiResponse(request, response, String(response.output ?? response.raw ?? ""));
  }

  async generateStructured<T = unknown>(request: AiRequest): Promise<AiResponse<T>> {
    const response = await this.transport.send<T>({
      providerId: this.id,
      operation: "generateStructured",
      request,
    });

    return this.toAiResponse(request, response, (response.output ?? {}) as T);
  }

  async health(): Promise<ProviderHealthResult> {
    const started = Date.now();
    const response = await this.transport.send({
      providerId: this.id,
      operation: "health",
    });

    return {
      available: response.available ?? true,
      latencyMs: response.latencyMs ?? Date.now() - started,
      message: response.message,
      transportMode: this.transport.mode,
      hasApiKey: Boolean(response.metadata?.hasApiKey),
    };
  }

  async listModels(): Promise<AiModel[]> {
    const response = await this.transport.send({
      providerId: this.id,
      operation: "listModels",
    });

    return (response.models ?? this.capabilities.models).map((model) => ({
      id: model.id,
      label: model.label,
      contextWindow: model.contextWindow,
      supportedOutputs: model.supportedOutputs,
      default: model.default,
    }));
  }

  private toAiResponse<T>(
    request: AiRequest,
    transportResponse: Awaited<ReturnType<AiTransport["send"]>>,
    output: T,
  ): AiResponse<T> {
    const usage = transportResponse.usage ?? {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    };

    return {
      output,
      raw: transportResponse.raw,
      modelId: transportResponse.modelId ?? request.modelId,
      providerId: this.id,
      usage,
      finishReason: transportResponse.finishReason ?? "stop",
      metadata: transportResponse.metadata,
    };
  }
}
