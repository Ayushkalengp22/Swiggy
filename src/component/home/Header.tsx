import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Colors} from '../../constants/Colors';
import {UserData} from '../../hooks/useUserData';

type RootStackParamList = {
  AddressScreen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface HeaderProps {
  headerVisible: Animated.Value;
  userData: UserData | null;
  userLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  headerVisible,
  userData,
  userLoading,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const addressOpacity = headerVisible;
  const addressHeight = headerVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
    extrapolate: 'clamp',
  });

  const headerPadding = headerVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 16],
    extrapolate: 'clamp',
  });

  const firstName = userData?.name ? userData.name.split(' ')[0] : '';
  const userAddress = userData?.primaryAddress || userData?.address || null;

  return (
    <Animated.View
      style={[
        styles.header,
        {
          paddingVertical: headerPadding,
          paddingHorizontal: 16,
        },
      ]}>
      <Animated.View
        style={[
          styles.locationContainer,
          {
            opacity: addressOpacity,
            height: addressHeight,
            overflow: 'hidden',
            marginBottom: addressHeight.interpolate({
              inputRange: [0, 40],
              outputRange: [0, 12],
              extrapolate: 'clamp',
            }),
          },
        ]}>
        <Text style={styles.locationLabel}>
          {userLoading
            ? 'LOADING...'
            : firstName
            ? `Hi ${firstName}! DELIVERY TO`
            : 'DELIVERY TO'}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddressScreen')}
          style={styles.locationValue}>
          <Text style={styles.locationText}>
            {userLoading
              ? 'Loading address...'
              : userAddress
              ? userAddress
              : 'Select your delivery address'}
          </Text>
          <Text style={styles.locationArrow}>▼</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurants and food"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Text>🔍</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.orange,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomEndRadius: 30,
    borderBottomLeftRadius: 30,
    zIndex: 999,
  },
  locationContainer: {
    marginBottom: 12,
    justifyContent: 'center',
  },
  locationLabel: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  locationValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  locationArrow: {
    marginLeft: 8,
    fontSize: 12,
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  searchIcon: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
