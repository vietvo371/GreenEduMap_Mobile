import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/colors';
import { useTranslation } from '../hooks/useTranslation';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatLiveScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chat.welcomeMessage'),
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isConnected, setIsConnected] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');

      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate auto-reply
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          text: t('chat.autoReply'),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, autoReply]);
      }, 2000);
    }
  };

  const handleEndChat = () => {
    Alert.alert(
      t('chat.endChatTitle'),
      t('chat.endChatMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('chat.endChat'),
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  useEffect(() => {
    // Auto scroll to bottom when new message arrives
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{t('chat.title')}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: isConnected ? '#28A745' : '#DC3545' }]} />
            <Text style={[styles.headerSubtitle, { color: isConnected ? '#28A745' : '#DC3545' }]}>
              {isConnected ? t('chat.online') : t('chat.offline')}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleEndChat} style={styles.endButton}>
          <Icon name="phone-hangup" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.supportMessage,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userBubble : styles.supportBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.isUser ? styles.userText : styles.supportText,
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    message.isUser ? styles.userTime : styles.supportTime,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageContainer, styles.supportMessage]}>
              <View style={[styles.messageBubble, styles.supportBubble]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={t('chat.typeMessage')}
              placeholderTextColor="#6C757D"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
              ]}
              disabled={!inputText.trim()}
            >
              <Icon
                name="send"
                size={20}
                color={inputText.trim() ? '#FFFFFF' : '#6C757D'}
              />
            </TouchableOpacity>
          </View>
          {inputText.length > 0 && (
            <Text style={styles.characterCount}>
              {inputText.length}/500
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  endButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#FFF5F5',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  supportMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  supportBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  userText: {
    color: '#FFFFFF',
  },
  supportText: {
    color: '#2C3E50',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
  },
  userTime: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  supportTime: {
    color: '#6C757D',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6C757D',
    marginRight: 6,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    maxHeight: 100,
    paddingVertical: 4,
    lineHeight: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sendButtonActive: {
    backgroundColor: '#007AFF',
  },
  sendButtonInactive: {
    backgroundColor: '#DEE2E6',
  },
  characterCount: {
    fontSize: 11,
    color: '#6C757D',
    textAlign: 'right',
    marginTop: 4,
    marginRight: 4,
  },
});

export default ChatLiveScreen;
