import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

const NOTE_FILE_PATH = FileSystem.documentDirectory + 'note.txt'; // File path for the note

const NoteScreen = () => {
  const [note, setNote] = useState<string>('');

  // Load saved note from file when the component mounts
  useEffect(() => {
    const loadNote = async () => {
      try {
        const savedNote = await FileSystem.readAsStringAsync(NOTE_FILE_PATH);
        if (savedNote) setNote(savedNote);
      } catch (error) {
        console.error('Error loading note:', error);
      }
    };
    loadNote();
  }, []);

  // Save note to file
  const handleSaveNote = async () => {
    try {
      await FileSystem.writeAsStringAsync(NOTE_FILE_PATH, note);
      Alert.alert('Success', 'Note saved successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save the note.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your note here"
        multiline
        value={note}
        onChangeText={setNote}
      />
      <Button title="Save Note" onPress={handleSaveNote} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingVertical: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { flex: 1, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10, textAlignVertical: 'top' },
});

export default NoteScreen;
