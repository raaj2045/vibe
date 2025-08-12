"use client";

import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { MessagesContainer } from "../components/messages-container";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";

interface Props {
    projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

    const trpc = useTRPC();
    const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId
    }));

    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    className="flex flex-col min-h-0"
                    defaultSize={35}
                    minSize={20}
                >
                    <Suspense fallback={<p>Loading...</p>}>
                        <ProjectHeader
                            projectId={projectId}
                        />
                    </Suspense>
                    <Suspense fallback={<p>Loading...</p>}>
                        <MessagesContainer
                            projectId={projectId}
                            activeFragment={activeFragment}
                            setActiveFragment={setActiveFragment}
                        />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >
                    TODO: Preview
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )

}