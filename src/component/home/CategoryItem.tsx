import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

interface CategoryItemProps {
  name: string;
  imageUrl: string;
  onPress?: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  name,
  imageUrl,
  onPress,
}) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
    <View style={styles.categoryIconContainer}>
      <Image
        source={{uri: imageUrl}}
        style={styles.categoryIcon}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.categoryName}>{name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center',
    marginRight: 24,
    width: 70,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 36,
    height: 36,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});

export default CategoryItem;
