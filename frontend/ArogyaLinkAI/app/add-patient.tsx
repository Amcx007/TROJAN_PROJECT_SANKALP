import React, { useState } from 'react';
import { router } from 'expo-router';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

// @ts-ignore
import QRCodeSVG from 'react-native-qrcode-svg';

export default function AddPatientScreen() {

  const [fullName, setFullName] =
    useState('');

  const [dob, setDob] =
    useState('');

  const [mobile, setMobile] =
    useState('');

  const [patientId, setPatientId] =
    useState('');

  const [showQR, setShowQR] =
    useState(false);

  // ADDRESS STATES

  const [houseNo, setHouseNo] =
    useState('');

  const [streetName, setStreetName] =
    useState('');

  const [village, setVillage] =
    useState('');

  const [district, setDistrict] =
    useState('');

  const [state, setState] =
    useState('');

  const [zipCode, setZipCode] =
    useState('');

  const [landmark, setLandmark] =
    useState('');

  const generatePatientId = () => {

    if (
      !fullName ||
      !dob ||
      !mobile
    ) {

      Alert.alert(
        'Missing Details',
        'Please fill all fields'
      );

      return;
    }

    const uniqueId =
      `ASHA-${Date.now()}`;

    setPatientId(uniqueId);

    setShowQR(true);
  };

  const fullAddressPreview = [
    [houseNo, streetName].filter(Boolean).join(', '),
    [village, district].filter(Boolean).join(', '),
    [state, zipCode].filter(Boolean).join(' - '),
  ].filter(Boolean).join('\n');

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContainer
        }
      >

        {/* HEADER */}

        <View style={styles.headerRow}>

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

          {/* FULL NAME */}

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter patient name"
            placeholderTextColor="#9CA3AF"
            value={fullName}
            onChangeText={setFullName}
          />

          {/* ADDRESS */}

          <Text style={styles.label}>
            Address
          </Text>

          <View style={styles.addressContainer}>

            {/* HOUSE NO */}

            <View style={styles.halfInputWrapper}>

              <TextInput
                style={styles.halfInput}
                placeholder="House No"
                placeholderTextColor="#9CA3AF"
                value={houseNo}
                onChangeText={setHouseNo}
              />

            </View>

            {/* STREET */}

            <View style={styles.halfInputWrapper}>

              <TextInput
                style={styles.halfInput}
                placeholder="Street Name"
                placeholderTextColor="#9CA3AF"
                value={streetName}
                onChangeText={setStreetName}
              />

            </View>

            {/* VILLAGE */}

            <View style={styles.halfInputWrapper}>

              <TextInput
                style={styles.halfInput}
                placeholder="Village"
                placeholderTextColor="#9CA3AF"
                value={village}
                onChangeText={setVillage}
              />

            </View>

            {/* DISTRICT */}

            <View style={styles.halfInputWrapper}>

              <TextInput
                style={styles.halfInput}
                placeholder="District"
                placeholderTextColor="#9CA3AF"
                value={district}
                onChangeText={setDistrict}
              />

            </View>

            {/* STATE */}

            <View style={styles.halfInputWrapper}>

              <TextInput
                style={styles.halfInput}
                placeholder="State"
                placeholderTextColor="#9CA3AF"
                value={state}
                onChangeText={setState}
              />

            </View>

            {/* ZIP CODE */}

            <View style={styles.halfInputWrapper}>

              <TextInput
                style={styles.halfInput}
                placeholder="ZIP Code"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={6}
                value={zipCode}
                onChangeText={(text) => {

                  setZipCode(text);

                  // DEMO AUTO FILL

                  if (text === '570001') {

                    setVillage('Mysore');

                    setDistrict('Mysuru');

                    setState('Karnataka');

                  }

                }}
              />

            </View>

            {/* FULL ADDRESS PREVIEW */}

            <View style={styles.fullWidthWrapper}>

              <TextInput
                style={styles.fullWidthInput}
                placeholder="Full Address Preview"
                placeholderTextColor="#9CA3AF"
                multiline
                editable={false}
                selectTextOnFocus={false}
                showSoftInputOnFocus={false}
                value={fullAddressPreview}
              />

            </View>

          </View>

          {/* DATE OF BIRTH */}

          <Text style={styles.label}>
            Date of Birth
          </Text>

          <View style={styles.dateInputWrapper}>

            <TextInput
              style={styles.dateInput}
              placeholder="DD-MM-YYYY"
              placeholderTextColor="#9CA3AF"
              value={dob}
              onChangeText={setDob}
            />

            <Ionicons
              name="calendar-outline"
              size={22}
              color="#19a38c"
            />

          </View>

          {/* MOBILE */}

          <Text style={styles.label}>
            Mobile Number
          </Text>

          <View style={styles.mobileWrapper}>

            <Text style={styles.countryCode}>
              +91
            </Text>

            <TextInput
              style={styles.mobileInput}
              placeholder="Enter mobile number"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />

          </View>

          {/* BUTTON */}

          <TouchableOpacity
            style={styles.generateButton}
            onPress={generatePatientId}
          >

            <Text style={styles.generateButtonText}>
              Generate Patient ID
            </Text>

          </TouchableOpacity>

        </View>

        {/* QR CARD */}

        {showQR && (

          <View style={styles.qrCard}>

            <Text style={styles.qrTitle}>
              Patient Health ID
            </Text>

            <Text style={styles.patientId}>
              {patientId}
            </Text>

            <View style={styles.qrWrapper}>

              {/* @ts-ignore */}

              <QRCodeSVG
                value={patientId}
                size={180}
              />

            </View>

          </View>

        )}

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

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  backButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
  },

  formCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 22,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
    color: '#111827',
  },

  addressContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  halfInputWrapper: {
    width: '48%',
    marginBottom: 16,
  },

  halfInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
    color: '#111827',
  },

  fullWidthWrapper: {
    width: '100%',
    marginTop: 4,
  },

  fullWidthInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    fontSize: 15,
    color: '#111827',
    minHeight: 70,
    textAlignVertical: 'top',
  },

  dateInputWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: '#111827',
  },

  mobileWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  countryCode: {
    fontSize: 16,
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
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 28,
  },

  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 24,
    marginTop: 24,
    alignItems: 'center',
  },

  qrTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  patientId: {
    marginTop: 10,
    fontSize: 16,
    color: '#19a38c',
    fontWeight: '700',
  },

  qrWrapper: {
    marginTop: 24,
  },

});