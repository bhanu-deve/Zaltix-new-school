// import React from 'react';
// import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
// import { Card, Title, Paragraph, Button } from 'react-native-paper';
// import * as Print from 'expo-print';
// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';
// import Toast from 'react-native-toast-message';

// interface FeeRecord {
//   id: string;
//   label: string;
//   amount: number;
//   dueDate: string;
//   status: 'Paid' | 'Unpaid';
// }

// const termWiseData: FeeRecord[] = [
//   { id: '1', label: 'Term 1', amount: 15000, dueDate: '2025-06-01', status: 'Paid' },
//   { id: '2', label: 'Term 2', amount: 15000, dueDate: '2025-09-01', status: 'Unpaid' },
//   { id: '3', label: 'Term 3', amount: 15000, dueDate: '2025-12-01', status: 'Unpaid' },
// ];

// const FeeScreen = () => {
//   const generateInvoiceHTML = (item: FeeRecord) => `
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial; padding: 20px; }
//           h1 { color: #444; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th, td { padding: 10px; border: 1px solid #ccc; text-align: left; }
//         </style>
//       </head>
//       <body>
//         <h1>Invoice - ${item.label}</h1>
//         <table>
//           <tr><th>Term</th><td>${item.label}</td></tr>
//           <tr><th>Amount</th><td>₹${item.amount}</td></tr>
//           <tr><th>Due Date</th><td>${item.dueDate}</td></tr>
//           <tr><th>Status</th><td>${item.status}</td></tr>
//           <tr><th>Remaining</th><td>₹${item.status === 'Paid' ? 0 : item.amount}</td></tr>
//         </table>
//       </body>
//     </html>
//   `;

//   const handleDownloadInvoice = async (item: FeeRecord) => {
//     try {
//       const html = generateInvoiceHTML(item);
//       const { uri } = await Print.printToFileAsync({ html });

//       const newPath = `${FileSystem.documentDirectory}Invoice_${item.label.replace(
//         ' ',
//         '_'
//       )}.pdf`;

//       await FileSystem.moveAsync({ from: uri, to: newPath });

//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(newPath);
//       } else {
//         Alert.alert('Saved', 'Invoice saved successfully');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to generate or save invoice');
//     }
//   };

//   const handlePayment = (item: FeeRecord) => {
//     Toast.show({
//       type: 'success',
//       text1: 'Payment Successful',
//       text2: `${item.label} fee has been paid 🎉`,
//     });
//   };

//   const renderCard = ({ item }: { item: FeeRecord }) => {
//     const remainingAmount = item.status === 'Paid' ? 0 : item.amount;

//     return (
//       <Card style={[styles.card, item.status === 'Paid' ? styles.paid : styles.unpaid]}>
//         <Card.Content>
//           <View style={styles.headerRow}>
//             <Title style={styles.title}>{item.label}</Title>
//             <Text style={item.status === 'Paid' ? styles.badgePaid : styles.badgeUnpaid}>
//               {item.status}
//             </Text>
//           </View>

//           <Paragraph style={styles.paragraph}>💰 Amount: ₹{item.amount}</Paragraph>
//           <Paragraph style={styles.paragraph}>📅 Due Date: {item.dueDate}</Paragraph>
//           <Paragraph style={styles.remaining}>
//             Remaining Amount: ₹{remainingAmount}
//           </Paragraph>
//         </Card.Content>

//         <Card.Actions style={styles.actions}>
//           <Button onPress={() => handleDownloadInvoice(item)}>
//             Download Invoice
//           </Button>
//           {item.status === 'Unpaid' && (
//             <Button
//               mode="contained"
//               buttonColor="#2575fc"
//               textColor="#fff"
//               onPress={() => handlePayment(item)}
//             >
//               Pay Now
//             </Button>
//           )}
//         </Card.Actions>
//       </Card>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.screenTitle}>📘 Fee Details</Text>
//       <FlatList
//         data={termWiseData}
//         keyExtractor={(item) => item.id}
//         renderItem={renderCard}
//         contentContainerStyle={styles.listContainer}
//       />
//       <Toast />
//     </View>
//   );
// };

// export default FeeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f5f7fa',
//   },
//   screenTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2575fc',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   listContainer: {
//     paddingBottom: 16,
//   },
//   card: {
//     marginVertical: 8,
//     borderRadius: 16,
//     elevation: 3,
//   },
//   paid: {
//     backgroundColor: '#e0ffe6',
//   },
//   unpaid: {
//     backgroundColor: '#ffe0e0',
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   badgePaid: {
//     backgroundColor: 'green',
//     color: 'white',
//     fontWeight: 'bold',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     fontSize: 12,
//   },
//   badgeUnpaid: {
//     backgroundColor: 'red',
//     color: 'white',
//     fontWeight: 'bold',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     fontSize: 12,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   paragraph: {
//     fontSize: 15,
//     marginTop: 4,
//     color: '#333',
//   },
//   remaining: {
//     fontSize: 16,
//     marginTop: 6,
//     fontWeight: '600',
//     color: '#444',
//   },
//   actions: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 8,
//     paddingBottom: 12,
//   },
// });

import React from 'react';
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';
import { useLang } from './language';


interface FeeRecord {
  id: string;
  label: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Partial';
}

const termWiseData: FeeRecord[] = [
  { id: '1', label: 'Term 1', amount: 15000, paidAmount: 15000, dueDate: '2025-06-01', status: 'Paid' },
  { id: '2', label: 'Term 2', amount: 15000, paidAmount: 5000, dueDate: '2025-09-01', status: 'Partial' },
  { id: '3', label: 'Term 3', amount: 15000, paidAmount: 0, dueDate: '2025-12-01', status: 'Unpaid' },
];

const FeeScreen = () => {
  const { t } = useLang();

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

  const handleDownloadInvoice = async (item: FeeRecord) => {
    try {
      const html = generateInvoiceHTML(item);
      const { uri } = await Print.printToFileAsync({ html });

      const newPath = `${FileSystem.documentDirectory}Invoice_${item.label.replace(' ', '_')}.pdf`;
      await FileSystem.moveAsync({ from: uri, to: newPath });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath);
      } else {
        Alert.alert('Saved', 'Invoice saved successfully');
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t.error, t.invoiceFailed);

    }
  };

  const handlePayment = (item: FeeRecord) => {
    Toast.show({
      type: 'success',
      text1: t.paymentSuccessful,
      text2: `${item.label} fee has been paid 🎉`,
    });
  };

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
              <View style={styles.detailLabelContainer}>
                <Text style={styles.detailLabel}>💰 {t.totalAmount}:</Text>
              </View>
              <Text style={styles.detailValue}>₹{item.amount.toLocaleString()}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Text style={styles.detailLabel}>✅ {t.paidAmount}:</Text>
              </View>
              <Text style={[
                styles.detailValue,
                item.paidAmount > 0 ? styles.paidAmountText : styles.unpaidAmountText
              ]}>
                ₹{item.paidAmount.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Text style={styles.detailLabel}>⚖️ {t.remaining}:</Text>
              </View>
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

  const totalFees = termWiseData.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = termWiseData.reduce((sum, item) => sum + item.paidAmount, 0);
  const termsPaid = termWiseData.filter(item => item.status === 'Paid').length;

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
          <Text style={styles.statValue}>{termsPaid}/{termWiseData.length}</Text>
          <Text style={styles.statLabel}>{t.termsPaid}</Text>
        </View>
      </View>

      <FlatList
        data={termWiseData}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={1}
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
