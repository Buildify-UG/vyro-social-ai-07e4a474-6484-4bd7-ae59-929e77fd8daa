import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Send, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Messages() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();
  }, []);

  async function fetchCurrentUser() {
    const { data } = await supabase.auth.getUser();
    setCurrentUser(data.user);
  }

  async function fetchConversations() {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, username, profiles(display_name, avatar_url)),
          recipient:recipient_id(id, username, profiles(display_name, avatar_url))
        `)
        .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation
      const grouped = new Map();
      data?.forEach((msg) => {
        const otherId = msg.sender_id === currentUser.id ? msg.recipient_id : msg.sender_id;
        if (!grouped.has(otherId)) {
          grouped.set(otherId, msg);
        }
      });

      setConversations(Array.from(grouped.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }

  async function fetchMessages(conversationId: string) {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, username, profiles(display_name, avatar_url)),
          recipient:recipient_id(id, username, profiles(display_name, avatar_url))
        `)
        .or(`and(sender_id.eq.${currentUser.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('recipient_id', currentUser.id)
        .eq('sender_id', conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUser.id,
          recipient_id: selectedConversation.sender_id === currentUser.id 
            ? selectedConversation.recipient_id 
            : selectedConversation.sender_id,
          content: newMessage,
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedConversation.sender_id === currentUser.id 
        ? selectedConversation.recipient_id 
        : selectedConversation.sender_id);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Conversations List */}
      <div className="w-full md:w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No conversations yet</p>
              <Button variant="outline" size="sm" className="mt-4">
                <Plus className="w-4 h-4 mr-2" /> Start Chat
              </Button>
            </div>
          ) : (
            conversations.map((conv) => {
              const otherUser = conv.sender_id === currentUser?.id ? conv.recipient : conv.sender;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv);
                    fetchMessages(otherUser.id);
                  }}
                  className={`p-3 border-b border-border cursor-pointer hover:bg-secondary/50 transition ${
                    selectedConversation?.id === conv.id ? 'bg-secondary' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{otherUser.profiles?.display_name || otherUser.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{conv.content}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border">
              <h2 className="font-bold">
                {selectedConversation.sender_id === currentUser?.id 
                  ? selectedConversation.recipient?.profiles?.display_name || selectedConversation.recipient?.username
                  : selectedConversation.sender?.profiles?.display_name || selectedConversation.sender?.username}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender_id === currentUser?.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-foreground'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
