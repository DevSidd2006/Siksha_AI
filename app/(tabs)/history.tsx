import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { getAllChats, deleteAllChats, getFullChat, deleteChat } from '@/storage/chatStore';

interface ChatHistory {
  id: string;
  firstMessage: string;
  timestamp: Date;
  messageCount: number;
}

export default function HistoryScreen() {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    const allChats = await getAllChats();
    setChats(allChats);
  };

  const handleChatPress = async (chat: ChatHistory) => {
    // Load full chat details
    const fullChat = await getFullChat(chat.id);
    if (fullChat) {
      setSelectedChat(fullChat);
      setModalVisible(true);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteChat(chatId);
            loadHistory();
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const d = new Date(date);
      return 'Today ' + d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getPreviewText = (text: string) => {
    return text.length > 60 ? text.substring(0, 60) + '...' : text;
  };

  const renderChatItem = ({ item }: { item: ChatHistory }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.chatItemLeft}>
        <View style={styles.chatIcon}>
          <Text style={styles.chatIconText}>💬</Text>
        </View>
        <View style={styles.chatContent}>
          <Text style={styles.chatText} numberOfLines={2}>
            {getPreviewText(item.firstMessage)}
          </Text>
          <View style={styles.chatMeta}>
            <Text style={styles.chatDate}>{formatDate(item.timestamp)}</Text>
            <Text style={styles.chatCount}>
              • {item.messageCount} msg
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteChat(item.id)}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat History</Text>
        {chats.length > 0 && (
          <Text style={styles.headerSubtitle}>
            {chats.length} {chats.length === 1 ? 'conversation' : 'conversations'}
          </Text>
        )}
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No chat history yet</Text>
            <Text style={styles.emptySubtext}>
              Your conversations will appear here
            </Text>
          </View>
        }
        scrollEventThrottle={16}
      />

      {/* Chat Details Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Chat Details</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedChat?.messages?.map((msg: any, idx: number) => (
              <View
                key={idx}
                style={[
                  styles.messageRow,
                  msg.isUser ? styles.userMessage : styles.botMessage,
                ]}
              >
                <Text style={[styles.messageText, { color: msg.isUser ? '#ffffff' : '#1a1a1a' }]}>
                  {msg.text}
                </Text>
                <Text style={[styles.messageTime, { color: msg.isUser ? '#e0e0e0' : '#999' }]}>
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  chatItemLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  chatIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIconText: {
    fontSize: 20,
  },
  chatContent: {
    flex: 1,
  },
  chatText: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 20,
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatDate: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  chatCount: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    fontSize: 32,
    color: '#666',
    width: 40,
    textAlign: 'center',
    fontWeight: '300',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageRow: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2196F3',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 15,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
  },
});
