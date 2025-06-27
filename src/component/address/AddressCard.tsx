import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../../constants/Colors';

interface AddressCardProps {
  address: {
    id: number;
    type: 'Home' | 'Work' | 'Other';
    label?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    address?: string;
    primary?: boolean;
  };
  isSelected: boolean;
  onSelect: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onSetPrimary?: (id: number) => Promise<boolean>;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSetPrimary,
}) => {
  const [isPrimaryLoading, setIsPrimaryLoading] = useState(false);

  const getAddressIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'home':
        return '🏠';
      case 'work':
        return '🏢';
      default:
        return '📍';
    }
  };

  const formatAddress = () => {
    if (address.address) return address.address;

    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean);
    return parts.join(', ');
  };

  const handleSetPrimary = async () => {
    if (!onSetPrimary || isPrimaryLoading) return;

    setIsPrimaryLoading(true);
    try {
      await onSetPrimary(address.id);
    } finally {
      setIsPrimaryLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        address.primary && styles.primaryCard,
      ]}
      onPress={() => onSelect(address.id)}
      activeOpacity={0.7}>
      {address.primary && (
        <View style={styles.primaryBadge}>
          <Text style={styles.primaryBadgeText}>⭐ PRIMARY</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getAddressIcon(address.type)}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.type}>{address.label || address.type}</Text>
          <Text style={styles.subtitle}>Delivery Address</Text>
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </View>

      <Text style={styles.addressText}>{formatAddress()}</Text>

      <View style={styles.footer}>
        {!address.primary && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              isPrimaryLoading && styles.disabledButton,
            ]}
            onPress={handleSetPrimary}
            disabled={isPrimaryLoading}>
            {isPrimaryLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFD700" />
                <Text style={styles.loadingText}>Setting...</Text>
              </View>
            ) : (
              <Text style={styles.primaryActionText}>⭐ Set Primary</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit?.(address.id)}>
          <Text style={styles.editText}>✏️ Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete?.(address.id)}>
          <Text style={styles.deleteText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: Colors.orange,
  },
  primaryCard: {
    borderColor: '#FFD700',
  },
  primaryBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    zIndex: 1,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
  },
  type: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  selectedIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 15,
    color: '#555',
    paddingHorizontal: 16,
    paddingBottom: 12,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
    marginLeft: 4,
  },
  primaryActionText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '500',
  },
  editText: {
    fontSize: 14,
    color: Colors.orange,
    fontWeight: '500',
  },
  deleteText: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '500',
  },
});

export default AddressCard;
