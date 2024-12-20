import { Paper } from "@/types/paper";

export async function searchPapers(query: string): Promise<Paper[]> {
  const params = new URLSearchParams({ query });

  const response = await fetch(`/api/papers/search?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to search papers: ${response.statusText}`);
  }

  const data = await response.json();

  return data.data.map((paper: any) => ({
    paperId: paper.paperId,
    title: paper.title,
    abstract: paper.abstract,
    authors:
      paper.authors?.map((author: any) => ({
        name: author.name,
        authorId: author.authorId,
      })) || [],
    year: paper.year,
    citationCount: paper.citationCount || 0,
    url: paper.url,
    venue: paper.venue,
    publicationDate: paper.publicationDate,
    fieldsOfStudy: paper.fieldsOfStudy,
  }));
}

export async function getPaperDetails(paperId: string): Promise<Paper> {
  const response = await fetch(`/api/papers/${paperId}`);

  if (!response.ok) {
    throw new Error(`Failed to get paper details: ${response.statusText}`);
  }

  const paper = await response.json();

  return {
    paperId: paper.paperId,
    title: paper.title,
    abstract: paper.abstract,
    authors:
      paper.authors?.map((author: any) => ({
        name: author.name,
        authorId: author.authorId,
      })) || [],
    year: paper.year,
    citationCount: paper.citationCount || 0,
    url: paper.url,
    venue: paper.venue,
    publicationDate: paper.publicationDate,
    fieldsOfStudy: paper.fieldsOfStudy,
  };
}
