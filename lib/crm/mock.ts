export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'Lead' | 'Customer' | 'Lost';
  lastContact: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  channel: 'whatsapp' | 'instagram' | 'gmail' | 'website';
  snippet: string;
  unread: number;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'customer' | 'ai' | 'human';
  content: string;
  timestamp: string;
}

export const mockCustomers: Customer[] = [
  { id: '1', name: 'Rahul', email: 'rahul@example.com', phone: '+91 98765 43210', source: 'WhatsApp', status: 'Lead', lastContact: 'Today' },
  { id: '2', name: 'Priya', email: 'priya@example.com', phone: '+91 87654 32109', source: 'Instagram', status: 'Customer', lastContact: 'Yesterday' },
  { id: '3', name: 'Arun', email: 'arun@example.com', phone: '+91 76543 21098', source: 'Gmail', status: 'Lead', lastContact: 'Today' },
  { id: '4', name: 'Karthik', email: 'karthik@example.com', phone: '+91 65432 10987', source: 'Website', status: 'Lost', lastContact: '2 days ago' },
];

export const mockConversations: Conversation[] = [
  { id: 'c1', customerId: '1', channel: 'whatsapp', snippet: 'How much is the service?', unread: 1 },
  { id: 'c2', customerId: '2', channel: 'instagram', snippet: 'Can I book an appointment?', unread: 0 },
  { id: 'c3', customerId: '3', channel: 'gmail', snippet: 'I\'d like to know your packages.', unread: 2 },
  { id: 'c4', customerId: '4', channel: 'website', snippet: 'Are you open on Sunday?', unread: 0 },
];

export const mockMessages: Record<string, Message[]> = {
  'c1': [
    { id: 'm1', conversationId: 'c1', sender: 'customer', content: 'How much is the service?', timestamp: '10:05 AM' }
  ],
  'c2': [
    { id: 'm2', conversationId: 'c2', sender: 'customer', content: 'Can I book an appointment?', timestamp: '09:12 AM' },
    { id: 'm3', conversationId: 'c2', sender: 'ai', content: 'Yes, of course! We have availability tomorrow at 2 PM. Does that work for you?', timestamp: '09:14 AM' }
  ],
  'c3': [
    { id: 'm4', conversationId: 'c3', sender: 'customer', content: 'I\'d like to know your packages.', timestamp: 'Yesterday' }
  ],
  'c4': [
    { id: 'm5', conversationId: 'c4', sender: 'customer', content: 'Are you open on Sunday?', timestamp: '2 days ago' },
    { id: 'm6', conversationId: 'c4', sender: 'ai', content: 'We are closed on Sundays, but open Monday to Saturday from 9 AM to 6 PM.', timestamp: '2 days ago' }
  ]
};

export const getCustomer = (id: string) => mockCustomers.find(c => c.id === id);
