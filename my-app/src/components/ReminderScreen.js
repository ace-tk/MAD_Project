import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMINDERS_STORAGE_KEY = '@reminders_list';

export default function ReminderScreen({ navigation }) {
  const [text, setText] = useState('');
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      if (stored) {
        setReminders(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const saveReminders = async (newReminders) => {
    try {
      await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(newReminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const addReminder = () => {
    if (!text.trim()) return;
    
    const newReminder = {
      id: Date.now().toString(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    
    const newReminders = [...reminders, newReminder];
    setReminders(newReminders);
    saveReminders(newReminders);
    setText('');
  };

  const toggleReminder = (id) => {
    const newReminders = reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    setReminders(newReminders);
    saveReminders(newReminders);
  };

  const deleteReminder = (id) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newReminders = reminders.filter(r => r.id !== id);
            setReminders(newReminders);
            saveReminders(newReminders);
          },
        },
      ]
    );
  };

  const renderReminder = ({ item }) => (
    <View style={[styles.reminderItem, item.completed && styles.completedItem]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleReminder(item.id)}
      >
        <Ionicons
          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={item.completed ? '#22C55E' : '#94A3B8'}
        />
      </TouchableOpacity>
      
      <Text style={[styles.reminderText, item.completed && styles.completedText]}>
        {item.text}
      </Text>
      
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => deleteReminder(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#E11D48" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Reminders</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter reminder..."
          value={text}
          onChangeText={setText}
          onSubmitEditing={addReminder}
        />
        <TouchableOpacity style={styles.addButton} onPress={addReminder}>
          <Ionicons name="add-circle" size={32} color="#1D7CF2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={renderReminder}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No reminders yet</Text>
            <Text style={styles.emptySubtext}>Add a reminder to get started</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addButton: {
    padding: 5,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  completedItem: {
    opacity: 0.7,
  },
  checkbox: {
    marginRight: 12,
  },
  reminderText: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  deleteBtn: {
    padding: 5,
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 5,
  },
});
