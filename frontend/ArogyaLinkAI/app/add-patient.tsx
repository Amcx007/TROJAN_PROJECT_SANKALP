import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';

import DateTimePicker from
  '@react-native-community/datetimepicker';

// @ts-ignore
import QRCodeSVG from 'react-native-qrcode-svg';

export default function AddPatientScreen() {

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');

  const [showPicker, setShowPicker] =
    useState(false);

  const [date, setDate] =
    useState(new Date());

  const [patientId, setPatientId] =
    useState('');

  const generatePatient = () => {

    if (
      !name ||
      !address ||
      !dob ||
      !mobile
    ) {

      Alert.alert(
        'Missing Fields',
        'Please fill all fields'
      );

      return;
    }

    const uniqueId =
      `ASHA-${Date.now()}`;

    setPatientId(uniqueId);
  };

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={
          styles.scrollContainer
        }
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >

            <Ionicons
              name="arrow-back"
              size={24}
              color="#111827"
            />

          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Add Patient
          </Text>

        </View>

        {/* FORM CARD */}

        <View style={styles.formCard}>

          {/* NAME */}

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter patient name"
            value={name}
            onChangeText={setName}
          />

          {/* ADDRESS */}

          <Text style={styles.label}>
            Address
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
          />

          {/* DATE OF BIRTH */}

          <Text style={styles.label}>
            Date of Birth
          </Text>

          <View style={styles.dobContainer}>

            <TextInput
              style={styles.dobInput}
              placeholder="DD-MM-YYYY"
              value={dob}
              onChangeText={(text) => {

                let cleaned =
                  text.replace(/[^0-9]/g, '');

                if (cleaned.length > 8) {
                  cleaned = cleaned.slice(0, 8);
                }

                let formatted = cleaned;

                if (cleaned.length > 2) {
                  formatted =
                    cleaned.slice(0, 2) +
                    '-' +
                    cleaned.slice(2);
                }

                if (cleaned.length > 4) {
                  formatted =
                    cleaned.slice(0, 2) +
                    '-' +
                    cleaned.slice(2, 4) +
                    '-' +
                    cleaned.slice(4);
                }

                setDob(formatted);
              }}
              keyboardType="number-pad"
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity
              style={styles.calendarButton}
              onPress={() => setShowPicker(true)}
            >

              <Ionicons
                name="calendar-outline"
                size={22}
                color="#19a38c"
              />

            </TouchableOpacity>

          </View>

          {showPicker && (

            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {

                setShowPicker(false);

                if (selectedDate) {

                  setDate(selectedDate);

                  const day =
                    String(
                      selectedDate.getDate()
                    ).padStart(2, '0');

                  const month =
                    String(
                      selectedDate.getMonth() + 1
                    ).padStart(2, '0');

                  const year =
                    selectedDate.getFullYear();

                  setDob(
                    `${day}-${month}-${year}`
                  );
                }
              }}
            />

          )}

          {/* MOBILE NUMBER */}

          <Text style={styles.label}>
            Mobile Number
          </Text>

          <View style={styles.mobileContainer}>

            <Text style={styles.countryCode}>
              +91
            </Text>

            <TextInput
              style={styles.mobileInput}
              placeholder="Enter mobile number"
              keyboardType="number-pad"
              value={mobile}
              maxLength={10}
              onChangeText={(text) => {

                const cleaned =
                  text.replace(/[^0-9]/g, '');

                setMobile(cleaned);
              }}
            />

          </View>

          {/* BUTTON */}

          <TouchableOpacity
            style={styles.generateButton}
            onPress={generatePatient}
          >

            <Text style={styles.generateText}>
              Generate Patient ID
            </Text>

          </TouchableOpacity>

        </View>

        {/* QR SECTION */}

        {patientId ? (

          <View style={styles.qrCard}>

            <Text style={styles.qrTitle}>
              Patient Registered
            </Text>

            <Text style={styles.patientId}>
              {patientId}
            </Text>

            <View style={styles.qrContainer}>

              {/* @ts-ignore */}

              <QRCodeSVG
                value={patientId}
                size={180}
              />

            </View>

            <Text style={styles.qrInfo}>
              Scan this QR to retrieve
              patient details later
            </Text>

          </View>

        ) : null}

      </ScrollView>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F7F9',
  },

  scrollContainer: {
    padding: 22,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
  },

  formCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 22,
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
  },

  dobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 18,
  },

  dobInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: '#111827',
  },

  calendarButton: {
    paddingLeft: 12,
  },

  mobileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 18,
  },

  countryCode: {
    fontSize: 15,
    fontWeight: '400',
    color: '#6B7280',
    marginRight: 10,
  },

  mobileInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  generateButton: {
    backgroundColor: '#19a38c',
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    marginTop: 28,
  },

  generateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
  },

  qrTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  patientId: {
    marginTop: 10,
    color: '#19a38c',
    fontSize: 18,
    fontWeight: '700',
  },

  qrContainer: {
    marginTop: 26,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
  },

  qrInfo: {
    marginTop: 20,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 15,
    lineHeight: 22,
  },

});