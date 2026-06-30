export interface KnowledgeDocument {
  id: string;
  filename: string;
  contentType: "pdf" | "docx" | "txt" | "md" | "pptx";
  size: number;
  category: string;
  tags: string[];
  chunkCount: number;
  status: "processing" | "ready" | "error";
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeStats {
  totalDocuments: number;
  totalChunks: number;
  totalEmbeddings: number;
  storageUsed: string;
}

export interface ChunkInfo {
  id: string;
  documentId: string;
  content: string;
  pageNumber?: number;
  chunkIndex: number;
  metadata: Record<string, unknown>;
}

export interface RetrievalResult {
  chunkId: string;
  documentId: string;
  documentName: string;
  pageNumber?: number;
  content: string;
  similarity: number;
}

export interface RAGQuery {
  query: string;
  topK?: number;
  category?: string;
}

export interface RAGAnswer {
  answer: string;
  sources: RetrievalResult[];
  retrievalCount: number;
  responseTime: number;
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  count: number;
  icon: string;
}
