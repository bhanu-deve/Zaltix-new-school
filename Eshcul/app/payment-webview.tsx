import React, { useRef } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "../api/api";

export default function PaymentWebView() {
  const router = useRouter();
  const { order, feeId, amount } = useLocalSearchParams();
  const webviewRef = useRef(null);

  const parsedOrder = JSON.parse(order as string);

  const html = `
  <html>
    <body>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <script>
        var options = {
          key: "${process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID}",
          amount: "${parsedOrder.amount}",
          currency: "INR",
          name: "Zaltix School",
          description: "Fee Payment",
          order_id: "${parsedOrder.id}",
          handler: function (response){
            window.ReactNativeWebView.postMessage(JSON.stringify(response));
          },
          theme: { color: "#3b82f6" }
        };
        var rzp = new Razorpay(options);
        rzp.open();
      </script>
    </body>
  </html>
  `;

  const handleMessage = async (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);

    try {
      await api.post("/api/payment/verify-payment", {
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        feeId,
        paidAmount: amount,
      });

      Alert.alert("Success", "Payment Successful");
      router.back();
    } catch (err) {
      Alert.alert("Error", "Verification Failed");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{ html }}
        onMessage={handleMessage}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" />}
      />
    </View>
  );
}
