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

export default function PatientSurveyScreen() {

  const [patientScanned,
    setPatientScanned] =
    useState(false);

  const [patientVerified,
    setPatientVerified] =
    useState(false);

  const [surveySubmitted,
    setSurveySubmitted] =
    useState(false);

  const [answers, setAnswers] =
    useState<any>({});

  const questions = [

    'Do you have fever?',

    'Do you have cough?',

    'Do you have diabetes history?',

    'Do you have hypertension?',

    'Do you smoke?',

    'Do you consume alcohol?',

    'Any breathing difficulty?',

    'Are medications taken regularly?',

  ];

  const handleAnswer = (
    question: string,
    answer: string
  ) => {

    setAnswers((prevAnswers: any) => ({
      ...prevAnswers,
      [question]: answer,
    }));

    setSurveySubmitted(false);
  };

  const calculateRisk = () => {

    let riskScore = 0;

    Object.values(answers).forEach(
      (answer) => {

      if (answer === 'Yes') {

        riskScore++;

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

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContainer
        }
      >

        {/* HEADER */}

        <Text style={styles.headerTitle}>
          Patient Survey
        </Text>

        {/* SCAN SECTION */}

        <View style={styles.scanCard}>

          <Ionicons
            name="qr-code-outline"
            size={58}
            color="#19a38c"
          />

          <Text style={styles.scanTitle}>
            Scan Patient Card
          </Text>

          <Text style={styles.scanSubtitle}>
            Scan QR to retrieve patient
            information
          </Text>

          {/* SCAN BUTTON */}

          <TouchableOpacity
            style={styles.scanButton}

            onPress={() => {

              // CAMERA SCAN SIMULATION

              setPatientScanned(true);

            }}
          >

            <Text style={styles.scanButtonText}>
              Scan Patient QR
            </Text>

          </TouchableOpacity>

        </View>

        {/* PATIENT CARD */}

        {patientScanned && (

          <View style={styles.patientCard}>

            <View style={styles.patientHeader}>

              <Ionicons
                name="person-circle-outline"
                size={58}
                color="#19a38c"
              />

              <View style={{ marginLeft: 14 }}>

                <Text style={styles.patientName}>
                  Ramesh Kumar
                </Text>

                <Text style={styles.patientInfo}>
                  ASHA-2026-001
                </Text>

                <Text style={styles.patientInfo}>
                  Mysore, Karnataka
                </Text>

              </View>

            </View>

            {/* VERIFY BUTTON */}

            <TouchableOpacity
              style={styles.verifyButton}
              onPress={() =>
                setPatientVerified(true)
              }
            >

              <Text style={styles.verifyButtonText}>
                Verify Patient
              </Text>

            </TouchableOpacity>

          </View>

        )}

        {/* HEALTH SURVEY */}

        {patientVerified && (

          <>

            <Text style={styles.sectionTitle}>
              Health Survey
            </Text>

            {questions.map(
              (question, index) => (

              <View
                key={index}
                style={styles.questionCard}
              >

                <Text
                  style={styles.questionText}
                >
                  {question}
                </Text>

                <View
                  style={styles.answerRow}
                >

                  {/* YES */}

                  <TouchableOpacity
                    style={[

                      styles.answerButton,

                      answers[question] ===
                      'Yes' &&

                      styles.selectedYes,

                    ]}

                    onPress={() =>
                      handleAnswer(
                        question,
                        'Yes'
                      )
                    }
                  >

                    <Text
                      style={[
                        styles.answerText,
                        answers[question] ===
                          'Yes' &&
                          styles.selectedAnswerText,
                      ]}
                    >
                      Yes
                    </Text>

                  </TouchableOpacity>

                  {/* NO */}

                  <TouchableOpacity
                    style={[

                      styles.answerButton,

                      answers[question] ===
                      'No' &&

                      styles.selectedNo,

                    ]}

                    onPress={() =>
                      handleAnswer(
                        question,
                        'No'
                      )
                    }
                  >

                    <Text
                      style={[
                        styles.answerText,
                        answers[question] ===
                          'No' &&
                          styles.selectedAnswerText,
                      ]}
                    >
                      No
                    </Text>

                  </TouchableOpacity>

                </View>

              </View>

            ))}

            {/* SUBMIT */}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() =>
                setSurveySubmitted(true)
              }
            >

              <Text style={styles.submitText}>
                Submit Survey
              </Text>

            </TouchableOpacity>

          </>

        )}

        {/* RESULT */}

        {surveySubmitted && (

          <View style={styles.resultCard}>

            <Text style={styles.resultTitle}>
              Risk Assessment
            </Text>

            <Text style={styles.resultValue}>
              {calculateRisk()}
            </Text>

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

  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 28,
  },

  scanCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
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

  verifyButton: {
    backgroundColor: '#19a38c',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },

  verifyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
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

});