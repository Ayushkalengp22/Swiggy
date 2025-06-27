import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../../../src/constants/Colors';

// Components
import AddressCard from '../../../src/component/address/AddressCard';
import AddAddressForm from '../../../src/component/address/AddAddressForm';

// Hook
import {useAddresses} from '../../../src/hooks/useAddresses';

const AddressScreen: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const {
    addresses,
    loading,
    saving,
    currentUserId,
    selectedAddressId,
    addAddress,
    setPrimaryAddress,
    deleteAddress,
    selectAddress,
  } = useAddresses();

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    Animated.timing(slideAnim, {
      toValue: showAddForm ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSaveAddress = async (addressData: any) => {
    const success = await addAddress(addressData);
    if (success) {
      toggleAddForm();
    }
  };

  // Error state
  if (!currentUserId && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🔐</Text>
          <Text style={styles.errorTitle}>Authentication Required</Text>
          <Text style={styles.errorText}>
            Please login to manage your addresses
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.orange} barStyle="light-content" />
      <SafeAreaView style={styles.safeAreaTop} />

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Addresses</Text>
          <Text style={styles.headerSubtitle}>
            Manage your delivery locations
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Loading State */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.orange} />
                <Text style={styles.loadingText}>Loading addresses...</Text>
              </View>
            ) : addresses.length > 0 ? (
              /* Address List */
              addresses.map(address => (
                <AddressCard
                  key={address.id}
                  address={address}
                  isSelected={selectedAddressId === address.id}
                  onSelect={selectAddress}
                  onSetPrimary={setPrimaryAddress}
                  onDelete={deleteAddress}
                />
              ))
            ) : (
              /* Empty State */
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🏠</Text>
                <Text style={styles.emptyTitle}>No Addresses Yet</Text>
                <Text style={styles.emptyText}>
                  Add your first delivery address to get started
                </Text>
              </View>
            )}
          </View>

          {/* Add Address Form */}
          <AddAddressForm
            visible={showAddForm}
            onClose={toggleAddForm}
            onSave={handleSaveAddress}
            slideAnim={slideAnim}
          />
        </ScrollView>

        {/* Floating Add Button */}
        {!showAddForm && !saving && (
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={toggleAddForm}
            activeOpacity={0.8}>
            <Text style={styles.floatingIcon}>+</Text>
            <Text style={styles.floatingText}>Add New Address</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaTop: {
    flex: 0,
    backgroundColor: Colors.orange,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  floatingButton: {
    backgroundColor: Colors.orange,
    margin: 20,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.orange,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  floatingText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AddressScreen;
