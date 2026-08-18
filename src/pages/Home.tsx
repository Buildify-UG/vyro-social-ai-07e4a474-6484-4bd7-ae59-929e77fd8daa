import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Post as PostType } from '@/types';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  async function fetchCurrentUser() {
    const { data } = await supabase.auth.getUser();
    setCurrentUser(data.user);
  }

  async function fetchPosts() {
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
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePostCreated = () => {
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Stories Section */}
        <div className="sticky top-0 bg-background z-10 py-4 px-4 border-b border-border">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {/* Add Story Button */}
            <div className="flex-shrink-0 w-16 h-24 rounded-lg bg-secondary/50 flex items-center justify-center cursor-pointer hover:bg-secondary/70 transition">
              <div className="text-center">
                <div className="text-2xl mb-1">+</div>
                <span className="text-xs text-muted-foreground">Your Story</span>
              </div>
            </div>
            {/* Story Items */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 w-16 h-24 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 cursor-pointer hover:ring-2 ring-primary transition" />
            ))}
          </div>
        </div>

        {/* Create Post */}
        <div className="p-4">
          <CreatePost onPostCreated={handlePostCreated} />
        </div>

        {/* Posts Feed */}
        <div className="space-y-4 p-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet. Follow people to see their posts!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onLikeChange={fetchPosts} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
