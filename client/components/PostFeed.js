import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockPosts = [
    {
      id: '1',
      user: {
        username: 'farmer_john',
        name: 'John Smith',
        profilePicture: 'https://example.com/profile1.jpg'
      },
      title: 'Cow with milk fever',
      description: 'My cow is showing signs of milk fever after calving. Any advice?',
      images: ['https://example.com/cow1.jpg'],
      location: 'Dairy Farm, Punjab',
      tags: [{ username: 'dr_ahmed', name: 'Dr. Ahmed' }],
      commentsCount: 12,
      createdAt: '2023-06-15T10:30:00Z'
    },
    {
      id: '2',
      user: {
        username: 'goat_farmer',
        name: 'Ali Khan',
        profilePicture: 'https://example.com/profile2.jpg'
      },
      title: 'Goat with breathing issues',
      description: 'Young goat having difficulty breathing. Started yesterday.',
      images: ['https://example.com/goat1.jpg', 'https://example.com/goat2.jpg'],
      location: 'Goat Farm, Sindh',
      tags: [],
      commentsCount: 8,
      createdAt: '2023-06-14T15:45:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLike = (postId) => {
    // Implement like functionality
    console.log('Liked post:', postId);
  };

  const handleComment = (postId) => {
    // Implement comment functionality
    console.log('Comment on post:', postId);
  };

  const handleTag = (postId) => {
    // Implement tag functionality
    console.log('Tag user in post:', postId);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading posts...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {posts.map((post) => (
        <View key={post.id} style={styles.postContainer}>
          <View style={styles.postHeader}>
            <Image source={{ uri: post.user.profilePicture }} style={styles.profilePicture} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{post.user.username}</Text>
              <Text style={styles.name}>{post.user.name}</Text>
            </View>
            <Text style={styles.postTime}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </View>
          
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDescription}>{post.description}</Text>
          
          {post.images && post.images.length > 0 && (
            <ScrollView horizontal style={styles.imageContainer}>
              {post.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.postImage} />
              ))}
            </ScrollView>
          )}
          
          <Text style={styles.location}>{post.location}</Text>
          
          {post.tags && post.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsLabel}>Tagged:</Text>
              {post.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>@{tag.username}</Text>
              ))}
            </View>
          )}
          
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(post.id)}>
              <Text style={styles.actionText}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(post.id)}>
              <Text style={styles.actionText}>Comment ({post.commentsCount})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleTag(post.id)}>
              <Text style={styles.actionText}>Tag Expert</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10
  },
  postContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  userInfo: {
    flex: 1
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16
  },
  name: {
    color: '#666',
    fontSize: 14
  },
  postTime: {
    color: '#999',
    fontSize: 12
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  postDescription: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20
  },
  imageContainer: {
    marginBottom: 10
  },
  postImage: {
    width: 300,
    height: 200,
    marginRight: 10,
    borderRadius: 5
  },
  location: {
    color: '#007AFF',
    fontSize: 14,
    marginBottom: 10
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  tagsLabel: {
    fontWeight: 'bold',
    marginRight: 5
  },
  tag: {
    color: '#007AFF',
    marginRight: 10
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10
  },
  actionButton: {
    padding: 5
  },
  actionText: {
    color: '#007AFF',
    fontWeight: '500'
  }
});

export default PostFeed;