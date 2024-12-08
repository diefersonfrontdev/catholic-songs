// app/api/embeddings/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, getDocs, where } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  // ... outras configs do Firebase
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configuração do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    // Gerar embedding usando o Gemini
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding;

    return Response.json({ embedding });
  } catch (error) {
    console.error('Erro ao gerar embedding:', error);
    return Response.json({ error: 'Erro ao processar embedding' }, { status: 500 });
  }
}

// utils/firebase.ts
// Função para salvar documento com embedding
export async function saveDocumentWithEmbedding(
  text: string, 
  embedding: number[], 
  metadata: any = {}
) {
  try {
    const docRef = await addDoc(collection(db, 'documents'), {
      text,
      embedding,
      metadata,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar documento:', error);
    throw error;
  }
}

// Função para buscar documentos similares
export async function searchSimilarDocuments(
  queryEmbedding: number[],
  threshold: number = 0.7,
  limit: number = 5
) {
  const documents: any[] = [];
  
  // Buscar todos os documentos
  // Nota: Em produção, você deve implementar paginação
  const querySnapshot = await getDocs(collection(db, 'documents'));
  
  // Calcular similaridade
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const similarity = cosineSimilarity(queryEmbedding, data.embedding);
    
    if (similarity >= threshold) {
      documents.push({
        id: doc.id,
        ...data,
        similarity
      });
    }
  });
  
  // Ordenar por similaridade e limitar resultados
  return documents
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

// Função auxiliar para calcular similaridade por cosseno
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
}

// Exemplo de uso em um componente ou rota do Next.js
async function handleSearch(searchText: string) {
  // 1. Gerar embedding para o texto de busca
  const response = await fetch('/api/embeddings', {
    method: 'POST',
    body: JSON.stringify({ text: searchText })
  });
  const { embedding } = await response.json();
  
  // 2. Buscar documentos similares
  const similarDocuments = await searchSimilarDocuments(embedding);
  return similarDocuments;
}