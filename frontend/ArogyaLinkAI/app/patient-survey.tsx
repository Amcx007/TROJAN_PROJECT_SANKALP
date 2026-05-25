import React, { useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type PatientRecord = {
  id: string;
  full_name: string;
  address: string;
  dob: string;
  mobile: string;
  created_at?: string;
};

export default function PatientSurveyScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [cameraLocked, setCameraLocked] = useState(false);

  const questions = useMemo(
    () => [
      'Do you have fever?',
      'Do you have cough?',
      'Do you have diabetes history?',
      'Do you have hypertension?',
      'Do you smoke?',
      'Do you consume alcohol?',
      'Any breathing difficulty?',
      'Are medications taken regularly?',
    ],
    []
  );

  useEffect(() => {
    if (!patient) {
      return;
    }

    setSurveySubmitted(false);
  }, [patient]);

  const handleAnswer = (question: string, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: answer,
    }));

    setSurveySubmitted(false);
  };

  const calculateRisk = () => {
    let riskScore = 0;

    Object.values(answers).forEach((answer) => {
      if (answer === 'Yes') {
        riskScore += 1;
      }
    });

    if (riskScore >= 5) {
      return 'High Risk';
    }

    if (riskScore >= 3) {
      return 'Moderate Risk';
    }

    return 'Low Risk';
  };

  const resetSurvey = () => {
    setPatient(null);
    setAnswers({});
    setSurveySubmitted(false);
    setScanLoading(false);
    setCameraLocked(false);
  };

  const normalizeQrValue = (value: string) => {
    const trimmed = value.trim();
    const uuidMatch = trimmed.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i
    );

    return uuidMatch ? uuidMatch[0] : trimmed;
  };

  const loadPatientByQr = async (qrValue: string) => {
    const token = await SecureStore.getItemAsync('token');

    if (!token || !API_BASE_URL) {
      throw new Error('Missing API configuration');
    }

    const response = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(qrValue)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error || 'Patient not found');
    }

    return response.json();
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (cameraLocked) {
      return;
    }

    setCameraLocked(true);
    setScanLoading(true);

    try {
      const foundPatient = await loadPatientByQr(normalizeQrValue(data));
      setPatient(foundPatient);
      setAnswers({});
      setSurveySubmitted(false);
      setScannerVisible(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to read patient QR';
      Alert.alert('Scan failed', message);
    } finally {
      setScanLoading(false);
      setCameraLocked(false);
    }
  };

  const startScan = async () => {
    let currentPermission = permission;

    if (!currentPermission) {
      currentPermission = await requestPermission();
    }

    if (!currentPermission?.granted) {
      if (!currentPermission) {
        Alert.alert('Camera permission required', 'Allow camera access to scan the patient QR code.');
      } else {
        Alert.alert('Camera permission required', 'Allow camera access to scan the patient QR code.');
      }

      return;
    }

    setScannerVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Patient Survey</Text>
          <Text style={styles.headerSubtitle}>
            Scan the patient QR code to load the record and start the survey.
          </Text>
        </View>

        <View style={styles.scanCard}>
          <View style={styles.scanIconWrap}>
            <Ionicons name="qr-code-outline" size={34} color="#19a38c" />
          </View>

          <Text style={styles.scanTitle}>Scan Patient QR</Text>
          <Text style={styles.scanSubtitle}>
            Open the camera, scan the printed patient card, and the details will appear here.
          </Text>

          <TouchableOpacity style={styles.scanButton} onPress={startScan}>
            <Text style={styles.scanButtonText}>Open Camera</Text>
          </TouchableOpacity>
        </View>

        {patient && (
          <View style={styles.patientCard}>
            <View style={styles.patientHeader}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={28} color="#fff" />
              </View>

              <View style={styles.patientMeta}>
                <Text style={styles.patientName}>{patient.full_name}</Text>
                <Text style={styles.patientInfo}>{patient.id}</Text>
                <Text style={styles.patientInfo}>{patient.address || 'No address saved'}</Text>
              </View>
            </View>

            <View style={styles.detailGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>DOB</Text>
                <Text style={styles.detailValue}>{patient.dob}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Mobile</Text>
                <Text style={styles.detailValue}>+91 {patient.mobile}</Text>
              </View>
            </View>

            <View style={styles.statusPill}>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
              <Text style={styles.statusText}>Patient loaded from QR</Text>
            </View>

            <TouchableOpacity style={styles.rescanButton} onPress={resetSurvey}>
              <Text style={styles.rescanButtonText}>Scan Another QR</Text>
            </TouchableOpacity>
          </View>
        )}

        {patient && (
          <>
            <Text style={styles.sectionTitle}>Health Survey</Text>

            {questions.map((question) => (
              <View key={question} style={styles.questionCard}>
                <Text style={styles.questionText}>{question}</Text>

                <View style={styles.answerRow}>
                  <TouchableOpacity
                    style={[
                      styles.answerButton,
                      answers[question] === 'Yes' && styles.selectedYes,
                    ]}
                    onPress={() => handleAnswer(question, 'Yes')}
                  >
                    <Text
                      style={[
                        styles.answerText,
                        answers[question] === 'Yes' && styles.selectedAnswerText,
                      ]}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.answerButton,
                      answers[question] === 'No' && styles.selectedNo,
                    ]}
                    onPress={() => handleAnswer(question, 'No')}
                  >
                    <Text
                      style={[
                        styles.answerText,
                        answers[question] === 'No' && styles.selectedAnswerText,
                      ]}
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.submitButton} onPress={() => setSurveySubmitted(true)}>
              <Text style={styles.submitText}>Submit Survey</Text>
            </TouchableOpacity>
          </>
        )}

        {surveySubmitted && patient && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Risk Assessment</Text>
            <Text style={styles.resultValue}>{calculateRisk()}</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={scannerVisible} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={styles.scannerScreen}>
          <View style={styles.scannerHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setScannerVisible(false)}>
              <Ionicons name="close" size={26} color="#111827" />
            </TouchableOpacity>

            <Text style={styles.scannerTitle}>Scan Patient QR</Text>
            <Text style={styles.scannerSubtitle}>Point the camera at the QR code on the patient card.</Text>
          </View>

          <View style={styles.cameraFrame}>
            {permission?.granted ? (
              <CameraView
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={scanLoading ? undefined : handleBarcodeScanned}
              />
            ) : (
              <View style={styles.permissionCard}>
                <Ionicons name="camera-outline" size={34} color="#19a38c" />
                <Text style={styles.permissionText}>Camera permission is needed to scan QR codes.</Text>
              </View>
            )}

            <View style={styles.scanFrameOverlay}>
              <View style={styles.scanCornerTopLeft} />
              <View style={styles.scanCornerTopRight} />
              <View style={styles.scanCornerBottomLeft} />
              <View style={styles.scanCornerBottomRight} />
            </View>
          </View>

          <View style={styles.scannerFooter}>
            {scanLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#19a38c" />
                <Text style={styles.loadingText}>Loading patient details...</Text>
              </View>
            ) : (
              <Text style={styles.scannerHint}>Hold steady until the QR is detected.</Text>
            )}
          </View>
        </SafeAreaView>
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
  header: {
    marginBottom: 22,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  scanCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
  },
  scanIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9FFF6',
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 14,
  },
  scanSubtitle: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 22,
  },
  scanButton: {
    backgroundColor: '#19a38c',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 24,
    marginBottom: 28,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#19a38c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientMeta: {
    marginLeft: 14,
    flex: 1,
  },
  patientName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  patientInfo: {
    marginTop: 6,
    color: '#6B7280',
    fontSize: 15,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    padding: 14,
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  detailValue: {
    marginTop: 6,
    color: '#111827',
    fontWeight: '700',
    fontSize: 15,
  },
  statusPill: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statusText: {
    marginLeft: 8,
    color: '#166534',
    fontWeight: '700',
  },
  rescanButton: {
    marginTop: 16,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  rescanButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  answerRow: {
    flexDirection: 'row',
    marginTop: 18,
  },
  answerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#F3F4F6',
  },
  selectedYes: {
    backgroundColor: '#19a38c',
  },
  selectedNo: {
    backgroundColor: '#DC2626',
  },
  answerText: {
    color: '#111827',
    fontWeight: '700',
  },
  selectedAnswerText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#19a38c',
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 18,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    marginTop: 24,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  resultValue: {
    fontSize: 30,
    fontWeight: '700',
    color: '#19a38c',
    marginTop: 16,
  },
  scannerScreen: {
    flex: 1,
    backgroundColor: '#F4F7F9',
  },
  scannerHeader: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 18,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  scannerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
  },
  scannerSubtitle: {
    marginTop: 8,
    color: '#6B7280',
    lineHeight: 22,
  },
  cameraFrame: {
    marginHorizontal: 22,
    borderRadius: 32,
    overflow: 'hidden',
    height: 440,
    backgroundColor: '#111827',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  scanFrameOverlay: {
    position: 'absolute',
    left: 32,
    right: 32,
    top: 90,
    bottom: 90,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  scanCornerTopLeft: {
    position: 'absolute',
    left: -2,
    top: -2,
    width: 28,
    height: 28,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#19a38c',
    borderTopLeftRadius: 18,
  },
  scanCornerTopRight: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 28,
    height: 28,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#19a38c',
    borderTopRightRadius: 18,
  },
  scanCornerBottomLeft: {
    position: 'absolute',
    left: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#19a38c',
    borderBottomLeftRadius: 18,
  },
  scanCornerBottomRight: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#19a38c',
    borderBottomRightRadius: 18,
  },
  scannerFooter: {
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  scannerHint: {
    textAlign: 'center',
    color: '#6B7280',
  },
  loadingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  permissionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  permissionText: {
    marginTop: 12,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
  },
});
