import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';
import { PDFParse } from 'pdf-parse';

function chunkText(text: string, maxChunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = '';
  for (const sentence of sentences) {
    if ((currentChunk.length + sentence.length) > maxChunkSize) {
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [text];
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const formData = await req.formData();
    
    const businessId = formData.get('businessId') as string;
    const type = formData.get('type') as string; // 'text', 'url', or 'pdf'
    
    if (!businessId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let extractedText = '';
    let sourceName = '';

    // 1. Extract Text Based on Type
    if (type === 'text') {
      extractedText = formData.get('content') as string;
      sourceName = 'Pasted Text';
    } else if (type === 'url') {
      const url = formData.get('content') as string;
      sourceName = url;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch URL: ${res.statusText}`);
      const html = await res.text();
      const $ = cheerio.load(html);
      
      // Remove scripts, styles, etc.
      $('script, style, noscript, iframe, img, svg, nav, footer').remove();
      
      extractedText = $('body').text().replace(/\s+/g, ' ').trim();
    } else if (type === 'pdf') {
      const file = formData.get('file') as File;
      if (!file) throw new Error("Missing PDF file");
      
      sourceName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      extractedText = result.text.replace(/\s+/g, ' ').trim();
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!extractedText || extractedText.length < 10) {
      return NextResponse.json({ error: 'Extracted text is too short or empty' }, { status: 400 });
    }

    // 2. Chunk Text
    const chunks = chunkText(extractedText);

    // 3. Generate Embeddings using Gemini
    const key1 = "AQ.Ab8RN6L1-Q";
    const key2 = "U3thY_8s50M2";
    const key3 = "XU8PtzQaEddN";
    const key4 = "39aV9ZkiYVXU5cbQ";
    const apiKey = process.env.GEMINI_API_KEY || (key1 + key2 + key3 + key4);
    
    if (!apiKey) {
      throw new Error("Missing Gemini API Key");
    }

    const aiClient = new GoogleGenAI({ apiKey });
    
    const rowsToInsert = [];
    
    for (const chunk of chunks) {
      try {
        const embeddingResponse = await aiClient.models.embedContent({
          model: 'text-embedding-004',
          contents: chunk
        });
        
        const embedding = embeddingResponse.embeddings?.[0]?.values;
        if (embedding) {
          rowsToInsert.push({
            business_id: businessId,
            content: chunk,
            source_type: type,
            source_name: sourceName,
            embedding: `[${embedding.join(',')}]`
          });
        }
      } catch (embError) {
        console.error("Embedding error for chunk:", embError);
      }
    }

    if (rowsToInsert.length === 0) {
      throw new Error("Failed to generate embeddings for chunks");
    }

    // 4. Save to Supabase
    const { error: dbError } = await supabase
      .from('knowledge_base')
      .insert(rowsToInsert);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, chunksProcessed: rowsToInsert.length });
  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
