import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useNetInfo } from '@react-native-community/netinfo';
import * as SecureStore from 'expo-secure-store';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';

export default function DashboardScreen() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState('ASHA Worker');
  const netInfo = useNetInfo();
  const isOnline = netInfo.isConnected === true;

  const [stats, setStats] = useState({
    patients: 0,
    highRisk: 0,
    visits: 0,
    pending: 0,
    hypertension: 0,
    diabetes: 0,
    critical: 0,
    controlled: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const storedName = await SecureStore.getItemAsync('username');
        if (isMounted && storedName?.trim()) {
          setDisplayName(storedName.trim());
        }
      } catch {
        // Keep fallback label when secure storage read fails.
      }

      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token || !API_BASE_URL) return;

        const res = await fetch(`${API_BASE_URL}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setStats({
              patients: data.patients ?? 0,
              highRisk: data.highRisk ?? 0,
              visits: data.visits ?? 0,
              pending: data.pending ?? 0,
              hypertension: data.hypertension ?? 0,
              diabetes: data.diabetes ?? 0,
              critical: data.critical ?? 0,
              controlled: data.controlled ?? 0,
            });
          }
        }
      } catch {
        // Keep default zeros if stats fetch fails.
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  

  return (

    <SafeAreaView style={styles.container}>

      

      {/* SIDE DRAWER */}

      {menuOpen && (

        <Pressable style={styles.drawerOverlay} onPress={() => setMenuOpen(false)}>
          <Pressable onPress={() => {}} style={styles.drawerPressable}>
            <View style={styles.drawerMenu}>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setMenuOpen(false)}
              >
                <Ionicons
                  name="close"
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>

              <Text style={styles.drawerTitle}>
                {displayName}
              </Text>

              <Text style={styles.drawerSubtitle}>
                Community Health Worker
              </Text>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/visits');
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color="#fff"
                />

                <Text style={styles.drawerText}>
                  Scheduling
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem}>
                <Ionicons
                  name="warning-outline"
                  size={22}
                  color="#fff"
                />

                <Text style={styles.drawerText}>
                  Critical Alerts
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/patient-list');
                }}
              >
                <Ionicons
                  name="people-outline"
                  size={22}
                  color="#fff"
                />

                <Text style={styles.drawerText}>
                  Patient Details
                </Text>
              </TouchableOpacity>

            </View>
          </Pressable>
        </Pressable>

      )}


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <View style={styles.topRow}>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setMenuOpen(true)}
            >
              <Ionicons
                name="menu"
                size={22}
                color="#111827"
              />
            </TouchableOpacity>

            {/* CLOUD STATUS */}

            <TouchableOpacity style={styles.cloudButton}>

              <Ionicons
                name={isOnline ? 'cloud-done-outline' : 'cloud-offline-outline'}
                size={22}
                color={isOnline ? '#16A34A' : '#F97316'}
              />

            </TouchableOpacity>

            {/* PROFILE */}

            <TouchableOpacity style={styles.profileCircle}>

              <Ionicons
                name="person"
                size={22}
                color="#fff"
              />

            </TouchableOpacity>

          </View>

          <View style={styles.welcomeSection}>

            <Text style={styles.greeting}>
              Welcome
            </Text>

            <Text style={styles.workerName}>
              {displayName}
            </Text>

          </View>

        </View>

        {/* HERO CARD */}

        <View style={styles.heroCard}>

          <Text style={styles.heroTitle}>
            ASHA+
          </Text>

          <Text style={styles.heroSubtitle}>
            Rural Healthcare Dashboard
          </Text>

          <View style={styles.heroStats}>

            <View style={styles.heroStatItem}>
              <Ionicons
                name="people-outline"
                size={18}
                color="#D1FAE5"
              />

              <Text style={styles.heroStatNumber}>
                {stats.patients}
              </Text>

              <Text style={styles.heroStatLabel}>
                Patients
              </Text>
            </View>

            <View style={styles.heroStatItem}>
              <Ionicons
                name="warning-outline"
                size={18}
                color="#D1FAE5"
              />

              <Text style={styles.heroStatNumber}>
                {stats.highRisk}
              </Text>

              <Text style={styles.heroStatLabel}>
                High Risk
              </Text>
            </View>

            <View style={styles.heroStatItem}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#D1FAE5"
              />

              <Text style={styles.heroStatNumber}>
                {stats.visits}
              </Text>

              <Text style={styles.heroStatLabel}>
                Visits
              </Text>
            </View>

            <View style={styles.heroStatItem}>
              <Ionicons
                name="sync-outline"
                size={18}
                color="#D1FAE5"
              />

              <Text style={styles.heroStatNumber}>
                {stats.pending}
              </Text>

              <Text style={styles.heroStatLabel}>
                Pending
              </Text>
            </View>

          </View>

        </View>

        {/* PRIORITY MONITORING */}

        <Text style={styles.sectionTitle}>
          Priority Monitoring
        </Text>

        <View style={styles.gridContainer}>

          <View style={styles.healthCard}>

            <View style={styles.iconRed}>
              <FontAwesome5
                name="heartbeat"
                size={18}
                color="#DC2626"
              />
            </View>

            <Text style={styles.cardTitle}>
              Hypertension
            </Text>

            <Text style={styles.cardNumber}>
              {stats.hypertension}
            </Text>

            <Text style={styles.cardSubText}>
              risk cases
            </Text>

          </View>

          <View style={styles.healthCard}>

            <View style={styles.iconOrange}>
              <MaterialCommunityIcons
                name="diabetes"
                size={20}
                color="#EA580C"
              />
            </View>

            <Text style={styles.cardTitle}>
              Diabetes
            </Text>

            <Text style={styles.cardNumber}>
              {stats.diabetes}
            </Text>

            <Text style={styles.cardSubText}>
              risk cases
            </Text>

          </View>

          <View style={styles.healthCard}>

            <View style={styles.iconBlue}>
              <Ionicons
                name="warning-outline"
                size={20}
                color="#2563EB"
              />
            </View>

            <Text style={styles.cardTitle}>
              Critical
            </Text>

            <Text style={styles.cardNumber}>
              {stats.critical}
            </Text>

            <Text style={styles.cardSubText}>
              Immediate follow-up
            </Text>

          </View>

          <View style={styles.healthCard}>

            <View style={styles.iconGreen}>
              <Ionicons
                name="checkmark-done-outline"
                size={20}
                color="#16A34A"
              />
            </View>

            <Text style={styles.cardTitle}>
              Controlled
            </Text>

            <Text style={styles.cardNumber}>
              {stats.controlled}
            </Text>

            <Text style={styles.cardSubText}>
              Stable cases
            </Text>

          </View>

        </View>

        {/* QUICK ACTIONS */}

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.quickGrid}>

          {/* ADD PATIENT */}

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/add-patient')}
          >
            <Ionicons
              name="person-add-outline"
              size={24}
              color="#7C3AED"
            />

            <Text style={styles.quickText}>
              Add Patient
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() =>
              router.push('/patient-survey')
            }
          >
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={24}
              color="#19a38c"
            />

            <Text style={styles.quickText}>
              Patient Survey
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard}>
            <Ionicons
              name="sync-outline"
              size={24}
              color="#DC2626"
            />

            <Text style={styles.quickText}>
              Sync Data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() =>
              router.push('/visits')
            }
          >
            <Ionicons
              name="home-outline"
              size={24}
              color="#2563EB"
            />

            <Text style={styles.quickText}>
              Home Visits
            </Text>
          </TouchableOpacity>

        </View>

        {/* RECENT ACTIVITY */}

        <Text style={styles.sectionTitle}>
          Recent Activity
        </Text>

        <View style={styles.activityCard}>

          <View style={styles.activityItem}>

            <Ionicons
              name="checkmark-circle"
              size={18}
              color="#16A34A"
            />

            <Text style={styles.activityText}>
              Patient data synced
            </Text>

          </View>

          <View style={styles.activityItem}>

            <Ionicons
              name="person-add"
              size={18}
              color="#2563EB"
            />

            <Text style={styles.activityText}>
              New patient added today
            </Text>

          </View>

          <View style={styles.activityItem}>

            <Ionicons
              name="warning"
              size={18}
              color="#DC2626"
            />

            <Text style={styles.activityText}>
              2 critical BP alerts
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
    backgroundColor: '#F4F7F9',
  },

  scrollContainer: {
    padding: 22,
    paddingBottom: 40,
  },

  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 999,
    flexDirection: 'row',
  },

  drawerPressable: {
    flex: 1,
    flexDirection: 'row',
  },

  drawerMenu: {
    width: '78%',
    backgroundColor: '#19a38c',
    paddingTop: 80,
    paddingHorizontal: 24,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },

  drawerTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    marginTop: 20,
  },

  drawerSubtitle: {
    color: '#D1FAE5',
    marginTop: 6,
    marginBottom: 40,
    fontSize: 15,
  },

  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },

  drawerText: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 18,
    fontWeight: '600',
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  

  header: {
    marginBottom: 24,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cloudButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
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

  welcomeSection: {
    marginTop: 22,
  },

  greeting: {
    fontSize: 18,
    color: '#6B7280',
  },

  workerName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },

  heroCard: {
    backgroundColor: '#19a38c',
    borderRadius: 30,
    padding: 24,
    marginBottom: 28,
  },

  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },

  heroSubtitle: {
    color: '#D1FAE5',
    marginTop: 6,
    marginBottom: 24,
    fontSize: 15,
  },

  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  heroStatItem: {
    alignItems: 'center',
  },

  heroStatNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },

  heroStatLabel: {
    color: '#D1FAE5',
    marginTop: 4,
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  healthCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },

  iconRed: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconOrange: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconBlue: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconGreen: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },

  cardNumber: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
  },

  cardSubText: {
    color: '#9CA3AF',
    marginTop: 6,
    fontSize: 14,
  },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  quickCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 16,
  },

  quickText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
    marginBottom: 40,
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  activityText: {
    marginLeft: 12,
    color: '#374151',
    fontSize: 15,
  },

});






