// src/components/FoodItem/FoodItem.tsx
import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

type FoodItemProps = {
  item: any;
  onIncrement: (item: any) => void;
  onDecrement: (item: any) => void;
  onMoreDetails: (item: any) => void;
};

const FoodItem = ({
  item,
  onIncrement,
  onDecrement,
  onMoreDetails,
}: FoodItemProps) => {
  return (
    <View style={styles.foodItemContainer}>
      <View style={styles.foodDetails}>
        {item.isBestseller && (
          <View style={styles.bestsellerContainer}>
            <Text style={styles.bestsellerText}>♨️ Bestseller</Text>
          </View>
        )}
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodPrice}>₹{item.price}</Text>

        {item.rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>★ {item.rating}</Text>
            {item.reviewCount && (
              <Text style={styles.reviewCount}>({item.reviewCount})</Text>
            )}
          </View>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.wishlistButton}>
            <Text style={styles.wishlistIcon}>♡</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onMoreDetails(item)}>
            <Text style={{color: 'blue', marginTop: 5}}>More Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{uri: item.imageUrl}} style={styles.foodImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}

        {item.quantity && item.quantity > 0 ? (
          <QuantityControl
            quantity={item.quantity}
            onIncrement={() => onIncrement(item)}
            onDecrement={() => onDecrement(item)}
          />
        ) : (
          <AddButton onPress={() => onIncrement(item)} />
        )}
      </View>
    </View>
  );
};

const QuantityControl = ({quantity, onIncrement, onDecrement}: any) => (
  <View style={styles.quantityContainer}>
    <TouchableOpacity style={styles.quantityButton} onPress={onDecrement}>
      <Text style={styles.quantityButtonText}>-</Text>
    </TouchableOpacity>
    <Text style={styles.quantityText}>{quantity}</Text>
    <TouchableOpacity style={styles.quantityButton} onPress={onIncrement}>
      <Text style={styles.quantityButtonText}>+</Text>
    </TouchableOpacity>
  </View>
);

const AddButton = ({onPress}: any) => (
  <TouchableOpacity style={styles.addButton} onPress={onPress}>
    <Text style={styles.addButtonText}>ADD</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  foodItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  foodDetails: {
    flex: 1,
    paddingRight: 12,
  },
  bestsellerContainer: {
    marginBottom: 6,
  },
  bestsellerText: {
    color: '#FF6A3D',
    fontSize: 12,
    fontWeight: '600',
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C0B0B',
    marginBottom: 4,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C0B0B',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  reviewCount: {
    color: '#888',
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wishlistButton: {
    marginRight: 10,
  },
  wishlistIcon: {
    fontSize: 20,
    color: '#F08E55',
  },
  imageContainer: {
    width: 120,
    alignItems: 'center',
  },
  foodImage: {
    width: 120,
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  placeholderImage: {
    width: 120,
    height: 100,
    backgroundColor: '#EEEEEE',
    borderRadius: 6,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 6,
    overflow: 'hidden',
  },
  quantityButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 16,
  },
  quantityText: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
    minWidth: 30,
  },
});

export default FoodItem;
