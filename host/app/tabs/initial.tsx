import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Contacts from 'expo-contacts';
import { createServer } from 'http';

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

  // Funkcja do uruchomienia serwera HTTP
  const startServer = () => {
    const server = createServer((req, res) => {
      if (req.url === '/contacts') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(contacts)); // Zwraca kontakty w formacie JSON
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    server.listen(3000, '0.0.0.0', () => {
      console.log('Serwer działa na porcie 3000.');
    });
  };

  // UseEffect do inicjalizacji kontaktów i serwera
  useEffect(() => {
    loadContacts(); // Pobranie kontaktów
    startServer(); // Uruchomienie serwera HTTP
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
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
