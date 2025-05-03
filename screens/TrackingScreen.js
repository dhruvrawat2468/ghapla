import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, RadioButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';


const TrackingStatusScreen = () => {
  const [status, setStatus] = useState('picked');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const statuses = ['picked', 'verification', 'repair', 'delivered'];
  const indexRef = useRef(0);

  // Animated Values for each step line
  const animatedLines = useRef(statuses.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const timer = setInterval(() => {
      if (indexRef.current < statuses.length - 1) {
        indexRef.current++;
        setStatus(statuses[indexRef.current]);

        // Animate the connector line when status updates
        Animated.timing(animatedLines[indexRef.current - 1], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      } else {
        clearInterval(timer);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handlePayment = () => {
    alert(`Payment method selected: ${paymentMethod}`);
  };

  return (
    <LinearGradient colors={['#FFB75E', '#ED8F03']} style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.cardContainer}>
          <Text style={styles.heading}>Tracking Status</Text>
          <View style={styles.divider} />

          <View style={styles.timeline}>
            {statuses.map((step, index) => (
              <React.Fragment key={step}>
                <View style={styles.step}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons
                      name={
                        step === 'picked' ? 'directions-bike' :
                        step === 'verification' ? 'attach-money' :
                        step === 'repair' ? 'build' : 'local-shipping'
                      }
                      size={24}
                      color="white"
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
                {index < statuses.length - 1 && (
                  <Animated.View
                    style={[
                      styles.connectorLine,
                      {
                        height: animatedLines[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 40], // Adjust height dynamically
                        }),
                      },
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </Card>

        {/* Bill Details */}
        <Card style={styles.billCard}>
          <Text style={styles.billTitle}>Bill Details</Text>
          <View style={styles.divider} />
          <View style={styles.billItemRow}><Text style={styles.billItem}>Service Charge:</Text><Text style={styles.billAmount}>₹XXX</Text></View>
          <View style={styles.billItemRow}><Text style={styles.billItem}>Repair Cost:</Text><Text style={styles.billAmount}>₹XXX</Text></View>
          <View style={styles.billItemRow}><Text style={styles.billItem}>Discount:</Text><Text style={styles.discount}>-₹XXX</Text></View>
          <View style={styles.divider} />
          <View style={styles.billItemRow}><Text style={styles.grandTotal}>Grand Total:</Text><Text style={styles.grandTotalAmount}>₹XXX</Text></View>
        </Card>

        {/* Payment Method */}
        <Card style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Select Payment Method</Text>
          <View style={styles.divider} />
          <RadioButton.Group onValueChange={value => setPaymentMethod(value)} value={paymentMethod}>
            <View style={styles.radioOption}>
              <RadioButton value="COD" />
              <Text style={styles.radioText}>Cash on Delivery (COD)</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="UPI" />
              <Text style={styles.radioText}>UPI Payment</Text>
            </View>
          </RadioButton.Group>

          {/* Payment Button */}
          <TouchableOpacity
            style={[styles.paymentButton, !paymentMethod && styles.disabledButton]}
            onPress={handlePayment}
            disabled={!paymentMethod}
          >
            <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
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
  },
  cardContainer: {
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
    marginTop: 20,
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
    backgroundColor: 'orange',
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
    color: '#585858',
  },
  stepDescription: {
    fontSize: 14,
    color: 'gray',
  },
  connectorLine: {
    width: 2,
    backgroundColor: 'orange',
    marginLeft: 20,
    marginTop: -2,
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
    color: '#575757',
  },
  billItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billItem: {
    fontSize: 20,
    color: '#555555',
  },
  billAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#565656',
  },
  discount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#565656',
  },
  grandTotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'orange',
  },
  paymentCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  paymentButton: {
    marginTop: 20,
    backgroundColor: 'orange',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
});

export default TrackingStatusScreen;
