// types/index.ts
export interface Song {
  id: string;
  title: string;
  artist: string;
  verseReference: string;
  theme: string;
}

export interface Favorite {
  songId: string;
  dateAdded: Date;
}

export interface SearchResult {
  verse: string;
  songs: Song[];
}