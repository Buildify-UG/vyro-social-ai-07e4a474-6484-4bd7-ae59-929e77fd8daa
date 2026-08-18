import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, Share2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  async function fetchCurrentUser() {
    const { data } = await supabase.auth.getUser();
    setCurrentUser(data.user);
    if (data.user) {
      fetchProfile(data.user.id);
      fetchUserPosts(data.user.id);
    }
  }

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserPosts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  if (loading) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500" />

        {/* Profile Info */}
        <div className="px-4 pb-6">
          <div className="flex items-end justify-between -mt-16 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-background" />
              <div className="pb-2">
                <h1 className="text-2xl font-bold">{profile?.display_name}</h1>
                <p className="text-muted-foreground">@{currentUser?.email?.split('@')[0]}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bio */}
          <p className="text-foreground mb-4">{profile?.bio || 'No bio yet'}</p>

          {/* Stats */}
          <div className="flex gap-6 mb-6">
            <div>
              <p className="font-bold text-lg">{userPosts.length}</p>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
            <div>
              <p className="font-bold text-lg">{profile?.followers_count || 0}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="font-bold text-lg">{profile?.following_count || 0}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
          </div>

          {/* Edit Button */}
          <Button className="w-full mb-6">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border px-4 flex gap-8 sticky top-0 bg-background">
          <button className="py-4 font-semibold border-b-2 border-primary">Posts</button>
          <button className="py-4 text-muted-foreground">Videos</button>
          <button className="py-4 text-muted-foreground">Saved</button>
        </div>

        {/* Posts Grid */}
        <div className="p-4">
          {userPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {userPosts.map((post) => (
                <div key={post.id} className="aspect-square bg-secondary rounded-lg cursor-pointer hover:opacity-80 transition flex items-center justify-center">
                  {post.image_url ? (
                    <img src={post.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <p className="text-center text-sm p-2 line-clamp-2">{post.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
