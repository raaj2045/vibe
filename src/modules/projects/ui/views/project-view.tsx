"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import { Fragment } from "@/generated/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

import { FragmentWeb } from "../components/fragment-web";
import { ProjectHeader } from "../components/project-header";
import { MessagesContainer } from "../components/messages-container";
import { Button } from "@/components/ui/button";
import { FileExplorer } from "@/components/file-explorer";

interface Props {
    projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
    const [tabState, setTabState] = useState<"preview" | "code">("preview");

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
                    <Tabs
                        className="h-full gap-y-0"
                        defaultValue="preview"
                        value={tabState}
                        onValueChange={(value) => setTabState(value as "preview" | "code")}
                    >
                        <div className="w-full flex items-center p-2 border-b gap-x-2">
                            <TabsList className="h-8 p-0 border rounded-md">
                                <TabsTrigger value="preview" className="rounded-md">
                                    <EyeIcon /><span>Demo</span>
                                </TabsTrigger>

                                <TabsTrigger value="code" className="rounded-md">
                                    <CodeIcon /><span>Code</span>
                                </TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-x-2">
                                <Button asChild size="sm" variant="default">
                                    <Link href="/pricing">
                                        <CrownIcon /> Upgrade
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="preview">
                            {!!activeFragment && <FragmentWeb data={activeFragment} />}
                        </TabsContent>

                        <TabsContent value="code" className="min-h-0">
                            {!!activeFragment?.files && <FileExplorer files={activeFragment.files as { [path: string]: string }} />}
                        </TabsContent>
                    </Tabs>

                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )

}