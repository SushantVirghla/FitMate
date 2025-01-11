import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ onSearch, setSearchText }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    onSearch(searchInput);
  };

  const handleChange = (text) => {
    setSearchInput(text);
    setSearchText(text); // Update parent's searchText
  };

  return (
    <View style={styles.searchBar}>
      <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder="Search exercises"
        value={searchInput}
        onChangeText={handleChange}
        onSubmitEditing={handleSearch} // Add this to handle Enter/Return key
      />
      <TouchableOpacity onPress={handleSearch}>
        <Text style={styles.searchButton}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  searchButton: {
    marginLeft: 10,
    color: 'blue',
  },
});

export default SearchBar;