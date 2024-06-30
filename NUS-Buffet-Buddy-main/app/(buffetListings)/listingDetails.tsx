import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, FlatList, ScrollView } from 'react-native';
import { ref, onValue, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { FIREBASE_RDB } from '../../firebase/firebase';

const ListingDetails = ({ route, navigation }) => {
  const { listingId } = route.params; // access the listingId parameter
  const [listingData, setListingData] = useState({}); // initialize an empty object to store the listing data
  const [comments, setComments] = useState([]); // state to store comments
  const [newComment, setNewComment] = useState(''); // state to store new comment text
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const listingRef = ref(FIREBASE_RDB, `foodListings/${listingId}`); // create a reference to the listing node
    onValue(listingRef, (snapshot) => {
      const data = snapshot.val(); // get the data from the snapshot
      setListingData(data); // update the state with the listing data
      setComments(data.comments ? Object.entries(data.comments).map(([key, value]) => ({ id: key, ...value })) : []); // fetch comments
    });
  }, [listingId]); // re-run the effect when listingId changes

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
  };

  const addComment = async () => {
    if (newComment.trim() === '') {
      return;
    }
    
    const commentsRef = ref(FIREBASE_RDB, `foodListings/${listingId}/comments`);
    const newCommentRef = push(commentsRef);
    const commentData = {
      userId: currentUser.uid,
      userName: currentUser.displayName,
      text: newComment,
      timestamp: new Date().toISOString()
    };

    await set(newCommentRef, commentData);
    setNewComment('');
  };

  return (
    <View style={styles.bigContainer}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.topContainer}>
              <Text style={styles.unbolded}>
                <Text style={styles.listingDetails}>Location: </Text>{listingData.location}
              </Text>
              <Text style={styles.unbolded}>
                <Text style={styles.listingDetails}>Clearing by: </Text>{formatDateTime(listingData.clearTime)}
              </Text>
            </View>

            <View style={styles.picContainer}>
              <Image
                source={require('../../assets/images/test_picture.jpg')}
                style={{ width: 200, height: 200 }}
              />
            </View>

            <View style={styles.bottomContainer}>
              <Text style={styles.unbolded}>
                <Text style={styles.listingDetails}>Food Available: </Text>{listingData.foodAvail}
              </Text>

              <Text style={styles.unbolded}>
                <Text style={styles.listingDetails}>Description: </Text>{listingData.description}
              </Text>

              <Text style={styles.unbolded}>
                <Text style={styles.listingDetails}>Allergens: </Text>{listingData.allergens}
              </Text>

              <Text style={styles.unbolded}>
                <Text style={styles.listingDetails}>Halal: </Text>{listingData.halalCert ? 'Yes' : 'No'}
              </Text>

              <Text style={styles.unbolded}>
                <Text style={styles.listingDetails}>Cutlery: </Text>{listingData.cutleryAvail ? 'Available' : 'Not Available'}
              </Text>

              <Text style={styles.unbolded}>
                <Text style={styles.listingDetails}>Posted by: </Text>{listingData.userName}
              </Text>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={styles.commentsContainer}>
            <Text style={styles.commentsTitle}>Comments</Text>

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
              />
              <Button title="Post" onPress={addComment} />
            </View>

            <ScrollView style={styles.commentsScroll}>
              {comments.map((item) => (
                <View key={item.id} style={styles.commentContainer}>
                  <Text style={styles.commentAuthor}>{item.userName}:</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.commentTimestamp}>{formatDateTime(item.timestamp)}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  topContainer: {
    marginBottom: 20,
  },
  picContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomContainer: {
    marginBottom: 20,
  },
  listingDetails: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#001a4d'
  },
  unbolded: {
    fontSize: 20,
  },
  commentsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  commentsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#001a4d'
  },
  commentsScroll: {
    maxHeight: 200,
  },
  commentContainer: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  commentAuthor: {
    fontWeight: 'bold',
  },
  commentText: {
    marginVertical: 5,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#888',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    padding: 10
  },
  footerPadding: {
    height: 50,
  }
});

export default ListingDetails;
