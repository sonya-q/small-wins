import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const MAX_CHARS = 280;

export default function WinInput({ onSave, hasWinToday, theme }) {
  const [text, setText] = useState('');

  const handleSave = () => {
    if (text.trim() && text.length <= MAX_CHARS) {
      onSave(text);
      setText('');
      Keyboard.dismiss();
    }
  };

  const handleClear = () => {
    setText('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const remainingChars = MAX_CHARS - text.length;
  const isOverLimit = remainingChars < 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {hasWinToday 
          ? "Add another moment worth keeping..."
          : "Name one moment worth keeping."}
      </Text>

      <TextInput
        style={[styles.input, { 
          backgroundColor: theme.inputBackground,
          color: theme.text,
          borderColor: isOverLimit ? '#e74c3c' : 'transparent',
        }]}
        placeholder="Today's small win…"
        placeholderTextColor={theme.textSecondary + '80'}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={MAX_CHARS + 50}
        returnKeyType="done"
        blurOnSubmit
      />

      <Text style={[
        styles.charCount,
        { color: isOverLimit ? '#e74c3c' : theme.textSecondary }
      ]}>
        {isOverLimit 
          ? `${Math.abs(remainingChars)} characters over limit`
          : `${remainingChars} remaining`}
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary, { borderColor: theme.border }]}
          onPress={handleClear}
          disabled={!text.trim()}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, { color: theme.textSecondary }]}>
            Clear
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.buttonPrimary,
            { backgroundColor: theme.accent },
            (!text.trim() || isOverLimit) && styles.buttonDisabled
          ]}
          onPress={handleSave}
          disabled={!text.trim() || isOverLimit}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonTextPrimary}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
  },
  label: {
    fontSize: 17,
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 13,
    textAlign: 'right',
    marginTop: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonSecondary: {
    borderWidth: 2,
  },
  buttonPrimary: {
    // background color set dynamically
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});