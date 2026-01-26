import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ReportsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Insights"); // Insights | Overview
  const [selectedMonth, setSelectedMonth] = useState("Nov");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerType, setPickerType] = useState("month"); // 'month' | 'year'

  // Data for pickers
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Generate some years (e.g., current year - 2 to current year + 2)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));

  const openPicker = (type) => {
    setPickerType(type);
    setModalVisible(true);
  };

  const handleSelect = (item) => {
    if (pickerType === "month") {
      setSelectedMonth(item);
    } else {
      setSelectedYear(item);
    }
    setModalVisible(false);
  };

  const renderPickerItem = ({ item }) => {
    const isSelected =
      (pickerType === "month" && item === selectedMonth) ||
      (pickerType === "year" && item === selectedYear);

    return (
      <TouchableOpacity
        style={styles.pickerItem}
        onPress={() => handleSelect(item)}
      >
        <Text style={[styles.pickerText, isSelected && styles.pickerTextSelected]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reports</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Ionicons name="calendar-outline" size={24} color="#2D3436" />
        </TouchableOpacity>
      </View>

      {/* --- MONTH/YEAR FILTER (Handmade Look) --- */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => openPicker("month")}
        >
          <Text style={styles.filterText}>{selectedMonth} ▾</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => openPicker("year")}
        >
          <Text style={styles.filterText}>{selectedYear} ▾</Text>
        </TouchableOpacity>
      </View>

      {/* --- PICKER MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Select {pickerType === "month" ? "Month" : "Year"}
                </Text>
                <FlatList
                  data={pickerType === "month" ? months : years}
                  keyExtractor={(item) => item}
                  renderItem={renderPickerItem}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- TAB SWITCHER --- */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Insights" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("Insights")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Insights" && styles.activeTabText,
            ]}
          >
            Insights
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Overview" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("Overview")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Overview" && styles.activeTabText,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- CONTENT AREA --- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "Insights" ? <InsightsView /> : <OverviewView />}
      </ScrollView>
    </View>
  );
}

// ---------------- SUB-COMPONENTS ---------------- //

function InsightsView() {
  const [distType, setDistType] = useState("Subject"); // Subject | Shift

  return (
    <View>
      {/* STUDY DISTRIBUTION CARD */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Study Distribution</Text>
          {/* Toggle inside the card */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                distType === "Subject" && styles.toggleBtnActive,
              ]}
              onPress={() => setDistType("Subject")}
            >
              <Text
                style={[
                  styles.toggleText,
                  distType === "Subject" && styles.toggleTextActive,
                ]}
              >
                Subject
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                distType === "Shift" && styles.toggleBtnActive,
              ]}
              onPress={() => setDistType("Shift")}
            >
              <Text
                style={[
                  styles.toggleText,
                  distType === "Shift" && styles.toggleTextActive,
                ]}
              >
                Shift
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chartArea}>
          {distType === "Subject" ? (
            <>
              {/* Fake Donut Chart Representation */}
              <View style={styles.donutChartPlaceholder}>
                <View style={[styles.donutSegment, { backgroundColor: "#FF6B6B", height: 100 }]} />
                <View style={[styles.donutSegment, { backgroundColor: "#4ECDC4", height: 70 }]} />
                <View style={[styles.donutSegment, { backgroundColor: "#FFE66D", height: 50 }]} />
                <View style={[styles.donutSegment, { backgroundColor: "#1A535C", height: 30 }]} />
              </View>
              <View style={styles.legendContainer}>
                <LegendItem color="#FF6B6B" label="Advanced Programming" pct="40%" />
                <LegendItem color="#4ECDC4" label="Mobile App Dev" pct="28%" />
                <LegendItem color="#FFE66D" label="Database Systems" pct="20%" />
                <LegendItem color="#1A535C" label="Algorithms" pct="12%" />
              </View>
            </>
          ) : (
            <>
              <View style={styles.donutChartPlaceholder}>
                <View style={[styles.donutSegment, { backgroundColor: "#FF9F43", height: 90 }]} />
                <View style={[styles.donutSegment, { backgroundColor: "#54A0FF", height: 60 }]} />
              </View>
              <View style={styles.legendContainer}>
                <LegendItem color="#FF9F43" label="Morning Shift" pct="60%" />
                <LegendItem color="#54A0FF" label="Evening Shift" pct="40%" />
              </View>
            </>
          )}
        </View>
      </View>

      {/* ADDITIONAL INSIGHTS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Focus Quality</Text>
        <Text style={styles.bodyText}>
          You seem to be more focused during <Text style={{ fontWeight: '700', color: '#1A535C' }}>Morning</Text> sessions. Consider scheduling hard topics then!
        </Text>
      </View>
    </View>
  );
}

function OverviewView() {
  return (
    <View>
      {/* MONTHLY TREND */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Study Trend</Text>
        <View style={styles.barChartContainer}>
          {/* Mock Bars */}
          <Bar day="W1" height={40} />
          <Bar day="W2" height={60} />
          <Bar day="W3" height={35} />
          <Bar day="W4" height={80} />
        </View>
        <Text style={styles.chartSubtitle}>Total Hours: 42h 15m</Text>
      </View>

      {/* MONTH COMPARISON */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Month Comparison</Text>
        <View style={styles.comparisonRow}>
          <View style={styles.compareBox}>
            <Text style={styles.compareLabel}>Last Month</Text>
            <Text style={styles.compareValue}>38h</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#B2BEC3" />
          <View style={styles.compareBox}>
            <Text style={styles.compareLabel}>This Month</Text>
            <Text style={styles.compareValueActive}>42h</Text>
          </View>
        </View>
        <View style={styles.growthBadge}>
          <Text style={styles.growthText}>Wait to go! +10.5% Growth 🚀</Text>
        </View>
      </View>
    </View>
  );
}

function LegendItem({ color, label, pct }) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendPct}>{pct}</Text>
    </View>
  );
}

function Bar({ day, height }) {
  return (
    <View style={styles.barWrapper}>
      <View style={[styles.barFill, { height: height, backgroundColor: height > 50 ? '#4ECDC4' : '#FF6B6B' }]} />
      <Text style={styles.barLabel}>{day}</Text>
    </View>
  );
}

// ---------------- STYLES ---------------- //

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFBF7", // Soft warm paper stats
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800", // Thicker font
    color: "#2D3436",
    fontFamily: "System", // Or custom if available
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  calendarButton: {
    padding: 8,
  },

  // Hand-made Filter Chips
  filterContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    // Slight rotation for handmade feel? Maybe too risky for layout, let's keep it straight but styled
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  filterText: {
    fontWeight: "700",
    color: "#636E72",
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ECECEC",
    borderRadius: 25,
    padding: 4,
    marginBottom: 25,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 22,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontWeight: "600",
    color: "#95A5A6",
    fontSize: 16,
  },
  activeTabText: {
    color: "#2D3436",
    fontWeight: "800",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    // Soft organic shadow
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D3436",
  },

  // Toggles inside card
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F4F6F8",
    borderRadius: 12,
    padding: 2,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B2BEC3",
  },
  toggleTextActive: {
    color: "#2D3436",
    fontWeight: "700",
  },

  // Charts
  chartArea: {
    alignItems: "center",
  },
  donutChartPlaceholder: {
    flexDirection: "row",
    alignItems: "flex-end", // Bars for now to simulate distribution
    justifyContent: 'center',
    gap: 15,
    height: 120,
    marginBottom: 20,
  },
  donutSegment: {
    width: 40,
    borderRadius: 20,
    // height set inline
  },
  legendContainer: {
    width: "100%",
    gap: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendLabel: {
    flex: 1,
    color: "#636E72",
    fontWeight: "600",
    fontSize: 15,
  },
  legendPct: {
    fontWeight: "800",
    color: "#2D3436",
  },

  // Overview Styles
  barChartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 150,
    marginBottom: 15,
    paddingTop: 20,
  },
  barWrapper: {
    alignItems: "center",
  },
  barFill: {
    width: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  barLabel: {
    color: "#B2BEC3",
    fontWeight: "600",
    fontSize: 12,
  },
  chartSubtitle: {
    textAlign: "center",
    color: "#636E72",
    fontWeight: "500",
    marginTop: 5,
  },

  comparisonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 15,
  },
  compareBox: {
    alignItems: "center",
  },
  compareLabel: {
    fontSize: 14,
    color: "#B2BEC3",
    marginBottom: 4,
  },
  compareValue: {
    fontSize: 22,
    fontWeight: "600",
    color: "#636E72",
  },
  compareValueActive: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0984E3",
  },
  growthBadge: {
    backgroundColor: "#E6FAF5",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  growthText: {
    color: "#00B894",
    fontWeight: "700",
  },
  bodyText: {
    color: "#636E72",
    fontSize: 15,
    lineHeight: 22,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    maxHeight: "60%", // Limit height
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
    textAlign: "center",
    marginBottom: 15,
  },
  pickerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F6F8",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 16,
    color: "#636E72",
    fontWeight: "500",
  },
  pickerTextSelected: {
    color: "#0984E3",
    fontWeight: "700",
  },
});
