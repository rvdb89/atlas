import { executeTask } from "@/atlas/ai/router/executeTask";
import { resolveWriteTask } from "@/atlas/ai/tasks/publishingBridge";
import type { GenerationBrief } from "@/atlas/publishing/types";
import type { CopywriterOutput } from "@/atlas/publishing/agents/coreAgents";

export class DoughbertCopywriterAgent {
  id = "copywriter-v1";

  async generate(brief: GenerationBrief) {
    const started = Date.now();
    const task = resolveWriteTask(brief.contentType);

    const execution = await executeTask<CopywriterOutput>({
      task,
      payload: { brief },
      agentId: "copywriter",
      moduleId: "doughbert",
    });

    return {
      agent: this.id,
      durationMs: Date.now() - started,
      output: execution.output,
      warnings: execution.warnings,
    };
  }
}

export const doughbertCopywriterAgent = new DoughbertCopywriterAgent();
