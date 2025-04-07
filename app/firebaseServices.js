// firebaseServices.js
import { db, auth, storage } from "../firebaseConfig";
import { collection, getDocs, addDoc, doc, getDoc, arrayUnion, updateDoc } from "firebase/firestore";


export const fetchBets = async () => {
  try {
    if (!db) {
      console.error("Firestore db is not initialized.");
      return [];
    }

    const querySnapshot = await getDocs(collection(db, "bets"));
    let bets = [];
    querySnapshot.forEach((doc) => {
      bets.push({ id: doc.id, ...doc.data() });
    });
    return bets; // Return the bets array
  } catch (error) {
    console.error("Error fetching bets:", error);
    return [];
  }
};

export const fetchGroupsByID = async (groupIds) => {
    try {
      if (!db) {
        console.error("Firestore db is not initialized.");
        return [];
      }
  
      const groupPromises = groupIds.map(async (groupId) => {
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        return groupDoc.exists() ? { id: groupDoc.id, ...groupDoc.data() } : null;
      });
  
      const groups = await Promise.all(groupPromises);
      return groups.filter((group) => group !== null); // Remove any null values if a group doesn't exist
    } catch (error) {
      console.error("Error fetching groups:", error);
      return [];
    }
  };

  export const createBet = async (betData) => {
    try {
        // Using addDoc to add a new document to Firestore collection
        const docRef = await addDoc(collection(db, "bets"), betData);
        
        console.log("Bet Created:", { id: docRef.id, ...betData });
      } catch (error) {
        console.error("Error creating bet:", error);
      }
  };

  export const createGroup = async (groupData) => {
    try {
        // Using addDoc to add a new document to Firestore collection
        const docRef = await addDoc(collection(db, "groups"), groupData);
        
        console.log("Grouo Created:", { id: docRef.id, ...groupData });
        return docRef.id;
      } catch (error) {
        console.error("Error creating bet:", error);
      }
  };

  export const fetchUsersByID = async (userIds) => {
    try {
      if (!db) {
        console.error("Firestore db is not initialized.");
        return [];
      }
  
      const userPromises = userIds.map(async (userId) => {
        const userDoc = await getDoc(doc(db, "users", userId));
        return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
      });
  
      const users = await Promise.all(userPromises);
      return users.filter((user) => user !== null); // Remove any null values if a group doesn't exist
    } catch (error) {
      console.error("Error fetching groups:", error);
      return [];
    }
  };

  export const updateGroupMembership = async (memberIDs, gID) => {
  try {
    if (!db) {
      console.error("Firestore db is not initialized.");
      return;
    }

    const updatePromises = memberIDs.map(async (memberID) => {
      const userRef = doc(db, "users", memberID);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if groupIDs field exists
        if (userData?.groupIDs) {
          // If groupIDs exists, update by adding gID
          await updateDoc(userRef, {
            groupIDs: arrayUnion(gID), // Adds gID only if it's not already in the array
          });
        } else {
          // If groupIDs doesn't exist, initialize it with an array containing gID
          await updateDoc(userRef, {
            groupIDs: [gID], // Initialize groupIDs if it doesn't exist
          });
        }
      } 
    });

    await Promise.all(updatePromises);
    console.log("Group membership updated successfully.");
  } catch (error) {
    console.error("Error updating group membership:", error);
  }
};