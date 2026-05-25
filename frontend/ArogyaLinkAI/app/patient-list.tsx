import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

// @ts-ignore
import QRCodeSVG from 'react-native-qrcode-svg';

const patientsData = [

  {
    id: 'ASHA-2026-001',
    name: 'Ramesh Kumar',
    city: 'Mysore',
    dob: '12-04-1971',
    mobile: '9876543210',
    risk: 'High Risk',
  },

  {
    id: 'ASHA-2026-002',
    name: 'Sita Devi',
    city: 'Mandya',
    dob: '22-08-1980',
    mobile: '9123456780',
    risk: 'Diabetes',
  },

  {
    id: 'ASHA-2026-003',
    name: 'Kiran Rao',
    city: 'Mysore',
    dob: '02-11-1992',
    mobile: '9988776655',
    risk: 'Controlled',
  },

];

export default function PatientDetailsScreen() {

  const [searchName, setSearchName] =
    useState('');

  const [searchCity, setSearchCity] =
    useState('');

  const [selectedPatient, setSelectedPatient] =
    useState<any>(null);

  const filteredPatients =
    patientsData.filter((patient) => {

      const matchesName =
        patient.name
          .toLowerCase()
          .includes(
            searchName.toLowerCase()
          );

      const matchesCity =
        patient.city
          .toLowerCase()
          .includes(
            searchCity.toLowerCase()
          );

      return matchesName &&
        matchesCity;
    });

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={
          styles.scrollContainer
        }
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <Text style={styles.title}>
          Patient Details
        </Text>

        {/* FILTERS */}

        <View style={styles.filterCard}>

          <View style={styles.searchRow}>

            <Ionicons
              name="search-outline"
              size={20}
              color="#6B7280"
            />

            <TextInput
              style={styles.searchInput}
              placeholder="Search by patient name"
              placeholderTextColor="#9CA3AF"
              value={searchName}
              onChangeText={setSearchName}
            />

          </View>

          <View style={styles.searchRow}>

            <Ionicons
              name="location-outline"
              size={20}
              color="#6B7280"
            />

            <TextInput
              style={styles.searchInput}
              placeholder="Filter by city"
              placeholderTextColor="#9CA3AF"
              value={searchCity}
              onChangeText={setSearchCity}
            />

          </View>

        </View>

        {/* PATIENT LIST */}

        {filteredPatients.map(
          (patient, index) => (

          <View
            key={index}
            style={styles.patientCard}
          >

            <View style={{ flex: 1 }}>

              <Text style={styles.patientName}>
                {patient.name}
              </Text>

              <Text style={styles.patientInfo}>
                {patient.city}
              </Text>

              <Text style={styles.patientId}>
                {patient.id}
              </Text>

              <Text style={styles.riskText}>
                {patient.risk}
              </Text>

            </View>

            <TouchableOpacity
              style={styles.showButton}
              onPress={() =>
                setSelectedPatient(patient)
              }
            >

              <Text style={styles.showButtonText}>
                Show Card
              </Text>

            </TouchableOpacity>

          </View>

        ))}

      </ScrollView>

      {/* CARD MODAL */}

      <Modal
        visible={!!selectedPatient}
        transparent
        animationType="slide"
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalCard}>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() =>
                setSelectedPatient(null)
              }
            >

              <Ionicons
                name="close"
                size={26}
                color="#111827"
              />

            </TouchableOpacity>

            {selectedPatient && (

              <>

                <Text style={styles.cardHeader}>
                  ASHA+
                </Text>

                <Text style={styles.cardSubHeader}>
                  Community Health Card
                </Text>

                <View style={styles.divider} />

                <Text style={styles.cardLabel}>
                  Name
                </Text>

                <Text style={styles.cardValue}>
                  {selectedPatient.name}
                </Text>

                <Text style={styles.cardLabel}>
                  Date of Birth
                </Text>

                <Text style={styles.cardValue}>
                  {selectedPatient.dob}
                </Text>

                <Text style={styles.cardLabel}>
                  City
                </Text>

                <Text style={styles.cardValue}>
                  {selectedPatient.city}
                </Text>

                <Text style={styles.cardLabel}>
                  Mobile Number
                </Text>

                <Text style={styles.cardValue}>
                  +91 {selectedPatient.mobile}
                </Text>

                <Text style={styles.cardLabel}>
                  Health ID
                </Text>

                <Text style={styles.healthId}>
                  {selectedPatient.id}
                </Text>

                <View style={styles.qrWrapper}>

                  {/* @ts-ignore */}

                  <QRCodeSVG
                    value={selectedPatient.id}
                    size={150}
                  />

                </View>

                <Text style={styles.footerText}>
                  ASHA Worker Verified
                </Text>

              </>

            )}

          </View>

        </View>

      </Modal>

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

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },

  filterCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 18,
    marginBottom: 24,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 10,
    fontSize: 15,
    color: '#111827',
  },

  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  patientName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  patientInfo: {
    marginTop: 6,
    color: '#6B7280',
    fontSize: 14,
  },

  patientId: {
    marginTop: 6,
    color: '#19a38c',
    fontWeight: '700',
  },

  riskText: {
    marginTop: 8,
    color: '#DC2626',
    fontWeight: '600',
  },

  showButton: {
    backgroundColor: '#19a38c',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    marginLeft: 12,
  },

  showButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 28,
  },

  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },

  cardHeader: {
    fontSize: 30,
    fontWeight: '700',
    color: '#19a38c',
    textAlign: 'center',
  },

  cardSubHeader: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 6,
    marginBottom: 22,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },

  cardLabel: {
    color: '#6B7280',
    marginTop: 12,
    fontSize: 13,
  },

  cardValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
  },

  healthId: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#19a38c',
  },

  qrWrapper: {
    marginTop: 28,
    alignItems: 'center',
  },

  footerText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#6B7280',
    fontWeight: '600',
  },

});