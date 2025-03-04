import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';


const TrackingStatusScreen = () => {
  const [status, setStatus] = useState('picked');

  useEffect(() => {
    const statuses = ['picked', 'verification', 'repair', 'delivered'];
    let index = 0;
    const timer = setInterval(() => {
      if (index < statuses.length) {
        setStatus(statuses[index]);
        index++; 
      } else {
        clearInterval(timer);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const getStatusIndex = () => {
    switch (status) {
      case 'picked': return 1;
      case 'verification': return 2;
      case 'repair': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  return (
    <LinearGradient colors={['#FFB75E', '#ED8F03']} style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.cardContainer}>
          <Text style={styles.heading}>Tracking Status</Text>
          <View style={styles.divider} />

          <View style={styles.timeline}>
            {['picked', 'verification', 'repair', 'delivered'].map((step, index) => (
              <React.Fragment key={step}>
                <View style={styles.step}>
                  <View
                    style={[
                      styles.iconContainer,
                      getStatusIndex() >= index + 1 && { backgroundColor: 'orange' },
                    ]}
                  >
                    <MaterialIcons
                      name={
                        step === 'picked' ? 'directions-bike' :
                        step === 'verification' ? 'attach-money' :
                        step === 'repair' ? 'build' : 'local-shipping'
                      }
                      size={24}
                      color={getStatusIndex() >= index + 1 ? 'white' : '#565656'}
                    />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>
                      {step === 'picked' ? 'Product Picked' :
                       step === 'verification' ? 'Cost Verification' :
                       step === 'repair' ? 'Repair In Process' : 'Ready To Deliver'}
                    </Text>
                    <Text style={styles.stepDescription}>
                      {step === 'picked' ? 'Product has been picked and is carried to the assigned shop.' :
                       step === 'verification' ? 'Customer will verify the cost before repairing process.' :
                       step === 'repair' ? 'Your product is being repaired by experts. Sit back & chill!' :
                       'Your product is on the way and will be handed over to you soon.'}
                    </Text>
                  </View>
                </View>
                {index < 3 && (
                  <View style={[styles.connectorLine, getStatusIndex() > index + 1 && styles.filledLine]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </Card>

        <Card style={styles.billCard}>
          <Text style={styles.billTitle}>Bill Details</Text>
          <View style={styles.divider} />
          <View style={styles.billItemRow}><Text style={styles.billItem}>Service Charge:</Text><Text style={styles.billAmount}>₹XXX</Text></View>
          <View style={styles.billItemRow}><Text style={styles.billItem}>Repair Cost:</Text><Text style={styles.billAmount}>₹XXX</Text></View>
          <View style={styles.billItemRow}><Text style={styles.billItem}>Discount:</Text><Text style={styles.discount}>-₹XXX</Text></View>
          <View style={styles.divider} />
          <View style={styles.billItemRow}><Text style={styles.grandTotal}>Grand Total:</Text><Text style={styles.grandTotalAmount}>₹XXX</Text></View>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'transparent', // Keep transparent since LinearGradient provides the background
  },
  cardContainer: {
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
    marginTop: '55'
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#585858',
  },
  timeline: {
    marginLeft: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#585858'
  },
  stepDescription: {
    fontSize: 14,
    color: 'gray',
  },
  connectorLine: {
    height: 30,
    width: 2,
    backgroundColor: '#ccc',
    marginLeft: 20,
    marginTop: -2,
    borderStyle: 'dotted',
  },
  filledLine: {
    backgroundColor: 'orange',
    borderStyle: 'solid',
  },
  billCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  billTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#575757'
  },
  billItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billItem: {
    fontSize: 20,
    color: '#555555'
  },
  billAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#565656'
  },
  discount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#565656'
  },
  grandTotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'orange',
  },
});

export default TrackingStatusScreen;
