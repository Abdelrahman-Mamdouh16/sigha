export type DocumentType = "rental" | "power-of-attorney";

export interface DocumentClause {
  heading?: string;
  body: string;
}

export interface DocumentSectionModel {
  heading: string;
  clauses: DocumentClause[];
}

export interface DocumentPartyModel {
  role: string;
  name: string;
  details?: string;
}

export interface SignatureBlockModel {
  role: string;
  name: string;
}

export interface DocumentModel {
  id: string;
  type: DocumentType;
  title: string;
  place: string;
  date: string;
  introduction: string;
  parties: DocumentPartyModel[];
  sections: DocumentSectionModel[];
  closing: string;
  signatures: SignatureBlockModel[];
  witnesses: SignatureBlockModel[];
  // notices: string[];
  generatedAt: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
