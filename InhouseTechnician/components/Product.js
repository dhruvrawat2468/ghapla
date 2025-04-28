import React, { useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { ProductContext } from "../context/ProductContext";
import { useNavigation } from "@react-navigation/native";

const products = [
  { id: 1, name: "Mobile phone / Tablet" },
  { id: 2, name: "Laptop / PC" },
  { id: 3, name: "A.C" },
  { id: 4, name: "T.V" },
  { id: 5, name: "Fridge" },
  { id: 6, name: "Microwave / Oven" },
  { id: 7, name: "Geyser" },

  { id: 9, name: "Washing machine" },
  { id: 10, name: "R.O" },
];

const numColumns = 2;
const cardWidth = Dimensions.get("window").width / numColumns - 24;

const Products = () => {
  const [selectedProducts, setSelectedProductsLocal] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [saved, setSaved] = useState(false);

  const { setSelectedProducts } = useContext(ProductContext);
  const navigation = useNavigation();

  const toggleSelection = (item) => {
    setSelectedProductsLocal((prevSelected) => {
      if (prevSelected.find((p) => p.id === item.id)) {
        return prevSelected.filter((p) => p.id !== item.id);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const handleSave = () => {
    setSaved(true);
    setSelectedProducts(selectedProducts);
    navigation.navigate("Task");
  };

  const handleAddMore = () => {
    setSaved(false);
  };

  if (!showProducts) {
    return (
      <View style={styles.fullScreenContainer}>
        <TouchableOpacity
          style={styles.addProductButton}
          onPress={() => setShowProducts(true)}
        >
          <Text style={styles.addProductText}>Add Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Your Products</Text>
        {selectedProducts.length > 0 && (
          <Text style={styles.selectedCount}>
            {selectedProducts.length} selected
          </Text>
        )}
      </View>

      {/* Selected products pill list */}
      {selectedProducts.length > 0 && (
        <View style={styles.selectedContainer}>
          <FlatList
            data={selectedProducts}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedList}
            renderItem={({ item }) => (
              <View style={styles.selectedPill}>
                <Text style={styles.selectedPillText}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* Product selection grid */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const isSelected = selectedProducts.some((p) => p.id === item.id);
          return (
            <TouchableOpacity
              onPress={() => !saved && toggleSelection(item)}
              disabled={saved}
            >
              <View
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  saved && styles.cardDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.productText,
                    isSelected && styles.productTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
                {isSelected && <View style={styles.selectedIndicator} />}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedProducts.length === 0 && styles.buttonDisabled,
          ]}
          onPress={handleSave}
          disabled={selectedProducts.length === 0}
        >
          <Text style={styles.buttonText}>Save Selection</Text>
        </TouchableOpacity>
        {saved && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleAddMore}
          >
            <Text style={styles.secondaryButtonText}>Add More Products</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  addProductButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: "#fd7e14",
    borderRadius: 8,
    elevation: 2,
  },
  addProductText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  selectedCount: {
    fontSize: 14,
    color: "#fd7e14",
    textAlign: "center",
    marginTop: 4,
  },
  selectedContainer: {
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  selectedList: {
    paddingHorizontal: 16,
  },
  selectedPill: {
    backgroundColor: "#fd7e14",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  selectedPillText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    padding: 12,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    margin: 6,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardSelected: {
    backgroundColor: "#fff5eb",
    borderColor: "#fd7e14",
  },
  cardDisabled: {
    opacity: 0.6,
  },
  productText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  productTextSelected: {
    color: "#fd7e14",
    fontWeight: "600",
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fd7e14",
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  button: {
    backgroundColor: "#fd7e14",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fd7e14",
  },
  secondaryButtonText: {
    color: "#fd7e14",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
});

export default Products;
