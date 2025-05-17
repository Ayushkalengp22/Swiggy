import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import {getUserAddresses} from '../../../Api/login/user/getUserAddress';
import {Colors} from '../../../src/constants/Colors';

const AddressScreen = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    type: '',
    label: '',
    primary: false,
  });

  const userId = 1;
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await getUserAddresses(userId);
      console.log('API Response:', response);

      if (response && response.data && Array.isArray(response.data)) {
        setAddresses(response.data);
        console.log('Setting addresses:', response.data);
      } else {
        console.error('Response format is not as expected:', response);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Alert.alert('Error', 'Failed to load addresses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Updated addresses state:', addresses);
  }, [addresses]);

  const handleAddressTypeSelect = (type: any) => {
    setNewAddress({...newAddress, type, label: type});
  };

  // const handleSaveAddress = () => {
  //   console.log('Saving address:', newAddress);
  //   const mockNewAddress = {
  //     id: Date.now(),
  //     ...newAddress,
  //   };

  //   setAddresses(prevAddresses => [...prevAddresses, mockNewAddress]);
  //   setShowAddForm(false);

  //   // Reset form
  //   setNewAddress({
  //     street: '',
  //     city: '',
  //     state: '',
  //     zipCode: '',
  //     country: 'India',
  //     type: '',
  //     label: '',
  //     primary: false,
  //   });
  // };

  const getAddressIcon = (type: any) => {
    if (!type) return '📍';

    switch (type.toLowerCase()) {
      case 'home':
        return '🏠';
      case 'work':
        return '🏢';
      default:
        return '📍';
    }
  };

  const formatFullAddress = (address: any) => {
    // Check if address has a formatted field already
    if (address.address) return address.address;

    // Otherwise build from components
    const components = [];
    if (address.street) components.push(address.street);
    if (address.city) components.push(address.city);
    if (address.state) components.push(address.state);
    if (address.zipCode) components.push(address.zipCode);
    if (address.country) components.push(address.country);

    return components.join(', ');
  };

  const renderAddressItem = (item: any) => (
    <View key={item.id} style={styles.addressItem}>
      <View style={styles.iconContainer}>
        <Text style={styles.addressIcon}>{getAddressIcon(item.type)}</Text>
      </View>
      <View style={styles.addressDetails}>
        <Text style={styles.addressType}>{item.label || item.type}</Text>
        <Text style={styles.addressText}>{formatFullAddress(item)}</Text>
        {item.primary && <Text style={styles.primaryBadge}>Primary</Text>}
      </View>
    </View>
  );

  return (
    <>
      <StatusBar
        backgroundColor={Colors.orange}
        barStyle="light-content"
        translucent={false}
      />

      {/* Orange header area */}
      <SafeAreaView style={styles.safeAreaTop} />

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Addresses</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          {/* Header */}

          {/* Address List */}
          <View style={styles.addressesContainer}>
            {loading ? (
              <Text style={styles.loadingText}>Loading addresses...</Text>
            ) : addresses.length > 0 ? (
              addresses.map(renderAddressItem)
            ) : (
              <Text style={styles.noAddressText}>
                No addresses found. Add your first address below.
              </Text>
            )}
          </View>

          {/* Add Address Button */}
          <TouchableOpacity
            style={styles.addAddressButton}
            onPress={() => setShowAddForm(true)}>
            <Text style={styles.addButtonText}>
              <Text style={styles.plusIcon}>+</Text> ADD ADDRESS
            </Text>
          </TouchableOpacity>

          {/* Add Address Form */}
          {showAddForm && (
            <View style={styles.addAddressForm}>
              <Text style={styles.formSectionTitle}>Add Address</Text>

              <TextInput
                style={styles.input}
                placeholder="Street"
                value={newAddress.street}
                onChangeText={text =>
                  setNewAddress({...newAddress, street: text})
                }
              />

              <View style={styles.formRow}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="City"
                  value={newAddress.city}
                  onChangeText={text =>
                    setNewAddress({...newAddress, city: text})
                  }
                />

                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="State"
                  value={newAddress.state}
                  onChangeText={text =>
                    setNewAddress({...newAddress, state: text})
                  }
                />
              </View>

              <View style={styles.formRow}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Zip Code"
                  keyboardType="numeric"
                  value={newAddress.zipCode}
                  onChangeText={text =>
                    setNewAddress({...newAddress, zipCode: text})
                  }
                />

                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Country"
                  value={newAddress.country}
                  onChangeText={text =>
                    setNewAddress({...newAddress, country: text})
                  }
                />
              </View>

              <View style={styles.addressTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.addressTypeButton,
                    newAddress.type === 'Home' && styles.selectedAddressType,
                  ]}
                  onPress={() => handleAddressTypeSelect('Home')}>
                  <Text style={styles.addressTypeText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.addressTypeButton,
                    newAddress.type === 'Work' && styles.selectedAddressType,
                  ]}
                  onPress={() => handleAddressTypeSelect('Work')}>
                  <Text style={styles.addressTypeText}>Work</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.addressTypeButton,
                    newAddress.type === 'Other' && styles.selectedAddressType,
                  ]}
                  onPress={() => handleAddressTypeSelect('Other')}>
                  <Text style={styles.addressTypeText}>Other</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formRow}>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      newAddress.primary && styles.checkboxChecked,
                    ]}
                    onPress={() =>
                      setNewAddress({
                        ...newAddress,
                        primary: !newAddress.primary,
                      })
                    }>
                    {newAddress.primary && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>
                    Set as primary address
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                // onPress={handleSaveAddress}
              >
                <Text style={styles.saveButton}>SAVE ADDRESS</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  addressesContainer: {
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  noAddressText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  addressItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  iconContainer: {
    marginRight: 15,
  },
  addressIcon: {
    fontSize: 24,
  },
  addressDetails: {
    flex: 1,
  },
  addressType: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    color: '#666',
  },
  primaryBadge: {
    color: Colors.orange,
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
  },
  addAddressButton: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addButtonText: {
    color: Colors.orange,
    fontWeight: 'bold',
    fontSize: 16,
  },
  plusIcon: {
    fontSize: 20,
    fontWeight: '300',
  },
  addAddressForm: {
    padding: 20,
  },
  formSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
    fontSize: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  addressTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  addressTypeButton: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  selectedAddressType: {
    borderColor: Colors.orange,
  },
  addressTypeText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.orange,
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default AddressScreen;
