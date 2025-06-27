import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {Colors} from '../../constants/Colors';

interface AddressFormData {
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: 'Home' | 'Work' | 'Other';
  latitude?: number;
  longitude?: number;
}

interface AddAddressFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (address: AddressFormData) => void;
  slideAnim: Animated.Value;
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({
  visible,
  onClose,
  onSave,
  slideAnim,
}) => {
  const [formData, setFormData] = useState<AddressFormData>({
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    type: 'Home',
    latitude: undefined,
    longitude: undefined,
  });

  const updateField = (
    field: keyof AddressFormData,
    value: string | number,
  ) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const selectAddressType = (type: 'Home' | 'Work' | 'Other') => {
    updateField('type', type);
    updateField('label', type);
  };

  const handleSave = () => {
    onSave(formData);
    // Reset form
    setFormData({
      label: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      type: 'Home',
      latitude: undefined,
      longitude: undefined,
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: slideAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>✨ Add New Address</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.content}>
        <FormInput
          label="Address Label"
          placeholder="e.g. Home, Work, Mom's House"
          value={formData.label}
          onChangeText={text => updateField('label', text)}
        />

        <FormInput
          label="Street Address *"
          placeholder="Enter your street address"
          value={formData.street}
          onChangeText={text => updateField('street', text)}
        />

        <View style={styles.row}>
          <FormInput
            label="City *"
            placeholder="City"
            value={formData.city}
            onChangeText={text => updateField('city', text)}
            style={styles.halfWidth}
          />
          <FormInput
            label="State"
            placeholder="State"
            value={formData.state}
            onChangeText={text => updateField('state', text)}
            style={styles.halfWidth}
          />
        </View>

        <View style={styles.row}>
          <FormInput
            label="ZIP Code"
            placeholder="ZIP"
            value={formData.zipCode}
            onChangeText={text => updateField('zipCode', text)}
            keyboardType="numeric"
            style={styles.halfWidth}
          />
          <FormInput
            label="Country"
            placeholder="Country"
            value={formData.country}
            onChangeText={text => updateField('country', text)}
            style={styles.halfWidth}
          />
        </View>

        {/* Address Type Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address Type *</Text>
          <View style={styles.typeGrid}>
            {[
              {type: 'Home', icon: '🏠'},
              {type: 'Work', icon: '🏢'},
              {type: 'Other', icon: '📍'},
            ].map(({type, icon}: any) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  formData.type === type && styles.selectedType,
                ]}
                onPress={() => selectAddressType(type)}>
                <Text style={styles.typeIcon}>{icon}</Text>
                <Text
                  style={[
                    styles.typeText,
                    formData.type === type && styles.selectedTypeText,
                  ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Primary Toggle - Remove this section */}
        {/* <TouchableOpacity
          style={styles.toggle}
          onPress={() => updateField('primary', !formData.primary)}>
          <View style={[styles.switch, formData.primary && styles.switchActive]}>
            <View style={[styles.knob, formData.primary && styles.knobActive]} />
          </View>
          <Text style={styles.toggleLabel}>Set as primary address</Text>
        </TouchableOpacity> */}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// Reusable Form Input Component
const FormInput: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric';
  style?: any;
}> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  style,
}) => (
  <View style={[styles.inputGroup, style]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  typeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
  },
  typeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectedTypeText: {
    color: '#fff',
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e9ecef',
    marginRight: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: Colors.orange,
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  knobActive: {
    alignSelf: 'flex-end',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.orange,
    borderRadius: 12,
    paddingVertical: 16,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AddAddressForm;
