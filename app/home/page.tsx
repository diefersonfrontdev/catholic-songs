"use client"
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Song, SearchResult, Favorite } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, HeartOff } from 'lucide-react';

export default function Home() {
  const [verse, setVerse] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favoritesRef = collection(db, 'favorites');
    const snapshot = await getDocs(favoritesRef);
    const favSet = new Set(snapshot.docs.map(doc => doc.data().songId));
    setFavorites(favSet);
  };

  const toggleFavorite = async (song: Song) => {
    const newFavorites = new Set(favorites);
    
    if (favorites.has(song.id)) {
      // Remove from favorites
      const favoritesRef = collection(db, 'favorites');
      const q = query(favoritesRef, where('songId', '==', song.id));
      const snapshot = await getDocs(q);
      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      newFavorites.delete(song.id);
    } else {
      // Add to favorites
      const favorite: Favorite = {
        songId: song.id,
        dateAdded: new Date()
      };
      await addDoc(collection(db, 'favorites'), favorite);
      newFavorites.add(song.id);
    }
    
    setFavorites(newFavorites);
  };

  const searchSongs = async () => {
    setLoading(true);
    try {
      const songsRef = collection(db, 'songs');
      const themes = determineThemes(verse.toLowerCase());
      
      const songQueries = themes.map(theme => 
        query(songsRef, where('theme', '==', theme))
      );

      const songsSnapshots = await Promise.all(
        songQueries.map(q => getDocs(q))
      );

      const songs: Song[] = [];
      songsSnapshots.forEach(snapshot => {
        snapshot.docs.forEach(doc => {
          songs.push({ id: doc.id, ...doc.data() } as Song);
        });
      });

      setResults({ verse, songs });
    } catch (error) {
      console.error('Error searching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const determineThemes = (verse: string): string[] => {
    const themes: string[] = [];
    if (verse.includes('maria') || verse.includes('ave')) themes.push('maria');
    if (verse.includes('pão') || verse.includes('corpo')) themes.push('eucaristia');
    if (verse.includes('cruz') || verse.includes('salvação')) themes.push('salvação');
    if (verse.includes('criar') || verse.includes('céus')) themes.push('criação');
    if (themes.length === 0) themes.push('adoração');
    return themes;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            Encontre Músicas Católicas por Versículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Digite o versículo ou trecho bíblico..."
                value={verse}
                onChange={(e) => setVerse(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={searchSongs}
                disabled={loading || !verse.trim()}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>

            {results && results.songs.length > 0 && (
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-4">
                  {results.songs.map((song) => (
                    <Card key={song.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{song.title}</h3>
                            <p className="text-sm text-gray-500">
                              Artista: {song.artist}
                            </p>
                            <p className="text-sm text-gray-500">
                              Referência: {song.verseReference}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(song)}
                          >
                            {favorites.has(song.id) ? (
                              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            ) : (
                              <HeartOff className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}

            {results && results.songs.length === 0 && (
              <p className="text-center text-gray-500">
                Nenhuma música encontrada para este versículo.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}