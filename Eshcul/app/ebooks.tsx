// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   Alert,
//   useWindowDimensions,
//   Text,
// } from 'react-native';
// import { Card, Title, Paragraph, Button } from 'react-native-paper';
// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';
// // import axios from 'axios';
// // import {Api_url} from './config/config.js'
// import api from "../api/api";


// interface Ebook {
//   id: string;
//   title: string;
//   subject: string;
//   pdfurl: string;
//   author: string;
// }

// const EbookScreen = () => {
//   const [ebooks, setEbooks] = useState<Ebook[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { width } = useWindowDimensions();
//   const isMidSizePhone = width >= 320 && width <= 480;

//   useEffect(() => {
//     const fetchEbooks = async () => {
//       try {
//         const res = await api.get('/AddEbook', { timeout: 5000 });
//         const ebooksArray = Array.isArray(res.data)
//           ? res.data
//           : res.data?.ebooks || res.data?.data || [];

//         const formatted = ebooksArray.map((item: any) => ({
//           id: item._id || item.id || Math.random().toString(),
//           title: item.title || 'Untitled',
//           subject: item.subject || '-',
//           pdfurl: item.pdfUrl?.startsWith('http')
//             ? item.pdfUrl
//             : `${api.defaults.baseURL}${item.pdfUrl}`,
//           author: item.author || '-',
//         }));
//         setEbooks(formatted);
//       } catch (err) {
//         Alert.alert(
//           'Error',
//           'Failed to load ebooks. Please check your network or server.'
//         );
//         setEbooks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEbooks();
//   }, []);

//   const handleDownload = async (ebook: Ebook) => {
//     try {
//       if (!ebook.pdfurl) {
//         Alert.alert('Error', 'Invalid file URL');
//         return;
//       }
  
//       const safeTitle = ebook.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
//       const fileName = `${safeTitle}_${Date.now()}.pdf`;
//       const fileUri = FileSystem.documentDirectory + fileName;
  
//       console.log("Downloading from:", ebook.pdfurl);
//       console.log("Saving as:", fileUri);
  
//       const { uri } = await FileSystem.downloadAsync(
//         ebook.pdfurl,
//         fileUri
//       );
  
//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(uri);
//       } else {
//         Alert.alert("Downloaded", `Saved at ${uri}`);
//       }
//     } catch (e: any) {
//       console.error(e);
//       Alert.alert("Error", `Download failed: ${e.message || e}`);
//     }
//   };
  


//   const renderEbookCard = ({ item }: { item: Ebook }) => (
//     <Card style={[styles.card, isMidSizePhone && styles.midSizeCard]}>
//       <Card.Content>
//         <Title style={[styles.title, isMidSizePhone && styles.midSizeTitle]}>
//           {item.title}
//         </Title>
//         <Paragraph style={styles.subject}>Subject: {item.subject}</Paragraph>
//         <Paragraph style={styles.file}>Author: {item.author}</Paragraph>
//       </Card.Content>
//       <Card.Actions style={styles.actions}>
//         <Button mode="contained" onPress={() => handleDownload(item)}>
//           Download
//         </Button>
//       </Card.Actions>
//     </Card>
//   );

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ fontSize: 18, color: '#555' }}>Loading eBooks...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, isMidSizePhone && styles.midSizeContainer]}>
//       <FlatList
//         data={ebooks}
//         keyExtractor={(item) => item.id}
//         renderItem={renderEbookCard}
//         contentContainerStyle={styles.listContainer}
//         ListEmptyComponent={
//           <Text style={{ textAlign: 'center', color: '#888', marginTop: 40, fontSize: 16 }}>
//             No eBooks available.
//           </Text>
//         }
//       />
//     </View>
//   );
// };

// export default EbookScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F9F9F9',
//   },
//   midSizeContainer: {
//     padding: 12,
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   card: {
//     marginBottom: 16,
//     borderRadius: 12,
//     backgroundColor: '#fff',
//     elevation: 3,
//     paddingHorizontal: 10,
//   },
//   midSizeCard: {
//     paddingHorizontal: 6,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   midSizeTitle: {
//     fontSize: 16,
//   },
//   subject: {
//     marginTop: 4,
//     fontSize: 14,
//     color: '#555',
//   },
//   file: {
//     fontSize: 13,
//     color: '#999',
//   },
//   actions: {
//     justifyContent: 'flex-end',
//     marginTop: 8,
//     marginBottom: 4,
//   },
// });
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Text,
  ActivityIndicator,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from "../api/api";
import { useLang } from './language';


interface Ebook {
  id: string;
  title: string;
  subject: string;
  pdfurl: string;
  author: string;
  year?: string;
  description?: string;
}

const EbookScreen = () => {
  const { t } = useLang();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [filteredEbooks, setFilteredEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [sortBy, setSortBy] = useState('title');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    fetchEbooks();
  }, []);

  useEffect(() => {
    filterAndSortEbooks();
  }, [searchQuery, selectedSubject, sortBy, ebooks]);

  const fetchEbooks = async () => {
    try {
      const res = await api.get('/AddEbook', { timeout: 5000 });
      const ebooksArray = Array.isArray(res.data)
        ? res.data
        : res.data?.ebooks || res.data?.data || [];

      const formatted = ebooksArray.map((item: any) => ({
        id: item._id || item.id || Math.random().toString(),
        title: item.title || 'Untitled',
        subject: item.subject || 'General',
        pdfurl: item.pdfUrl?.startsWith('http')
          ? item.pdfUrl
          : `${api.defaults.baseURL}${item.pdfUrl}`,
        author: item.author || 'Unknown Author',
        year: item.year || '',
        description: item.description || '',
      }));

      setEbooks(formatted);
      setFilteredEbooks(formatted);
      
      // Extract unique subjects
      const uniqueSubjects = ['All', ...new Set(formatted.map(ebook => ebook.subject).filter(Boolean))];
      setSubjects(uniqueSubjects);
    } catch (err) {
      Alert.alert(
        'Error',
        'Failed to load ebooks. Please check your network or server.'
      );
      setEbooks([]);
      setFilteredEbooks([]);
      setSubjects(['All']);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortEbooks = () => {
    let filtered = [...ebooks];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(ebook =>
        ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ebook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ebook.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ebook.description && ebook.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by subject
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(ebook => 
        ebook.subject === selectedSubject
      );
    }

    // Sort ebooks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'subject':
          return a.subject.localeCompare(b.subject);
        case 'year':
          return (b.year || '').localeCompare(a.year || '');
        default:
          return 0;
      }
    });

    setFilteredEbooks(filtered);
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      mathematics: '#3B82F6',
      science: '#10B981',
      english: '#EF4444',
      computer: '#8B5CF6',
      physics: '#F59E0B',
      chemistry: '#EC4899',
      biology: '#84CC16',
      history: '#F97316',
      geography: '#06B6D4',
      economics: '#8B5CF6',
      business: '#10B981',
      arts: '#EC4899',
      general: '#64748B',
    };
    return colors[subject.toLowerCase()] || '#64748B';
  };

  const getSubjectIcon = (subject: string) => {
    const icons: { [key: string]: string } = {
      mathematics: 'calculator',
      science: 'atom',
      english: 'book-open-variant',
      computer: 'laptop',
      physics: 'atom',
      chemistry: 'flask',
      biology: 'leaf',
      history: 'history',
      geography: 'earth',
      economics: 'chart-line',
      business: 'briefcase',
      arts: 'palette',
    };
    return icons[subject.toLowerCase()] || 'book';
  };

  const handleDownload = async (ebook: Ebook) => {
    try {
      if (!ebook.pdfurl) {
        Alert.alert('Error', 'Invalid file URL');
        return;
      }
  
      const safeTitle = ebook.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const fileName = `${safeTitle}_${Date.now()}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;
  
      console.log("Downloading from:", ebook.pdfurl);
      console.log("Saving as:", fileUri);
  
      const { uri } = await FileSystem.downloadAsync(
        ebook.pdfurl,
        fileUri
      );
  
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Downloaded", `Saved at ${uri}`);
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", `Download failed: ${e.message || e}`);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleSortSelect = (sortOption: string) => {
    setSortBy(sortOption);
    setFilterModalVisible(false);
  };

  const renderEbookCard = ({ item }: { item: Ebook }) => {
    const subjectColor = getSubjectColor(item.subject);
    const subjectIcon = getSubjectIcon(item.subject);
    
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.headerRow}>
            <View style={[styles.iconContainer, { backgroundColor: subjectColor + '20' }]}>
              <MaterialCommunityIcons 
                name={subjectIcon} 
                size={24} 
                color={subjectColor} 
              />
            </View>
            <View style={styles.titleContainer}>
              <Title style={styles.title} numberOfLines={2}>{item.title}</Title>
              <View style={styles.subjectRow}>
                <View style={[styles.subjectBadge, { backgroundColor: subjectColor + '15' }]}>
                  <Text style={[styles.subjectText, { color: subjectColor }]}>
                    {item.subject}
                  </Text>
                </View>
                {item.year && (
                  <View style={styles.yearBadge}>
                    <Text style={styles.yearText}>{item.year}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="account" size={16} color="#64748b" />
              <Text style={styles.detailLabel}>Author:</Text>
              <Text style={styles.detailValue}>{item.author}</Text>
            </View>
            
            {item.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>Description:</Text>
                <Text style={styles.descriptionText} numberOfLines={3}>
                  {item.description}
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button 
            mode="contained" 
            style={[styles.downloadButton, { backgroundColor: subjectColor }]}
            onPress={() => handleDownload(item)}
            icon="download"
          >
            Download
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort & Filter</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              {['title', 'author', 'subject', 'year'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.filterOption,
                    sortBy === option && styles.filterOptionSelected
                  ]}
                  onPress={() => handleSortSelect(option)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    sortBy === option && styles.filterOptionTextSelected
                  ]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                  {sortBy === option && (
                    <MaterialCommunityIcons name="check" size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Subject Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Filter by Subject</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectsScroll}>
                {subjects.map(subject => (
                  <TouchableOpacity
                    key={subject}
                    style={[
                      styles.subjectChip,
                      selectedSubject === subject && styles.subjectChipSelected
                    ]}
                    onPress={() => handleSubjectSelect(subject)}
                  >
                    <Text style={[
                      styles.subjectChipText,
                      selectedSubject === subject && styles.subjectChipTextSelected
                    ]}>
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Active Filters Display */}
            <View style={styles.activeFilters}>
              <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
              <View style={styles.activeFiltersRow}>
                {selectedSubject !== 'All' && (
                  <View style={styles.activeFilterBadge}>
                    <Text style={styles.activeFilterText}>Subject: {selectedSubject}</Text>
                    <TouchableOpacity onPress={() => setSelectedSubject('All')}>
                      <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                )}
                {searchQuery && (
                  <View style={styles.activeFilterBadge}>
                    <Text style={styles.activeFilterText}>Search: "{searchQuery}"</Text>
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSelectedSubject('All');
                setSearchQuery('');
                setSortBy('title');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="library" size={30} color="#3B82F6" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>E-Books Library</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{ebooks.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredEbooks.length}</Text>
              <Text style={styles.statLabel}>Showing</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{subjects.length - 1}</Text>
              <Text style={styles.statLabel}>Subjects</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search e-books by title, author, or subject..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#94a3b8"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <MaterialCommunityIcons name="filter-variant" size={22} color="#3B82F6" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Active Filters Quick View */}
      {(selectedSubject !== 'All' || searchQuery) && (
        <View style={styles.quickFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedSubject !== 'All' && (
              <View style={styles.quickFilterChip}>
                <Text style={styles.quickFilterText}>{selectedSubject}</Text>
                <TouchableOpacity onPress={() => setSelectedSubject('All')}>
                  <MaterialCommunityIcons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            {searchQuery && (
              <View style={styles.quickFilterChip}>
                <Text style={styles.quickFilterText}>"{searchQuery}"</Text>
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialCommunityIcons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={() => {
                setSelectedSubject('All');
                setSearchQuery('');
              }}
            >
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Subject Quick Filter */}
      <View style={styles.subjectFilterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {subjects.slice(0, 6).map(subject => (
            <TouchableOpacity
              key={subject}
              style={[
                styles.subjectFilterChip,
                selectedSubject === subject && styles.subjectFilterChipSelected
              ]}
              onPress={() => handleSubjectSelect(subject)}
            >
              <Text style={[
                styles.subjectFilterText,
                selectedSubject === subject && styles.subjectFilterTextSelected
              ]}>
                {subject}
              </Text>
            </TouchableOpacity>
          ))}
          {subjects.length > 6 && (
            <TouchableOpacity
              style={styles.moreSubjectsButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Text style={styles.moreSubjectsText}>+{subjects.length - 6} more</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Ebooks List */}
      <FlatList
        data={filteredEbooks}
        keyExtractor={(item) => item.id}
        renderItem={renderEbookCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="book-search" size={50} color="#94a3b8" />
            </View>
            <Text style={styles.emptyTitle}>No e-books found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || selectedSubject !== 'All' 
                ? 'Try changing your search or filter criteria'
                : 'No e-books available in the library'
              }
            </Text>
            {(searchQuery || selectedSubject !== 'All') && (
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedSubject('All');
                }}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {renderFilterModal()}
    </View>
  );
};

export default EbookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#1e293b',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  quickFilters: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    gap: 6,
  },
  quickFilterText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
  },
  clearAllText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  subjectFilterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  subjectFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  subjectFilterChipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  subjectFilterText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  subjectFilterTextSelected: {
    color: '#ffffff',
  },
  moreSubjectsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
  },
  moreSubjectsText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
    lineHeight: 22,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  yearBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  yearText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  detailsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginLeft: 6,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  downloadButton: {
    flex: 1,
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    backgroundColor: '#f1f5f9',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalBody: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  filterOptionText: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  subjectsScroll: {
    marginBottom: 8,
  },
  subjectChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  subjectChipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  subjectChipText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  subjectChipTextSelected: {
    color: '#ffffff',
  },
  activeFilters: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  activeFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activeFilterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  activeFilterText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  clearButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  applyButton: {
    flex: 2,
    padding: 14,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});