import React, { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Ionicons,
} from '@expo/vector-icons';

import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type Visit = {
  id: string;
  patient_id: string;
  patient_name: string;
  scheduled_time: string;
  status: 'Pending' | 'Processing' | 'Completed';
  risk_level: string;
  visit_date: string;
};

type Patient = {
  id: string;
  full_name: string;
};

type RiskLevel = 'Low' | 'Moderate' | 'High';

export default function VisitsScreen() {

  const [visits, setVisits] =
    useState<Visit[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [scheduling, setScheduling] =
    useState(false);

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [patientsLoading, setPatientsLoading] =
    useState(false);

  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  const [scheduledTime, setScheduledTime] =
    useState('');

  const [riskLevel, setRiskLevel] =
    useState<RiskLevel>('Low');

  const [patientSearch, setPatientSearch] =
    useState('');

  const loadVisits = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token || !API_BASE_URL) return;

      const response = await fetch(`${API_BASE_URL}/visits`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;

      const rows = await response.json();
      setVisits(rows);
    } catch {
      // Leave empty on network failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const loadPatients = async () => {
    setPatientsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token || !API_BASE_URL) return;

      const response = await fetch(`${API_BASE_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;

      const rows = await response.json();
      setPatients(
        rows.map((p: any) => ({ id: p.id, full_name: p.full_name }))
      );
    } catch {
      // Leave empty
    } finally {
      setPatientsLoading(false);
    }
  };

  const openScheduleModal = () => {
    setSelectedPatient(null);
    setScheduledTime('');
    setRiskLevel('Low');
    setPatientSearch('');
    setShowModal(true);
    loadPatients();
  };

  const scheduleVisit = async () => {
    if (!selectedPatient) {
      Alert.alert('Missing details', 'Please select a patient');
      return;
    }

    setScheduling(true);
    try {
      const token = await SecureStore.getItemAsync('token');

      const response = await fetch(`${API_BASE_URL}/visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_id: selectedPatient.id,
          scheduled_time: scheduledTime.trim(),
          risk_level: riskLevel,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        Alert.alert('Error', data?.error || 'Failed to schedule visit');
        return;
      }

      setShowModal(false);
      setLoading(true);
      await loadVisits();
    } catch {
      Alert.alert('Error', 'Unable to connect to server');
    } finally {
      setScheduling(false);
    }
  };

  const updateStatus = async (visitId: string, newStatus: string) => {
    try {
      const token = await SecureStore.getItemAsync('token');

      const response = await fetch(
        `${API_BASE_URL}/visits/${visitId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        Alert.alert('Error', 'Failed to update visit status');
        return;
      }

      setVisits((prev) =>
        prev.map((v) =>
          v.id === visitId
            ? { ...v, status: newStatus as Visit['status'] }
            : v
        )
      );
    } catch {
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  const completedCount =
    visits.filter((v) => v.status === 'Completed').length;

  const remainingCount =
    visits.filter((v) => v.status !== 'Completed').length;

  const filteredPatients = patients.filter((p) =>
    p.full_name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View style={styles.headerRow}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Home Visits
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={openScheduleModal}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>

        </View>

        {/* SUMMARY */}

        <View style={styles.summaryCard}>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{visits.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{completedCount}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{remainingCount}</Text>
            <Text style={styles.summaryLabel}>Remaining</Text>
          </View>

        </View>

        {/* VISIT LIST */}

        {loading ? (

          <View style={styles.emptyCard}>
            <ActivityIndicator color="#19a38c" />
            <Text style={styles.emptyText}>
              Loading visits...
            </Text>
          </View>

        ) : visits.length === 0 ? (

          <View style={styles.emptyCard}>

            <Text style={styles.emptyText}>
              No visits scheduled for today.
            </Text>

            <TouchableOpacity
              style={styles.emptyScheduleButton}
              onPress={openScheduleModal}
            >
              <Text style={styles.emptyScheduleText}>
                + Schedule a Visit
              </Text>
            </TouchableOpacity>

          </View>

        ) : (

          visits.map((visit) => (

            <View key={visit.id} style={styles.visitCard}>

              {/* TOP ROW */}

              <View style={styles.visitTop}>

                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>
                    {visit.patient_name || 'Unknown Patient'}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    visit.status === 'Completed'
                      ? styles.completedBadge
                      : visit.status === 'Processing'
                      ? styles.processingBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {visit.status}
                  </Text>
                </View>

              </View>

              {/* DETAILS */}

              {!!visit.scheduled_time && (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color="#6B7280"
                  />
                  <Text style={styles.infoText}>
                    {visit.scheduled_time}
                  </Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Ionicons
                  name="warning-outline"
                  size={18}
                  color={
                    visit.risk_level === 'High'
                      ? '#DC2626'
                      : visit.risk_level === 'Moderate'
                      ? '#D97706'
                      : '#16A34A'
                  }
                />
                <Text style={styles.infoText}>
                  {visit.risk_level} Risk
                </Text>
              </View>

              {/* ACTION BUTTONS */}

              {visit.status === 'Pending' && (
                <TouchableOpacity
                  style={styles.visitButton}
                  onPress={() => updateStatus(visit.id, 'Processing')}
                >
                  <Text style={styles.visitButtonText}>
                    Start Visit
                  </Text>
                </TouchableOpacity>
              )}

              {visit.status === 'Processing' && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => updateStatus(visit.id, 'Completed')}
                >
                  <Text style={styles.completeButtonText}>
                    Mark Completed
                  </Text>
                </TouchableOpacity>
              )}

            </View>

          ))

        )}

      </ScrollView>

      {/* SCHEDULE MODAL */}

      <Modal visible={showModal} transparent animationType="slide">

        <View style={styles.modalOverlay}>

          <View style={styles.modalCard}>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={26} color="#111827" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              Schedule Visit
            </Text>

            <Text style={styles.modalLabel}>
              Patient
            </Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Search patient by name..."
              placeholderTextColor="#9CA3AF"
              value={patientSearch}
              onChangeText={setPatientSearch}
            />

            {patientsLoading ? (

              <ActivityIndicator
                color="#19a38c"
                style={{ marginVertical: 16 }}
              />

            ) : (

              <ScrollView
                style={styles.patientList}
                nestedScrollEnabled
              >
                {filteredPatients.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.patientOption,
                      selectedPatient?.id === p.id &&
                        styles.patientOptionSelected,
                    ]}
                    onPress={() => setSelectedPatient(p)}
                  >
                    <Text
                      style={[
                        styles.patientOptionText,
                        selectedPatient?.id === p.id &&
                          styles.patientOptionTextSelected,
                      ]}
                    >
                      {p.full_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

            )}

            <Text style={styles.modalLabel}>
              Time (e.g. 09:30 AM)
            </Text>

            <TextInput
              style={styles.timeInput}
              placeholder="Enter visit time"
              placeholderTextColor="#9CA3AF"
              value={scheduledTime}
              onChangeText={setScheduledTime}
            />

            <Text style={styles.modalLabel}>
              Risk Level
            </Text>

            <View style={styles.riskRow}>

              {(['Low', 'Moderate', 'High'] as RiskLevel[]).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.riskOption,
                    riskLevel === level &&
                      (level === 'Low'
                        ? styles.riskLowSelected
                        : level === 'Moderate'
                        ? styles.riskModerateSelected
                        : styles.riskHighSelected),
                  ]}
                  onPress={() => setRiskLevel(level)}
                >
                  <Text
                    style={[
                      styles.riskOptionText,
                      riskLevel === level && styles.riskOptionTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}

            </View>

            <TouchableOpacity
              style={[styles.confirmButton, scheduling && { opacity: 0.7 }]}
              onPress={scheduleVisit}
              disabled={scheduling}
            >
              {scheduling ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>
                  Confirm Visit
                </Text>
              )}
            </TouchableOpacity>

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
    flex: 1,
  },

  addButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#19a38c',
    justifyContent: 'center',
    alignItems: 'center',
  },

  summaryCard: {
    backgroundColor: '#19a38c',
    borderRadius: 30,
    padding: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  summaryItem: {
    alignItems: 'center',
  },

  summaryNumber: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
  },

  summaryLabel: {
    color: '#D1FAE5',
    marginTop: 8,
    fontSize: 14,
  },

  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },

  emptyText: {
    color: '#6B7280',
    fontSize: 15,
    marginBottom: 16,
  },

  emptyScheduleButton: {
    backgroundColor: '#19a38c',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },

  emptyScheduleText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  visitCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
  },

  visitTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  patientName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },

  statusBadge: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  completedBadge: {
    backgroundColor: '#DCFCE7',
  },

  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },

  processingBadge: {
    backgroundColor: '#DBEAFE',
  },

  statusText: {
    fontWeight: '700',
    color: '#111827',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  infoText: {
    marginLeft: 10,
    color: '#374151',
    fontSize: 15,
  },

  visitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },

  visitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  completeButton: {
    backgroundColor: '#16A34A',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },

  completeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 28,
    paddingBottom: 40,
    maxHeight: '90%',
  },

  closeButton: {
    position: 'absolute',
    right: 24,
    top: 24,
    zIndex: 1,
  },

  modalTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },

  modalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    marginTop: 16,
  },

  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
  },

  patientList: {
    maxHeight: 160,
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  patientOption: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  patientOptionSelected: {
    backgroundColor: '#F0FDF4',
  },

  patientOptionText: {
    fontSize: 15,
    color: '#374151',
  },

  patientOptionTextSelected: {
    color: '#16A34A',
    fontWeight: '700',
  },

  timeInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
  },

  riskRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },

  riskOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#F3F4F6',
  },

  riskLowSelected: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },

  riskModerateSelected: {
    backgroundColor: '#FEF3C7',
    borderColor: '#D97706',
  },

  riskHighSelected: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },

  riskOptionText: {
    fontWeight: '600',
    color: '#6B7280',
  },

  riskOptionTextSelected: {
    color: '#111827',
  },

  confirmButton: {
    backgroundColor: '#19a38c',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
  },

  confirmButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

});