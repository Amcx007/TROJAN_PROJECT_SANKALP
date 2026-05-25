import React from 'react';
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
  MaterialIcons,
  FontAwesome5,
} from '@expo/vector-icons';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >

        {/* Header */}

        <View style={styles.header}>

          <View>
            <Text style={styles.greeting}>
              Good Morning,
            </Text>

            <Text style={styles.workerName}>
              ASHA Worker
            </Text>
          </View>

          <View style={styles.headerIcons}>

            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#111"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileCircle}>
              <Ionicons
                name="person"
                size={22}
                color="#fff"
              />
            </TouchableOpacity>

          </View>

        </View>

        {/* Main Overview Card */}

        <View style={styles.overviewCard}>

          <Text style={styles.overviewTitle}>
            ArogyaLink AI
          </Text>

          <Text style={styles.overviewSubtitle}>
            Rural Healthcare Dashboard
          </Text>

          <View style={styles.statsRow}>

            <View style={styles.statItem}>
              <Ionicons
                name="people-outline"
                size={20}
                color="#fff"
              />

              <Text style={styles.statNumber}>
                128
              </Text>

              <Text style={styles.statLabel}>
                Patients
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons
                name="medkit-outline"
                size={20}
                color="#fff"
              />

              <Text style={styles.statNumber}>
                87
              </Text>

              <Text style={styles.statLabel}>
                Vaccinated
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#fff"
              />

              <Text style={styles.statNumber}>
                12
              </Text>

              <Text style={styles.statLabel}>
                Visits
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons
                name="sync-outline"
                size={20}
                color="#fff"
              />

              <Text style={styles.statNumber}>
                5
              </Text>

              <Text style={styles.statLabel}>
                Pending
              </Text>
            </View>

          </View>

        </View>

        {/* Small Stats Cards */}

        <View style={styles.gridContainer}>

          <View style={styles.smallCard}>
            <View style={styles.cardIconPurple}>
              <FontAwesome5
                name="female"
                size={18}
                color="#7C4DFF"
              />
            </View>

            <Text style={styles.cardTitle}>
              Pregnant Women
            </Text>

            <Text style={styles.cardNumber}>
              24
            </Text>
          </View>

          <View style={styles.smallCard}>
            <View style={styles.cardIconGreen}>
              <Ionicons
                name="happy-outline"
                size={18}
                color="#16A34A"
              />
            </View>

            <Text style={styles.cardTitle}>
              Children
            </Text>

            <Text style={styles.cardNumber}>
              65
            </Text>
          </View>

          <View style={styles.smallCard}>
            <View style={styles.cardIconBlue}>
              <MaterialIcons
                name="health-and-safety"
                size={18}
                color="#2563EB"
              />
            </View>

            <Text style={styles.cardTitle}>
              Vaccinated
            </Text>

            <Text style={styles.cardNumber}>
              87%
            </Text>
          </View>

          <View style={styles.smallCard}>
            <View style={styles.cardIconRed}>
              <Ionicons
                name="warning-outline"
                size={18}
                color="#DC2626"
              />
            </View>

            <Text style={styles.cardTitle}>
              High Risk
            </Text>

            <Text style={styles.cardNumber}>
              12
            </Text>
          </View>

        </View>

        {/* Quick Actions */}

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.actionsContainer}>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons
              name="person-add-outline"
              size={26}
              color="#2563EB"
            />

            <Text style={styles.actionText}>
              Add Patient
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons
              name="clipboard-outline"
              size={26}
              color="#16A34A"
            />

            <Text style={styles.actionText}>
              Records
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons
              name="sync-outline"
              size={26}
              color="#EA580C"
            />

            <Text style={styles.actionText}>
              Sync Data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons
              name="calendar-outline"
              size={26}
              color="#7C3AED"
            />

            <Text style={styles.actionText}>
              Visits
            </Text>
          </TouchableOpacity>

        </View>

        {/* Recent Activity */}

        <Text style={styles.sectionTitle}>
          Recent Activity
        </Text>

        <View style={styles.activityCard}>

          <View style={styles.activityItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#16A34A"
            />

            <Text style={styles.activityText}>
              Patient data synced successfully
            </Text>
          </View>

          <View style={styles.activityItem}>
            <Ionicons
              name="person-add"
              size={20}
              color="#2563EB"
            />

            <Text style={styles.activityText}>
              New patient added today
            </Text>
          </View>

          <View style={styles.activityItem}>
            <Ionicons
              name="warning"
              size={20}
              color="#DC2626"
            />

            <Text style={styles.activityText}>
              2 vaccination alerts pending
            </Text>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },

  scrollContainer: {
    padding: 22,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },

  workerName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },

  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  profileCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#19a38c',
    justifyContent: 'center',
    alignItems: 'center',
  },

  overviewCard: {
    backgroundColor: '#2563EB',
    borderRadius: 30,
    padding: 26,
    marginBottom: 24,
  },

  overviewTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },

  overviewSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    marginTop: 6,
    marginBottom: 30,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
  },

  statLabel: {
    color: '#DBEAFE',
    fontSize: 13,
    marginTop: 4,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  smallCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 14,
  },

  cardNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },

  cardIconPurple: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardIconGreen: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardIconBlue: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardIconRed: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },

  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 26,
    alignItems: 'center',
    marginBottom: 16,
  },

  actionText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  activityText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#374151',
  },

});