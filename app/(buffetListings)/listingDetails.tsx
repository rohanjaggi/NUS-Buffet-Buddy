import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, FlatList, ScrollView, Switch, TouchableOpacity, Linking } from 'react-native';
import { ref, onValue, push, set, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { FIREBASE_DB, FIREBASE_RDB } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const ListingDetails = ({ route, navigation }) => {
  const { listingId } = route.params;
  const [listingData, setListingData] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [canToggleActive, setCanToggleActive] = useState(true);
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const listingRef = ref(FIREBASE_RDB, `foodListings/${listingId}`);
    onValue(listingRef, (snapshot) => {
      const data = snapshot.val();
      setListingData(data);
      setComments(data.comments ? Object.entries(data.comments).map(([key, value]) => ({ id: key, ...value })) : []);
      checkActiveStatus(data);
    });
  }, [listingId]);

  const checkActiveStatus = (data) => {
    const now = new Date();
    const clearDate = new Date(data.clearTime);
    const activeDate = new Date(data.activeTime);
    if (clearDate < now) {
      setIsActive(false);
      setCanToggleActive(false);
      update(ref(FIREBASE_RDB, `foodListings/${listingId}`), { isActive: false });
    } else {
      setIsActive(data.isActive !== undefined ? data.isActive : true);
      setCanToggleActive(true);
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedTime} ${formattedDate}`;
  };

  const addComment = async () => {
    if (newComment.trim() === '') {
      return;
    }

    const isOrganiser = currentUser.uid === listingData.userId;

    const commentsRef = ref(FIREBASE_RDB, `foodListings/${listingId}/comments`);
    const newCommentRef = push(commentsRef);
    const commentData = {
      userId: currentUser.uid,
      userName: currentUser.displayName + (isOrganiser ? ' (organiser)' : ''),
      text: newComment,
      timestamp: new Date().toISOString()
    };

    await set(newCommentRef, commentData);
    setNewComment('');
  };

  const toggleActiveStatus = async () => {
    if (!canToggleActive) {
      return;
    }
    const newStatus = !isActive;
    setIsActive(newStatus);
    await update(ref(FIREBASE_RDB, `foodListings/${listingId}`), { isActive: newStatus });
  };

  return (
    <View style={styles.bigContainer}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.topContainer}>
              
              <View style={styles.locationContainer}>
                <Text style={styles.listingDetails}>Location: </Text>
                <TouchableOpacity onPress={() => Linking.openURL(`https://nusmods.com/venues?q=${listingData.location}`)}>
                  <Text style={styles.link}>{listingData.location}</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.unbolded}>
                <Text style={styles.listingDetails}>Clearing by: </Text>{formatDateTime(listingData.clearTime)}
              </Text>
            </View>

            <View style={styles.picContainer}>
              {listingData.imageURL ? (
                <>
                  <Image
                    source={{ uri: listingData.imageURL }}
                    style={{ width: 200, height: 200, borderWidth: 2, borderColor: '#000' }}
                  />
                </>
              ) : (
                <Image
                  source={require('../../assets/images/emoji5.png')}
                  style={{ width: 200, height: 200, borderWidth: 2, borderColor: '#000' }}
                />
              )}
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

              {currentUser.uid === listingData.userId && (
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Active Status</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    value={isActive}
                    onValueChange={toggleActiveStatus}
                    disabled={!canToggleActive}
                  />
                </View>
              )}
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
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00008b'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  link: {
    fontSize: 20,
    color: '#00008b',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    backgroundColor: '#e6f2ff', 
    padding: 0, 
    borderRadius: 20, 
  },
});

export default ListingDetails;
