import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Ionicons,
} from '@expo/vector-icons';

import * as Print from 'expo-print';
import * as SecureStore from 'expo-secure-store';
import QRCode from 'qrcode';

// @ts-ignore
import QRCodeSVG from 'react-native-qrcode-svg';

type PatientRecord = {
  id: string;
  name: string;
  address: string;
  dob: string;
  mobile: string;
  risk: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PatientDetailsScreen() {

  const [searchName, setSearchName] =
    useState('');

  const [searchCity, setSearchCity] =
    useState('');

  const [selectedPatient, setSelectedPatient] =
    useState<PatientRecord | null>(null);

  const [patients, setPatients] =
    useState<PatientRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');

        if (!token || !API_BASE_URL) {
          return;
        }

        const response = await fetch(`${API_BASE_URL}/patients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const rows = await response.json();

        setPatients(
          rows.map((patient: any) => ({
            id: patient.id,
            name: patient.full_name,
            address: patient.address || '',
            dob: patient.dob,
            mobile: patient.mobile,
            risk: patient.address ? 'Saved' : 'No Address',
          }))
        );
      } catch {
        // Leave the list empty on network failure.
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const filteredPatients =
    patients.filter((patient) => {

      const matchesName =
        patient.name
          .toLowerCase()
          .includes(
            searchName.toLowerCase()
          );

      const matchesCity =
        patient.address
          .toLowerCase()
          .includes(
            searchCity.toLowerCase()
          );

      return matchesName &&
        matchesCity;
    });

  const printPatientCard = async (patient: PatientRecord) => {
    const qrSvg = await QRCode.toString(patient.id, {
      type: 'svg',
      margin: 0,
      width: 180,
      color: {
        dark: '#111827',
        light: '#FFFFFF',
      },
    });

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body style="font-family: Arial, sans-serif; padding: 24px; color: #111827; background: #F4F7F9;">
          <div style="border: 2px solid #19a38c; border-radius: 24px; padding: 22px; max-width: 420px; background: linear-gradient(180deg, #ffffff 0%, #f7fffd 100%); box-shadow: 0 12px 28px rgba(25, 163, 140, 0.12);">
            <div style="text-align: center; margin-bottom: 18px;">
              <h2 style="margin: 0; color: #19a38c; font-size: 24px;">ArogyaLink AI</h2>
              <p style="margin: 6px 0 0 0; color: #6B7280; font-size: 14px;">Community Health Card</p>
            </div>
            <div style="border-top: 1px solid #E5E7EB; padding-top: 16px;">
              <div style="margin-bottom: 10px;"><strong>Name:</strong> ${patient.name}</div>
              <div style="margin-bottom: 10px;"><strong>Date of Birth:</strong> ${patient.dob}</div>
              <div style="margin-bottom: 10px;"><strong>Address:</strong> ${patient.address || 'N/A'}</div>
              <div style="margin-bottom: 10px;"><strong>Mobile:</strong> +91 ${patient.mobile}</div>
            </div>
            <div style="margin-top: 18px; padding: 18px; border-radius: 20px; background: #FFFFFF; border: 1px solid #E5E7EB; text-align: center;">
              <div style="font-size: 12px; color: #6B7280; margin-bottom: 10px; letter-spacing: 0.08em; text-transform: uppercase;">Patient ID</div>
              <div style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 14px;">${patient.id}</div>
              <div style="display: inline-block; padding: 12px; background: #fff; border: 1px solid #E5E7EB; border-radius: 18px;">
                ${qrSvg}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await Print.printAsync({ html });
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
              placeholder="Filter by address"
              placeholderTextColor="#9CA3AF"
              value={searchCity}
              onChangeText={setSearchCity}
            />

          </View>

        </View>

        {/* PATIENT LIST */}

        {loading ? (

          <View style={styles.loadingCard}>

            <ActivityIndicator color="#19a38c" />

            <Text style={styles.loadingText}>
              Loading saved patients...
            </Text>

          </View>

        ) : filteredPatients.length === 0 ? (

          <View style={styles.loadingCard}>

            <Text style={styles.loadingText}>
              No saved patients found.
            </Text>

          </View>

        ) : filteredPatients.map(
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
                {patient.address || 'No address saved'}
              </Text>

              <Text style={styles.patientId}>
                {patient.id}
              </Text>

              <Text style={styles.riskText}>
                {patient.risk}
              </Text>

            </View>

            <View style={styles.cardActions}>

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

              <TouchableOpacity
                style={styles.printButton}
                onPress={() => printPatientCard(patient)}
              >

                <Ionicons
                  name="print-outline"
                  size={18}
                  color="#fff"
                />

              </TouchableOpacity>

            </View>

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
                  ArogyaLink AI
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
                  Address
                </Text>

                <Text style={styles.cardValue}>
                  {selectedPatient.address || 'No address saved'}
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

                <TouchableOpacity
                  style={styles.modalPrintButton}
                  onPress={() => printPatientCard(selectedPatient)}
                >

                  <Ionicons
                    name="print-outline"
                    size={18}
                    color="#fff"
                  />

                  <Text style={styles.modalPrintText}>
                    Print Card
                  </Text>

                </TouchableOpacity>

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

  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  loadingText: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 15,
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

  cardActions: {
    alignItems: 'flex-end',
    marginLeft: 12,
    gap: 10,
  },

  showButton: {
    backgroundColor: '#19a38c',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },

  printButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
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

  modalPrintButton: {
    marginTop: 20,
    backgroundColor: '#111827',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalPrintText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 10,
  },

});