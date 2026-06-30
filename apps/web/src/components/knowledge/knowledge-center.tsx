"use client";

import { KnowledgeSidebar } from "./knowledge-sidebar";
import { DocumentManager } from "./document-manager";
import { RAGPanel } from "./rag-panel";

export function KnowledgeCenter() {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-bg">
      {/* Left Sidebar */}
      <div className="hidden md:block">
        <KnowledgeSidebar />
      </div>

      {/* Center: Document Manager */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DocumentManager />
      </div>

      {/* Right: RAG Panel */}
      <div className="hidden lg:block">
        <RAGPanel />
      </div>
    </div>
  );
}
