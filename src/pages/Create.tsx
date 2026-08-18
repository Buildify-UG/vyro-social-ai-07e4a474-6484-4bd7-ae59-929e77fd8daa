import { useState } from 'react';
import { ImagePlus, Video, Zap, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Create() {
  const [activeTab, setActiveTab] = useState('post');

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Create</h1>

        <div className="grid grid-cols-2 gap-4">
          {/* Create Post */}
          <div
            onClick={() => setActiveTab('post')}
            className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-2 border-blue-500/20 cursor-pointer hover:border-blue-500/40 transition"
          >
            <Type className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-bold text-lg mb-1">Post</h3>
            <p className="text-sm text-muted-foreground">Share your thoughts</p>
          </div>

          {/* Create Story */}
          <div
            onClick={() => setActiveTab('story')}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-2 border-purple-500/20 cursor-pointer hover:border-purple-500/40 transition"
          >
            <Zap className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="font-bold text-lg mb-1">Story</h3>
            <p className="text-sm text-muted-foreground">24-hour update</p>
          </div>

          {/* Create Short Video */}
          <div
            onClick={() => setActiveTab('short')}
            className="p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-600/10 border-2 border-pink-500/20 cursor-pointer hover:border-pink-500/40 transition"
          >
            <Video className="w-8 h-8 text-pink-500 mb-3" />
            <h3 className="font-bold text-lg mb-1">Short Video</h3>
            <p className="text-sm text-muted-foreground">Vertical video</p>
          </div>

          {/* Upload Media */}
          <div
            onClick={() => setActiveTab('media')}
            className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/20 cursor-pointer hover:border-green-500/40 transition"
          >
            <ImagePlus className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-bold text-lg mb-1">Photo/Video</h3>
            <p className="text-sm text-muted-foreground">Upload media</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-8 p-6 bg-card rounded-xl border border-border">
          {activeTab === 'post' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Create a Post</h2>
              <textarea
                placeholder="What's on your mind?"
                className="w-full p-4 bg-secondary/50 rounded-lg border border-border focus:border-primary outline-none resize-none min-h-24"
              />
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1">Add Image</Button>
                <Button variant="outline" className="flex-1">Add Video</Button>
                <Button className="flex-1">Post</Button>
              </div>
            </div>
          )}

          {activeTab === 'story' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Create a Story</h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">Take Photo</Button>
                <Button variant="outline" className="w-full">Upload Photo</Button>
                <Button variant="outline" className="w-full">Record Video</Button>
                <Button variant="outline" className="w-full">Add Text</Button>
              </div>
            </div>
          )}

          {activeTab === 'short' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Create Short Video</h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">Record Video</Button>
                <Button variant="outline" className="w-full">Upload Video</Button>
                <Button variant="outline" className="w-full">Add Music</Button>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Upload Media</h2>
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition">
                <ImagePlus className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">Drag and drop media here or click to browse</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
