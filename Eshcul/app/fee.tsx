import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';
import { useLang } from './language';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
// import RazorpayCheckout from 'react-native-razorpay';
import { useRouter } from "expo-router";


interface FeeRecord {
  id: string;
  label: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Partial';
}

const FeeScreen = () => {
  const { t } = useLang();
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const router = useRouter();


  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      const rollNo = await AsyncStorage.getItem("rollNo");
      const className = await AsyncStorage.getItem("className");

      if (!rollNo || !className) return;

      const res = await api.get("/api/fees/my-fees", {
        params: { rollNo, className }
      });

      const mapped = res.data.map((f: any, index: number) => ({
        id: f._id,
        label: f.feeType,
        amount: f.amount,
        paidAmount: f.paidAmount,
        dueDate: f.dueDate,
        status:
          f.paidAmount === f.amount
            ? "Paid"
            : f.paidAmount > 0
            ? "Partial"
            : "Unpaid"
      }));

      setFees(mapped);
    } catch (error) {
      console.error("Failed to load fees", error);
    }
  };

  const generateInvoiceHTML = (item: FeeRecord) => `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { color: #444; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; border: 1px solid #ccc; text-align: left; }
        </style>
      </head>
      <body>
        <h1>${t.invoice} - ${item.label}</h1>
        <table>
          <tr><th>Term</th><td>${item.label}</td></tr>
          <tr><th>${t.totalAmount}</th><td>₹${item.amount}</td></tr>
          <tr><th>${t.paidAmount}</th><td>₹${item.paidAmount}</td></tr>
          <tr><th>${t.remaining}</th><td>₹${item.amount - item.paidAmount}</td></tr>
          <tr><th>${t.dueDate}</th><td>${item.dueDate}</td></tr>
          <tr><th>${t.status}</th><td>${item.status}</td></tr>
        </table>
      </body>
    </html>
  `;

  const handlePayment = async (item: FeeRecord) => {
    try {
      const amountToPay = item.amount - item.paidAmount;

      console.log("Creating order for amount:", amountToPay);

      const res = await api.post("/api/payment/create-order", {
        amount: amountToPay,
      });

      console.log("Order created:", res.data);

      router.push({
        pathname: "/payment-webview",
        params: {
          order: JSON.stringify(res.data),
          feeId: item.id,
          amount: amountToPay,
        },
      });

    } catch (err: any) {
      console.log("🔥 PAYMENT ERROR FULL:", err);
      console.log("🔥 RESPONSE:", err?.response?.data);
      console.log("🔥 STATUS:", err?.response?.status);
      console.log("🔥 MESSAGE:", err?.message);

      Alert.alert(
        "Payment Error",
        err?.response?.data?.error ||
        err?.message ||
        "Unknown error"
      );
    }
  };



  const totalFees = fees.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = fees.reduce((sum, item) => sum + item.paidAmount, 0);
  const termsPaid = fees.filter(item => item.status === 'Paid').length;

  const renderCard = ({ item }: { item: FeeRecord }) => {
    const remainingAmount = item.amount - item.paidAmount;
    const isPaid = remainingAmount === 0;
    const isPartial = item.paidAmount > 0 && remainingAmount > 0;

    return (
      <Card style={[
        styles.card,
        isPaid ? styles.paidCard : isPartial ? styles.partialCard : styles.unpaidCard
      ]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📘</Text>
              </View>
              <View style={styles.titleTextContainer}>
                <Text style={styles.title}>{item.label}</Text>
                <Text style={styles.dueDateText}>{t.due}: {item.dueDate}</Text>
              </View>
            </View>
            <View style={[
              styles.statusBadge,
              isPaid ? styles.paidBadge : isPartial ? styles.partialBadge : styles.unpaidBadge
            ]}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>💰 {t.totalAmount}:</Text>
              <Text style={styles.detailValue}>₹{item.amount.toLocaleString()}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>✅ {t.paidAmount}:</Text>
              <Text style={styles.detailValue}>₹{item.paidAmount.toLocaleString()}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>⚖️ {t.remaining}:</Text>
              <Text style={[
                styles.remainingAmount,
                remainingAmount === 0 ? styles.paidAmount : styles.unpaidAmount
              ]}>
                ₹{remainingAmount.toLocaleString()}
              </Text>
            </View>
          </View>
        </Card.Content>

        <Card.Actions style={styles.actions}>
          <Button
            mode="outlined"
            style={styles.invoiceButton}
            labelStyle={styles.invoiceButtonText}
            onPress={() => handleDownloadInvoice(item)}
          >
            📄 {t.invoice}
          </Button>

          {!isPaid && (
            <Button
              mode="contained"
              style={styles.payButton}
              labelStyle={styles.payButtonText}
              onPress={() => handlePayment(item)}
            >
              💳 {t.payNow}
            </Button>
          )}
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹{totalFees.toLocaleString()}</Text>
          <Text style={styles.statLabel}>{t.totalFees}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹{totalPaid.toLocaleString()}</Text>
          <Text style={styles.statLabel}>{t.paidAmount}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{termsPaid}/{fees.length}</Text>
          <Text style={styles.statLabel}>{t.termsPaid}</Text>
        </View>
      </View>

      <FlatList
        data={fees}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Toast />
    </View>
  );
};

export default FeeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0,
  },
  cardContent: {
    padding: 12,
  },
  paidCard: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  partialCard: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  unpaidCard: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    padding: 6,
    marginRight: 10,
    marginTop: 2,
  },
  icon: {
    fontSize: 16,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  dueDateText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  paidBadge: {
    backgroundColor: '#10b981',
  },
  partialBadge: {
    backgroundColor: '#f59e0b',
  },
  unpaidBadge: {
    backgroundColor: '#ef4444',
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 12,
    marginTop: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabelContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '700',
  },
  paidAmountText: {
    color: '#10b981',
  },
  unpaidAmountText: {
    color: '#64748b',
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  paidAmount: {
    color: '#10b981',
  },
  unpaidAmount: {
    color: '#ef4444',
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  invoiceButton: {
    borderRadius: 8,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    paddingHorizontal: 12,
    minWidth: 90,
    height: 36,
  },
  invoiceButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  payButton: {
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    minWidth: 100,
    height: 36,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  payButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});

