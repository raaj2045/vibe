import {Sandbox} from '@e2b/code-interpreter';

import { openai, createAgent} from "@inngest/agent-kit";

import { inngest } from './client';
import { models } from "inngest";
import { getSandbox } from './util';

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        const sandboxId = await step.run("get-sandbox-id", async() => {
            const sandbox = await Sandbox.create("vibe-nextjs-raaj-01")
            return sandbox.sandboxId;
        })
        const summarizer = createAgent({
            name: "writer",
            system: "You are an expert summarizer. You summarize in 2 words.",
            model: openai({
                model: "gpt-4o",
            })
        })

        const { output } = await summarizer.run(
            `Summarize the following text: ${event.data.value}`
        )

        const sandboxUrl = await step.run("get-sandbox-url", async () => {
            const sandbox = await getSandbox(sandboxId);
            const host = sandbox.getHost(3000);
            return `https://${host}`;
        });

        return {
            output, sandboxUrl
        };
    }
)