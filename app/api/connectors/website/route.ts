import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { businessId, message, sessionId } = await req.json();

    if (!businessId || !message || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Find or Create Customer
    let { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('business_id', businessId)
      .eq('identifier', sessionId)
      .single();

    if (!customer) {
      const { data: newCustomer, error: newCustomerError } = await supabase
        .from('customers')
        .insert({
          business_id: businessId,
          identifier: sessionId,
          name: 'Website Visitor',
        })
        .select('id')
        .single();
      
      if (newCustomerError) throw newCustomerError;
      customer = newCustomer;
    }

    // 2. Find or Create Conversation
    let { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('id')
      .eq('business_id', businessId)
      .eq('customer_id', customer.id)
      .eq('status', 'open')
      .single();

    if (!conversation) {
      const { data: newConversation, error: newConvError } = await supabase
        .from('conversations')
        .insert({
          business_id: businessId,
          customer_id: customer.id,
          channel: 'website',
        })
        .select('id')
        .single();
      
      if (newConvError) throw newConvError;
      conversation = newConversation;
    }

    // 3. Save User Message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_type: 'customer',
        content: message,
      });

    // 4. Mock AI Response (Fallback because no Gemini Key is available)
    const aiResponseText = "Hi there! I am the OMNI AI Engine. I've received your message and saved it directly to the Supabase database. A human agent will get back to you shortly!";

    // 5. Save AI Message
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_type: 'ai',
        content: aiResponseText,
      });

    return NextResponse.json({ success: true, reply: aiResponseText });
  } catch (error: any) {
    console.error('Error in website connector:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
