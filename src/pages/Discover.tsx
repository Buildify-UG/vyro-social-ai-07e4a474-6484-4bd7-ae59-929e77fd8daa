import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Trending, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchTrendingContent();
    fetchSuggestedUsers();
  }, []);

  async function fetchTrendingContent() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:user_id(
            id,
            username,
            profiles(display_name, avatar_url)
          )
        `)
        .order('likes_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTrendingPosts(data || []);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  }

  async function fetchSuggestedUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

      if (error) throw error;
      setSuggestedUsers(data || []);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="sticky top-0 bg-background z-10 p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search users, posts, hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="p-4 space-y-8">
          {/* Trending Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Trending className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {trendingPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-lg bg-card border border-border hover:bg-secondary/50 transition cursor-pointer">
                  <p className="text-sm line-clamp-2">{post.content}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {post.likes_count} likes • {post.comments_count} comments
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Suggested Users */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Suggested Users</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {suggestedUsers.map((user) => (
                <div key={user.id} className="p-4 rounded-lg bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-2" />
                  <h3 className="font-semibold text-sm">{user.display_name}</h3>
                  <p className="text-xs text-muted-foreground">{user.followers_count} followers</p>
                  <button className="mt-2 w-full py-1 px-2 bg-primary text-primary-foreground rounded text-xs font-medium hover:opacity-90 transition">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
