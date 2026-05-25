import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

export default function VisitsScreen() {

  const [visits, setVisits] =
    useState([

      {
        id: 1,
        name: 'Ramesh Kumar',
        village: 'Mysore',
        risk: 'Critical',
        time: '09:30 AM',
        status: 'Pending',
      },

      {
        id: 2,
        name: 'Sita Devi',
        village: 'Mandya',
        risk: 'Moderate',
        time: '11:00 AM',
        status: 'Completed',
      },

      {
        id: 3,
        name: 'Kiran Rao',
        village: 'Hunsur',
        risk: 'Low',
        time: '02:00 PM',
        status: 'Pending',
      },

    ]);

  const markProcessing = (id: number) => {

    const updatedVisits =
      visits.map((visit) => {

      if (visit.id === id) {

        return {
          ...visit,
          status: 'Processing',
        };

      }

      return visit;

    });

    setVisits(updatedVisits);

  };

  const markCompleted = (id: number) => {

    const updatedVisits =
      visits.map((visit) => {

      if (visit.id === id) {

        return {
          ...visit,
          status: 'Completed',
        };

      }

      return visit;

    });

    setVisits(updatedVisits);

  };

  const completedCount =
    visits.filter(
      (visit) =>
        visit.status === 'Completed'
    ).length;

  const pendingCount =
    visits.filter(
      (visit) =>
        visit.status === 'Pending'
    ).length;

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={
          styles.scrollContainer
        }
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <Text style={styles.headerTitle}>
          Home Visits
        </Text>

        {/* SUMMARY */}

        <View style={styles.summaryCard}>

          <View style={styles.summaryItem}>

            <Text style={styles.summaryNumber}>
              {visits.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Total Visits
            </Text>

          </View>

          <View style={styles.summaryItem}>

            <Text style={styles.summaryNumber}>
              {completedCount}
            </Text>

            <Text style={styles.summaryLabel}>
              Completed
            </Text>

          </View>

          <View style={styles.summaryItem}>

            <Text style={styles.summaryNumber}>
              {pendingCount}
            </Text>

            <Text style={styles.summaryLabel}>
              Pending
            </Text>

          </View>

        </View>

        {/* VISITS */}

        {visits.map((visit) => (

          <View
            key={visit.id}
            style={styles.visitCard}
          >

            {/* TOP */}

            <View style={styles.visitTop}>

              <View>

                <Text style={styles.patientName}>
                  {visit.name}
                </Text>

                <Text style={styles.patientVillage}>
                  {visit.village}
                </Text>

              </View>

              <View
                style={[

                  styles.statusBadge,

                  visit.status ===
                  'Completed'

                  ? styles.completedBadge

                  : visit.status ===
                    'Processing'

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

            <View style={styles.infoRow}>

              <Ionicons
                name="time-outline"
                size={18}
                color="#6B7280"
              />

              <Text style={styles.infoText}>
                {visit.time}
              </Text>

            </View>

            <View style={styles.infoRow}>

              <Ionicons
                name="warning-outline"
                size={18}
                color="#DC2626"
              />

              <Text style={styles.infoText}>
                {visit.risk} Risk
              </Text>

            </View>

            {/* BUTTONS */}

            {visit.status ===
              'Pending' && (

              <TouchableOpacity
                style={styles.visitButton}
                onPress={() =>
                  markProcessing(
                    visit.id
                  )
                }
              >

                <Text
                  style={styles.visitButtonText}
                >
                  Start Visit
                </Text>

              </TouchableOpacity>

            )}

            {visit.status ===
              'Processing' && (

              <TouchableOpacity
                style={styles.completeButton}
                onPress={() =>
                  markCompleted(
                    visit.id
                  )
                }
              >

                <Text
                  style={styles.completeButtonText}
                >
                  Mark Completed
                </Text>

              </TouchableOpacity>

            )}

          </View>

        ))}

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

  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 28,
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

  patientVillage: {
    color: '#6B7280',
    marginTop: 6,
    fontSize: 15,
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

});