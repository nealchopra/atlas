export interface Author {
  name: string;
  authorId?: string;
}

export interface Paper {
  paperId: string;
  title: string;
  abstract?: string;
  authors: Author[];
  year?: number;
  citationCount: number;
  url?: string;
  venue?: string;
  publicationDate?: string;
  fieldsOfStudy?: string[];
} 