import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '@/api/api';
import { useLang } from '../app/language';

interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: 'national' | 'regional' | 'school' | 'religious';
  description?: string;
}

export default function HolidaysScreen() {
  const router = useRouter();
  const { t } = useLang();
  const [student, setStudent] = useState<any>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Get month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load student data
  useEffect(() => {
    const loadStudent = async () => {
      try {
        const s = await AsyncStorage.getItem('student');
        if (s) {
          setStudent(JSON.parse(s));
        }
      } catch (error) {
        console.log('Error loading student:', error);
      }
    };
    loadStudent();
  }, []);

  // Fetch holidays
  const fetchHolidays = async () => {
    if (!student) return;

    try {
      const res = await api.get('/api/holidays');
      
      const formatted = res.data.map((holiday: any) => ({
        id: holiday._id,
        name: holiday.name,
        date: new Date(holiday.date),
        type: holiday.type,
        description: holiday.description,
      }));

      setHolidays(formatted);
    } catch (error) {
      console.log('Error fetching holidays:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (student) {
      fetchHolidays();
    }
  }, [student]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHolidays();
  };

  // Filter holidays by selected month and year
  const filteredHolidays = holidays
    .filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getMonth() === selectedMonth && 
             holidayDate.getFullYear() === selectedYear;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Get upcoming holidays (next 30 days)
  const upcomingHolidays = holidays
    .filter(holiday => {
      const today = new Date();
      const holidayDate = new Date(holiday.date);
      const diffTime = holidayDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  const getTypeColor = (type: Holiday['type']) => {
    switch (type) {
      case 'national': return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
      case 'regional': return { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' };
      case 'school': return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
      case 'religious': return { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' };
      default: return { bg: '#f3f4f6', text: '#1f2937', border: '#e5e7eb' };
    }
  };

  const getTypeLabel = (type: Holiday['type']) => {
    switch (type) {
      case 'national': return 'National';
      case 'regional': return 'Regional';
      case 'school': return 'School';
      case 'religious': return 'Religious';
      default: return type;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderHolidayCard = ({ item }: { item: Holiday }) => {
    const colors = getTypeColor(item.type);
    const date = new Date(item.date);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const isToday = date.toDateString() === new Date().toDateString();
    const isPast = date < new Date(new Date().setHours(0,0,0,0));

    return (
      <View style={[styles.holidayCard, isPast && styles.pastHoliday]}>
        {/* Date Circle */}
        <View style={styles.dateCircle}>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateMonth}>{month}</Text>
          {isToday && <View style={styles.todayBadge} />}
        </View>

        {/* Holiday Details */}
        <View style={styles.holidayDetails}>
          <View style={styles.holidayHeader}>
            <Text style={styles.holidayName}>{item.name}</Text>
            <View style={[styles.typeBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
              <Text style={[styles.typeText, { color: colors.text }]}>
                {getTypeLabel(item.type)}
              </Text>
            </View>
          </View>

          <Text style={styles.holidayDate}>
            <Ionicons name="calendar-outline" size={12} color="#6b7280" />
            {' '}{formatDate(item.date)}
          </Text>

          {item.description && (
            <Text style={styles.holidayDescription}>
              {item.description}
            </Text>
          )}

          {isPast && (
            <View style={styles.pastBadge}>
              <Text style={styles.pastBadgeText}>Past</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderMonthSelector = () => {
    const currentYear = new Date().getFullYear();
    
    return (
      <View style={styles.monthSelectorContainer}>
        <TouchableOpacity
          style={styles.monthArrow}
          onPress={() => {
            if (selectedMonth === 0) {
              setSelectedMonth(11);
              setSelectedYear(selectedYear - 1);
            } else {
              setSelectedMonth(selectedMonth - 1);
            }
          }}
        >
          <Ionicons name="chevron-back" size={20} color="#4b5563" />
        </TouchableOpacity>

        <View style={styles.monthPicker}>
          <Text style={styles.selectedMonth}>
            {months[selectedMonth]} {selectedYear}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.monthArrow}
          onPress={() => {
            if (selectedMonth === 11) {
              setSelectedMonth(0);
              setSelectedYear(selectedYear + 1);
            } else {
              setSelectedMonth(selectedMonth + 1);
            }
          }}
        >
          <Ionicons name="chevron-forward" size={20} color="#4b5563" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={['#f4fbff', '#fdfefe']} style={styles.gradientContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e88e5" />
          <Text style={styles.loadingText}>Loading holidays...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#f4fbff', '#fdfefe']} style={styles.gradientContainer}>
      <View style={styles.container}>
        {/* Header - Fixed to be clearer */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Holidays</Text>
            <Text style={styles.headerSubtitle}>School Calendar</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Student Profile Chip - Shows student name, not holiday related */}
        {student && (
          <LinearGradient
            colors={['#dbeafe', '#e0f2fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileCard}
          >
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>{student.name}</Text>
              <Text style={styles.profileInfo}>
                Class {student.grade} • Section {student.section} • Roll No: {student.rollNumber}
              </Text>
            </View>
            <View style={styles.holidayCountBadge}>
              <Text style={styles.holidayCountText}>{holidays.length} Holidays</Text>
            </View>
          </LinearGradient>
        )}

        {/* Upcoming Holidays Section */}
        {upcomingHolidays.length > 0 && (
          <View style={styles.upcomingSection}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="clock-outline" size={18} color="#2563eb" />
              <Text style={styles.sectionTitle}>Upcoming Holidays</Text>
            </View>
            
            <FlatList
              horizontal
              data={upcomingHolidays}
              keyExtractor={(item) => `upcoming-${item.id}`}
              renderItem={({ item }) => {
                const date = new Date(item.date);
                const diffDays = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <View style={styles.upcomingCard}>
                    <View style={styles.upcomingDateBox}>
                      <Text style={styles.upcomingDay}>{date.getDate()}</Text>
                      <Text style={styles.upcomingMonth}>
                        {date.toLocaleString('default', { month: 'short' })}
                      </Text>
                    </View>
                    <View style={styles.upcomingInfo}>
                      <Text style={styles.upcomingName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Text style={styles.upcomingDaysLeft}>
                        {diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `${diffDays} days left`}
                      </Text>
                    </View>
                  </View>
                );
              }}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.upcomingList}
            />
          </View>
        )}

        {/* Month Selector */}
        {renderMonthSelector()}

        {/* Holidays List */}
        {filteredHolidays.length > 0 ? (
          <FlatList
            data={filteredHolidays}
            keyExtractor={(item) => item.id}
            renderItem={renderHolidayCard}
            contentContainerStyle={styles.holidaysList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#1e88e5']}
                tintColor="#1e88e5"
              />
            }
            ListHeaderComponent={
              <Text style={styles.monthHolidayCount}>
                {filteredHolidays.length} {filteredHolidays.length === 1 ? 'Holiday' : 'Holidays'} in {months[selectedMonth]}
              </Text>
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Holidays</Text>
            <Text style={styles.emptyText}>
              No holidays scheduled for {months[selectedMonth]} {selectedYear}
            </Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileInfo: {
    fontSize: 12,
    color: '#4b5563',
  },
  holidayCountBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  holidayCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  // Upcoming Section
  upcomingSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  upcomingList: {
    paddingRight: 20,
  },
  upcomingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    width: width * 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  upcomingDateBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upcomingDay: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
  },
  upcomingMonth: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: '600',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  upcomingDaysLeft: {
    fontSize: 11,
    color: '#6b7280',
  },
  // Month Selector
  monthSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 6,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  monthArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthPicker: {
    flex: 1,
    alignItems: 'center',
  },
  selectedMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  monthHolidayCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 12,
  },
  // Holidays List
  holidaysList: {
    paddingBottom: 20,
  },
  holidayCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  pastHoliday: {
    opacity: 0.7,
  },
  dateCircle: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  dateDay: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2563eb',
  },
  dateMonth: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  todayBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  holidayDetails: {
    flex: 1,
  },
  holidayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  holidayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  holidayDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  holidayDescription: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
  pastBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  pastBadgeText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});